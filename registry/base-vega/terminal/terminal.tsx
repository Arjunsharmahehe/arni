"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TerminalIcon } from "lucide-react";

export type TerminalVariant = "mac" | "windows" | "linux";
export type TerminalWindowNameAlign = "left" | "center" | "right";
export type TerminalBackgroundVariant = "solid" | "gradient";

export interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  route?: string;
  windowName?: string;
  windowNameAlign?: TerminalWindowNameAlign;
  showWindowPane?: boolean;
  backgroundVariant?: TerminalBackgroundVariant;
  variant?: TerminalVariant;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  outputLineDelay?: number;
  playOnInView?: boolean;
  inViewMargin?: string;
  className?: string;
  contentClassName?: string;
}

type TerminalHistoryEntry = {
  id: string;
  kind: "command" | "output";
  text: string;
};

type TerminalPhase = "idle" | "typing" | "output" | "delay" | "done";

const PROMPT_SYMBOL: Record<TerminalVariant, string> = {
  linux: "$",
  mac: "$",
  windows: ">",
};

const WINDOW_ALIGN_CLASS: Record<TerminalWindowNameAlign, string> = {
  center: "text-center",
  left: "text-left",
  right: "text-right",
};

export function Terminal({
  commands,
  outputs = {},
  route = "~/projects/nextjs",
  windowName = "bash",
  windowNameAlign = "center",
  showWindowPane = true,
  backgroundVariant = "solid",
  variant = "mac",
  typingSpeed = 45,
  delayBetweenCommands = 1000,
  outputLineDelay = 130,
  playOnInView = false,
  inViewMargin = "0px 0px -10% 0px",
  className,
  contentClassName,
}: TerminalProps) {
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [visibleOutputLines, setVisibleOutputLines] = useState(0);
  const [hasStarted, setHasStarted] = useState(!playOnInView);
  const [phase, setPhase] = useState<TerminalPhase>(() => {
    if (commands.length === 0) {
      return "done";
    }

    return playOnInView ? "idle" : "typing";
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeCommand = commands[currentCommandIndex] ?? "";
  const activeOutput = outputs[currentCommandIndex] ?? [];
  const typedCommand = activeCommand.slice(0, typedChars);
  const finalizedCurrentCommand = useMemo(
    () => history.some((entry) => entry.id === `cmd-${currentCommandIndex}`),
    [currentCommandIndex, history],
  );

  useEffect(() => {
    if (!playOnInView || hasStarted || commands.length === 0) {
      return;
    }

    const node = rootRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasStarted(true);
        setPhase("typing");
        observer.disconnect();
      },
      { rootMargin: inViewMargin, threshold: 0.25 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [commands.length, hasStarted, inViewMargin, playOnInView]);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  });

  useEffect(() => {
    if (!hasStarted || phase === "idle" || phase === "done") {
      return;
    }

    const timeout =
      phase === "typing"
        ? window.setTimeout(() => {
            if (typedChars < activeCommand.length) {
              setTypedChars((current) => current + 1);
              return;
            }

            if (activeOutput.length > 0) {
              setPhase("output");
              return;
            }

            setPhase("delay");
          }, typingSpeed)
        : phase === "output"
          ? window.setTimeout(() => {
              if (visibleOutputLines < activeOutput.length) {
                setVisibleOutputLines((current) => current + 1);
                return;
              }

              setPhase("delay");
            }, outputLineDelay)
          : window.setTimeout(() => {
              setHistory((previous) => {
                const next = [...previous];
                const commandId = `cmd-${currentCommandIndex}`;

                if (!next.some((entry) => entry.id === commandId)) {
                  next.push({
                    id: commandId,
                    kind: "command",
                    text: activeCommand,
                  });
                }

                activeOutput.forEach((line, lineIndex) => {
                  const outputId = `out-${currentCommandIndex}-${lineIndex}`;

                  if (!next.some((entry) => entry.id === outputId)) {
                    next.push({
                      id: outputId,
                      kind: "output",
                      text: line,
                    });
                  }
                });

                return next;
              });

              if (currentCommandIndex >= commands.length - 1) {
                setPhase("done");
                return;
              }

              setCurrentCommandIndex((current) => current + 1);
              setTypedChars(0);
              setVisibleOutputLines(0);
              setPhase("typing");
            }, delayBetweenCommands);

    return () => window.clearTimeout(timeout);
  }, [
    activeCommand,
    activeOutput,
    commands.length,
    currentCommandIndex,
    delayBetweenCommands,
    hasStarted,
    outputLineDelay,
    phase,
    typedChars,
    typingSpeed,
    visibleOutputLines,
  ]);

  const liveOutputEntries = useMemo(() => {
    const seen = new Map<string, number>();

    return activeOutput.slice(0, visibleOutputLines).map((line) => {
      const count = (seen.get(line) ?? 0) + 1;
      seen.set(line, count);

      return {
        id: `live-out-${currentCommandIndex}-${line}-${count}`,
        line,
      };
    });
  }, [activeOutput, currentCommandIndex, visibleOutputLines]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "w-full overflow-hidden rounded-md border border-neutral-700/70 bg-neutral-950 shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      {showWindowPane ? (
        <TerminalWindowPane
          variant={variant}
          windowName={windowName}
          windowNameAlign={windowNameAlign}
        />
      ) : null}

      <div
        ref={scrollContainerRef}
        className={cn(
          "h-[360px] overflow-y-auto p-4 font-mono text-[13px] leading-6 text-neutral-300 md:p-5",
          backgroundVariant === "gradient"
            ? "bg-[radial-gradient(circle_at_top,_rgba(64,64,64,0.28),_rgba(10,10,10,0.96)_42%)]"
            : "bg-neutral-950",
          contentClassName,
        )}
      >
        <div className="space-y-0.5">
          {history.map((entry) =>
            entry.kind === "command" ? (
              <CommandLine
                key={entry.id}
                route={route}
                promptSymbol={PROMPT_SYMBOL[variant]}
                command={entry.text}
              />
            ) : (
              <OutputLine key={entry.id} line={entry.text} />
            ),
          )}

          {hasStarted && phase !== "done" && !finalizedCurrentCommand ? (
            <CommandLine
              route={route}
              promptSymbol={PROMPT_SYMBOL[variant]}
              command={typedCommand}
              cursor
            />
          ) : null}

          {phase !== "typing"
            ? liveOutputEntries.map((entry) => (
                <OutputLine key={entry.id} line={entry.line} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

function TerminalWindowPane({
  variant,
  windowName,
  windowNameAlign,
}: {
  variant: TerminalVariant;
  windowName: string;
  windowNameAlign: TerminalWindowNameAlign;
}) {
  if (variant === "mac") {
    return (
      <div className="flex items-center border-b border-neutral-700 bg-neutral-900 px-3 py-2.5">
        <div className="flex w-16 items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f56]" />
          <span className="size-3 rounded-full bg-[#ffbd2e]" />
          <span className="size-3 rounded-full bg-[#27c93f]" />
        </div>
        <span
          className={cn(
            "grow truncate text-xs font-medium text-neutral-300",
            WINDOW_ALIGN_CLASS[windowNameAlign],
          )}
        >
          {windowName}
        </span>
        <div className="w-16" />
      </div>
    );
  }

  if (variant === "windows") {
    return (
      <div className="flex items-center border-b border-neutral-700 bg-neutral-900 px-2 py-2">
        <div className="bg-blue-600 rounded-xs p-0.5">
          <TerminalIcon className="size-4" />
        </div>
        <span
          className={cn(
            "mx-3 grow truncate text-xs font-medium text-neutral-200",
            WINDOW_ALIGN_CLASS[windowNameAlign],
          )}
        >
          {windowName}
        </span>
        <div className="flex items-center text-[10px] text-neutral-300">
          <span className="grid h-6 w-8 place-items-center hover:bg-white/10">
            -
          </span>
          <span className="grid h-6 w-8 place-items-center hover:bg-white/10">
            □
          </span>
          <span className="grid h-6 w-8 place-items-center hover:bg-red-600/80">
            ×
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center border-b border-neutral-700 bg-[#1f2937] px-3 py-2">
      <div className="flex w-16 items-center gap-1">
        <span className="h-2.5 w-3 rounded-sm bg-neutral-300" />
        <span className="h-2.5 w-3 rounded-sm bg-neutral-500" />
        <span className="h-2.5 w-3 rounded-sm bg-neutral-700" />
      </div>
      <span
        className={cn(
          "grow truncate text-xs font-medium text-neutral-200",
          WINDOW_ALIGN_CLASS[windowNameAlign],
        )}
      >
        {windowName}
      </span>
      <div className="w-16" />
    </div>
  );
}

function CommandLine({
  route,
  promptSymbol,
  command,
  cursor = false,
}: {
  route: string;
  promptSymbol: string;
  command: string;
  cursor?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      <span className="text-emerald-400">{route}</span>
      <span className="text-emerald-500">{promptSymbol}</span>
      <span className="break-all text-neutral-200">
        {command}
        {cursor ? (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-[1.1em] w-[0.58em] translate-y-1 bg-neutral-100"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </span>
    </div>
  );
}

function OutputLine({ line }: { line: string }) {
  return <p className="whitespace-pre-wrap text-neutral-400">{line}</p>;
}
