import { CodeTabs } from "@/components/docs/code-tabs";
import {
  REGISTRY_ALIAS,
  REGISTRY_HOMEPAGE,
} from "@/lib/registry-config";
import { docsSetup } from "@/lib/docs-setup.generated";

export const dynamic = "force-static";

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
        <CodeTabs
          tabs={installTabs}
        />
      </div>

      <div className="space-y-4 rounded-md border border-border bg-muted/20 p-5">
        <h2 className="text-sm font-mono font-medium uppercase tracking-wider text-muted-foreground">
          Notes
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>
            The registry alias defaults to <code>{REGISTRY_ALIAS}</code>. Rename
            it if needed, and keep command examples in sync.
          </li>
          <li>
            If your components have <code>registryDependencies</code>, the CLI
            resolves and installs those items automatically.
          </li>
          <li>
            For local testing, point the alias to your local registry URL, for
            example <code>{`${REGISTRY_HOMEPAGE}/r/{name}.json`}</code>.
          </li>
        </ul>
      </div>
    </div>
  );
}
