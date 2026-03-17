import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { CodeTabs } from "@/components/docs/code-tabs";
import { ComponentPreview } from "@/components/docs/component-preview";
import { ComponentPreviewRenderer } from "@/components/docs/component-previews";
import { PropsTable, SubComponentsTable } from "@/components/docs/props-table";
import { getComponent } from "@/lib/component-registry";

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = getComponent(slug);

  if (!component) {
    notFound();
  }

  const sourceCode = component.sourcePath
    ? await readFile(path.join(process.cwd(), component.sourcePath), "utf8")
    : component.code;

  if (!sourceCode) {
    notFound();
  }

  // Pre-highlight code on the server
  const [usageHtml, sourceHtml] = await Promise.all([
    codeToHtml(component.usage.trim(), {
      lang: "tsx",
      theme: "github-dark-dimmed",
    }),
    codeToHtml(sourceCode.trim(), {
      lang: "tsx",
      theme: "github-dark-dimmed",
    }),
  ]);

  const codeTabs = [
    {
      label: "Usage",
      title: "example.tsx",
      code: component.usage,
      highlightedHtml: usageHtml,
    },
    {
      label: "Source",
      title: component.sourcePath ?? `components/ui/${slug}.tsx`,
      code: sourceCode,
      highlightedHtml: sourceHtml,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {component.name}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          {component.description}
        </p>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
          Preview
        </h2>
        <ComponentPreview>
          <ComponentPreviewRenderer slug={slug} />
        </ComponentPreview>
      </div>

      {/* Code (tabbed: Usage / Source) */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
          Code
        </h2>
        <CodeTabs tabs={codeTabs} />
      </div>

      {/* Props */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
          Props
        </h2>
        <PropsTable title={component.name} props={component.props} />

        {component.subComponents && component.subComponents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
              Sub-Components
            </h2>
            <SubComponentsTable subComponents={component.subComponents} />
          </div>
        )}
      </div>
    </div>
  );
}
