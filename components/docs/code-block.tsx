import { codeToHtml } from "shiki";
import { CopyButton } from "@/components/docs/copy-button";
import { cn } from "@/lib/utils";

export async function CodeBlock({
  code,
  language = "tsx",
  title,
  className,
}: {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}) {
  const html = await codeToHtml(code.trim(), {
    lang: language,
    theme: "github-dark-dimmed",
  });

  return (
    <div
      className={cn(
        "group relative rounded-md border border-border bg-neutral-950 text-sm",
        className,
      )}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
          <span className="font-mono text-xs text-neutral-400">{title}</span>
        </div>
      )}

      <div className="relative">
        <div
          className="overflow-x-auto p-4 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <CopyButton code={code} />
      </div>
    </div>
  );
}
