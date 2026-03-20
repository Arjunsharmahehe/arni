import type { Metadata } from "next";
import { CodeTabs } from "@/components/docs/code-tabs";
import { docsSetup } from "@/lib/docs-setup.generated";
import { REGISTRY_ALIAS, REGISTRY_HOMEPAGE } from "@/lib/registry-config";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Setup - Arni",
  description:
    "Set up the Arni registry in your project and install components directly with the shadcn CLI.",
};

export default function SetupPage() {
  const { componentsJsonExample, componentsJsonHtml, installTabs } = docsSetup;

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-8 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Setup
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Configure your project once, then install components directly from the
          registry with one command.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-mono font-medium uppercase tracking-wider text-muted-foreground">
          1. Add registry alias to components.json
        </h2>
        <CodeTabs
          tabs={[
            {
              label: "components.json",
              title: "components.json",
              code: componentsJsonExample,
              highlightedHtml: componentsJsonHtml,
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-mono font-medium uppercase tracking-wider text-muted-foreground">
          2. Install a component from this registry
        </h2>
        <CodeTabs tabs={installTabs} />
      </div>

      <div className="space-y-4 rounded-md border border-border bg-muted/20 p-5">
        <h2 className="text-sm font-mono font-medium uppercase tracking-wider text-muted-foreground">
          Notes
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>
            The registry alias defaults to <code>{REGISTRY_ALIAS}</code>.
            Renaming it may lead to broken component references.
          </li>
          <li>
            If you find a bug, please report it on the{" "}
            <Link
              className="font-bold hover:underline"
              href="https://github.com/arjunsharmahehe/arni/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub issue tracker
            </Link>
            .
          </li>
          <li>This is a open-source project, contributions are welcome!</li>
        </ul>
      </div>
    </div>
  );
}
