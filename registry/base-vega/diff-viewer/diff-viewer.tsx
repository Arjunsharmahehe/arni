"use client";

import { File } from "lucide-react";
import {
  Children,
  type CSSProperties,
  cloneElement,
  createContext,
  isValidElement,
  type ReactNode,
  use,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";

type LineType = "add" | "del" | "context";
type DiffPattern = string | RegExp;

export interface DiffHighlightRule {
  name: string;
  pattern: DiffPattern;
  flags?: string;
  className?: string;
  style?: CSSProperties;
}

interface DiffToken {
  className?: string;
  name?: string;
  start: number;
  style?: CSSProperties;
  value: string;
}

interface DiffSegment {
  className?: string;
  marked: boolean;
  start: number;
  style?: CSSProperties;
  value: string;
}

const DiffLineContext = createContext<LineType>("context");

export const DEFAULT_DIFF_HIGHLIGHT_RULES: DiffHighlightRule[] = [
  {
    name: "comment",
    pattern: String.raw`//[^\n]*`,
    style: { color: "#737373" },
  },
  {
    name: "string",
    pattern: "\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`",
    style: { color: "#fbbf24" },
  },
  {
    name: "keyword",
    pattern: String.raw`\b(?:import|from|export|default|return|const|let|var|function|class|new|if|else|for|while|switch|case|break|continue|async|await|try|catch|finally|throw|extends|implements|interface|type|as|in|of|true|false|null|undefined)\b`,
    style: { color: "#38bdf8" },
  },
  {
    name: "type",
    pattern: String.raw`\b[A-Z][A-Za-z0-9_$]*\b`,
    style: { color: "#5eead4" },
  },
  {
    name: "number",
    pattern: String.raw`\b\d+(?:\.\d+)?\b`,
    style: { color: "#a3e635" },
  },
  {
    name: "function",
    pattern: String.raw`\b[a-zA-Z_$][\w$]*(?=\s*\()`,
    style: { color: "#fb7185" },
  },
  {
    name: "operator",
    pattern: String.raw`===|!==|=>|<=|>=|&&|\|\||[=<>+\-*/%!?.,:]`,
    style: { color: "#d4d4d8" },
  },
];

const DiffHighlightRulesContext = createContext<DiffHighlightRule[]>(
  DEFAULT_DIFF_HIGHLIGHT_RULES,
);

function getStickyFlags(flags: string) {
  return Array.from(new Set(`${flags.replace(/[gy]/g, "")}y`.split(""))).join(
    "",
  );
}

function toStickyPattern(pattern: DiffPattern, flags?: string) {
  if (pattern instanceof RegExp) {
    return new RegExp(pattern.source, getStickyFlags(pattern.flags));
  }

  return new RegExp(pattern, getStickyFlags(flags ?? ""));
}

function tokenizeCode(code: string, rules: DiffHighlightRule[]) {
  const matchers = rules.map((rule) => ({
    ...rule,
    matcher: toStickyPattern(rule.pattern, rule.flags),
  }));

  const tokens: DiffToken[] = [];
  let index = 0;

  while (index < code.length) {
    let nextToken: DiffToken | null = null;

    for (const rule of matchers) {
      rule.matcher.lastIndex = index;
      const match = rule.matcher.exec(code);
      const value = match?.[0];

      if (!value) {
        continue;
      }

      nextToken = {
        className: rule.className,
        name: rule.name,
        start: index,
        style: rule.style,
        value,
      };
      break;
    }

    if (!nextToken) {
      let end = index + 1;

      while (end < code.length) {
        let matched = false;

        for (const rule of matchers) {
          rule.matcher.lastIndex = end;

          if (rule.matcher.exec(code)?.[0]) {
            matched = true;
            break;
          }
        }

        if (matched) {
          break;
        }

        end += 1;
      }

      nextToken = {
        start: index,
        value: code.slice(index, end),
      };
    }

    tokens.push(nextToken);
    index += nextToken.value.length;
  }

  return tokens;
}

function buildMarkMap(code: string, marks: string[]) {
  const map = new Array(code.length).fill(false);

  for (const mark of marks) {
    if (!mark) {
      continue;
    }

    let from = 0;

    while (from < code.length) {
      const index = code.indexOf(mark, from);

      if (index < 0) {
        break;
      }

      for (let cursor = index; cursor < index + mark.length; cursor += 1) {
        map[cursor] = true;
      }

      from = index + 1;
    }
  }

  return map;
}

function buildCodeSegments(
  code: string,
  rules: DiffHighlightRule[],
  marks: string[],
) {
  const tokens = tokenizeCode(code, rules);
  const markMap = buildMarkMap(code, marks);
  const segments: DiffSegment[] = [];

  for (const token of tokens) {
    let index = 0;

    while (index < token.value.length) {
      const marked = markMap[token.start + index] ?? false;
      let cursor = index + 1;

      while (
        cursor < token.value.length &&
        (markMap[token.start + cursor] ?? false) === marked
      ) {
        cursor += 1;
      }

      segments.push({
        className: token.className,
        marked,
        start: token.start + index,
        style: token.style,
        value: token.value.slice(index, cursor),
      });

      index = cursor;
    }
  }

  return segments;
}

interface DiffViewerProps {
  children: ReactNode;
  className?: string;
  filename?: string;
  panes?: 1 | 2;
  highlightRules?: DiffHighlightRule[];
}

function DiffViewer({
  children,
  className,
  filename,
  panes = 2,
  highlightRules = DEFAULT_DIFF_HIGHLIGHT_RULES,
}: DiffViewerProps) {
  return (
    <DiffHighlightRulesContext value={highlightRules}>
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 font-mono text-[13px] leading-6 shadow-2xl",
          className,
        )}
      >
        {filename && (
          <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-4 py-4">
            <File className="size-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-500">{filename}</span>
          </div>
        )}

        <div
          className={`grid grid-cols-1 divide-y divide-neutral-800 ${panes === 1 ? "" : "md:grid-cols-2"} md:divide-x md:divide-y-0`}
        >
          {children}
        </div>
      </div>
    </DiffHighlightRulesContext>
  );
}

interface DiffPanelProps {
  children: ReactNode;
  className?: string;
  side: "before" | "after";
}

function DiffPanel({ children, className, side }: DiffPanelProps) {
  return (
    <div data-side={side} className={cn("overflow-x-auto", className)}>
      {children}
    </div>
  );
}

const LINE_STYLES = {
  add: {
    bg: "bg-emerald-500/8",
    bar: "border-l-emerald-500",
    numColor: "text-emerald-600/50",
    sign: "+",
    signColor: "text-emerald-500",
  },
  context: {
    bg: "",
    bar: "border-l-transparent",
    numColor: "text-neutral-700",
    sign: " ",
    signColor: "text-transparent",
  },
  del: {
    bg: "bg-red-500/8",
    bar: "border-l-red-500",
    numColor: "text-red-500/50",
    sign: "-",
    signColor: "text-red-500",
  },
} as const;

interface DiffLineProps {
  children: ReactNode;
  className?: string;
  disableHighlighting?: boolean;
  highlightRules?: DiffHighlightRule[];
  number?: number;
  type?: LineType;
}

function getTokenStyle(style?: CSSProperties) {
  if (!style) {
    return undefined;
  }

  const nextStyle: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(style)) {
    if (value === undefined || key === "color") {
      continue;
    }

    nextStyle[key] = value;
  }

  if (style.color) {
    nextStyle["--diff-token-color"] = String(style.color);
    nextStyle.color = "var(--diff-mark-text-color, var(--diff-token-color))";
  }

  return nextStyle as CSSProperties;
}

function highlightTextContent(
  text: string,
  rules: DiffHighlightRule[],
  keyPrefix: string,
  withinMark: boolean,
) {
  if (withinMark || text.length === 0) {
    return text;
  }

  return tokenizeCode(text, rules).map((token, index) => (
    <span
      key={`${keyPrefix}-${index}-${token.start}`}
      className={token.className}
      style={getTokenStyle(token.style)}
    >
      {token.value}
    </span>
  ));
}

function shouldSkipHighlighting(props: Record<string, unknown>) {
  return (
    props["data-diff-highlight"] === "off" ||
    props["data-diff-highlight"] === false
  );
}

function highlightNode(
  node: ReactNode,
  rules: DiffHighlightRule[],
  keyPrefix: string,
  withinMark = false,
): ReactNode {
  if (typeof node === "string") {
    return highlightTextContent(node, rules, keyPrefix, withinMark);
  }

  if (typeof node === "number") {
    return highlightTextContent(String(node), rules, keyPrefix, withinMark);
  }

  if (Array.isArray(node)) {
    return node.map((child, index) =>
      highlightNode(child, rules, `${keyPrefix}-${index}`, withinMark),
    );
  }

  if (!isValidElement(node)) {
    return node;
  }

  const props = node.props as Record<string, unknown>;

  if (shouldSkipHighlighting(props)) {
    return node;
  }

  if (!("children" in props)) {
    return node;
  }

  const nextChildren = Children.map(
    props.children as ReactNode,
    (child, index) =>
      highlightNode(
        child,
        rules,
        `${keyPrefix}-${index}`,
        withinMark || node.type === DiffMark,
      ),
  );

  return cloneElement(node, undefined, nextChildren);
}

function DiffLine({
  children,
  className,
  disableHighlighting = false,
  highlightRules,
  number: lineNumber,
  type = "context",
}: DiffLineProps) {
  const style = LINE_STYLES[type];
  const inheritedRules = use(DiffHighlightRulesContext);
  const rules = highlightRules ?? inheritedRules;
  const highlightedChildren = useMemo(
    () =>
      disableHighlighting
        ? children
        : Children.map(children, (child, index) =>
            highlightNode(
              child,
              rules,
              `diff-line-${lineNumber ?? "x"}-${index}`,
            ),
          ),
    [children, disableHighlighting, lineNumber, rules],
  );

  return (
    <DiffLineContext value={type}>
      <div
        className={cn(
          "flex items-baseline border-l-[3px] pr-4",
          style.bg,
          style.bar,
          className,
        )}
      >
        {lineNumber !== undefined && (
          <span
            className={cn(
              "w-8 shrink-0 select-none text-right text-[11px]",
              style.numColor,
            )}
          >
            {lineNumber}
          </span>
        )}

        <span
          className={cn(
            "w-5 shrink-0 select-none text-center text-xs",
            style.signColor,
          )}
        >
          {style.sign}
        </span>

        <span className="whitespace-pre text-neutral-300">
          {highlightedChildren}
        </span>
      </div>
    </DiffLineContext>
  );
}

interface DiffCodeProps {
  className?: string;
  code: string;
  marks?: string[];
  rules?: DiffHighlightRule[];
}

function DiffCode({
  className,
  code,
  marks = [],
  rules = DEFAULT_DIFF_HIGHLIGHT_RULES,
}: DiffCodeProps) {
  const segments = useMemo(
    () => buildCodeSegments(code, rules, marks),
    [code, marks, rules],
  );

  return (
    <span className={className}>
      {segments.map((segment) => {
        const content = (
          <span className={segment.className} style={segment.style}>
            {segment.value}
          </span>
        );

        const key = `${segment.start}-${segment.value}-${segment.marked ? "mark" : "plain"}`;

        if (!segment.marked) {
          return <span key={key}>{content}</span>;
        }

        return <DiffMark key={key}>{content}</DiffMark>;
      })}
    </span>
  );
}

interface DiffMarkProps {
  children: ReactNode;
  markClassName?: string;
  className?: string;
}

function DiffMark({ children, className, markClassName }: DiffMarkProps) {
  const lineType = use(DiffLineContext);

  const markBg =
    lineType === "add"
      ? "bg-emerald-500/25"
      : lineType === "del"
        ? "bg-red-500/25"
        : "bg-neutral-500/25";

  return (
    <span className={cn("rounded-sm px-0.5", markBg, markClassName)}>
      <span className={className}>{children}</span>
    </span>
  );
}

DiffPanel.displayName = "DiffPanel";

export {
  DiffViewer,
  DiffPanel,
  DiffLine,
  DiffCode,
  DiffMark,
  buildCodeSegments,
  tokenizeCode,
};
export type {
  DiffViewerProps,
  DiffPanelProps,
  DiffLineProps,
  DiffCodeProps,
  DiffMarkProps,
  LineType,
};
