/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: Highlighted HTML is generated from trusted local snippets via Shiki. */
"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { cn } from "@/lib/utils";

const DEFAULT_COLLAPSED_HEIGHT = 420;

type CodePanelProps = {
  code: string;
  highlightedHtml: string;
  title?: string;
  className?: string;
  collapsedHeight?: number;
};

export function CodePanel({
  code,
  highlightedHtml,
  title,
  className,
  collapsedHeight = DEFAULT_COLLAPSED_HEIGHT,
}: CodePanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    const measure = () => {
      const nextIsOverflowing = element.scrollHeight > collapsedHeight + 8;
      setIsOverflowing(nextIsOverflowing);

      if (!nextIsOverflowing) {
        setExpanded(false);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [collapsedHeight]);

  const shouldClamp = isOverflowing && !expanded;

  return (
    <div
      className={cn(
        "group relative rounded-md border border-border bg-neutral-950 text-sm",
        className,
      )}
    >
      {title ? (
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
          <span className="font-mono text-xs text-neutral-400">{title}</span>
        </div>
      ) : null}

      <div className="relative">
        <div
          className={cn("relative", shouldClamp ? "overflow-hidden" : "")}
          style={
            shouldClamp ? { maxHeight: `${collapsedHeight}px` } : undefined
          }
        >
          <div
            ref={contentRef}
            className="overflow-x-auto p-4 [&_pre]:bg-transparent! [&_pre]:p-0! [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_code]:bg-transparent!"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          {shouldClamp ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 via-neutral-950/88 to-transparent" />
          ) : null}
        </div>

        <CopyButton code={code} />
      </div>

      {isOverflowing ? (
        <div className="border-t border-neutral-800 px-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-300 transition-colors hover:text-white"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
