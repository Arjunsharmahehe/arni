import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeTabs } from "@/components/docs/code-tabs";
import { ComponentPreview } from "@/components/docs/component-preview";
import { ComponentPreviewRenderer } from "@/components/docs/component-previews";
import { PropsTable, SubComponentsTable } from "@/components/docs/props-table";
import {
  getAllComponentSlugs,
  getDocsComponentPageData,
} from "@/lib/docs-content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllComponentSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await getDocsComponentPageData(slug);

  if (!pageData) {
    return {
      title: "Component - Arni",
      description: "Browse component documentation from the Arni registry.",
    };
  }

  return {
    title: `${pageData.component.name} - Arni`,
    description: pageData.component.description,
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageData = await getDocsComponentPageData(slug);

  if (!pageData) {
    notFound();
  }

  const {
    component,
    installCommands,
    installHtml,
    sourceCode,
    sourceHtml,
    usageHtml,
  } = pageData;

  const installTabs = [
    {
      label: "npx",
      title: "Terminal",
      code: installCommands.npx,
      highlightedHtml: installHtml.npx,
    },
    {
      label: "pnpm dlx",
      title: "Terminal",
      code: installCommands.pnpm,
      highlightedHtml: installHtml.pnpm,
    },
    {
      label: "bunx",
      title: "Terminal",
      code: installCommands.bun,
      highlightedHtml: installHtml.bun,
    },
  ];

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
          Install
        </h2>
        <CodeTabs tabs={installTabs} />
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
