import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ComponentPreview({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-md border border-border overflow-hidden",
        className,
      )}
    >
      <div className="flex min-h-87.5 items-center justify-center bg-black p-8">
        {children}
      </div>
    </div>
  );
}
