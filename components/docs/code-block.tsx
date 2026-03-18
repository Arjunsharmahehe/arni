import { codeToHtml } from "shiki";
import { CodePanel } from "@/components/docs/code-panel";

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
    <CodePanel
      title={title}
      code={code}
      highlightedHtml={html}
      className={className}
    />
  );
}
