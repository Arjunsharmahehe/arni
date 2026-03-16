"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md",
        "border border-neutral-700 bg-neutral-800/80 text-neutral-400",
        "opacity-0 transition-opacity group-hover:opacity-100",
        "hover:bg-neutral-700 hover:text-neutral-200",
      )}
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
