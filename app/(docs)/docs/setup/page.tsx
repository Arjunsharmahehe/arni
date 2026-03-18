import { codeToHtml } from "shiki";
import { CodeTabs } from "@/components/docs/code-tabs";
import {
  REGISTRY_ALIAS,
  REGISTRY_HOMEPAGE,
  REGISTRY_URL_TEMPLATE,
} from "@/lib/registry-config";

const componentsJsonExample = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  // rest of the file
  // ...
  },
  "registries": {
    "${REGISTRY_ALIAS}": "${REGISTRY_URL_TEMPLATE}"
  }
}`;

const installTabs = [
  {
    label: "npx",
    title: "Install from registry",
    code: `npx shadcn@latest add ${REGISTRY_ALIAS}/hero-background`,
  },
  {
    label: "pnpm dlx",
    title: "Install from registry",
    code: `pnpm dlx shadcn@latest add ${REGISTRY_ALIAS}/hero-background`,
  },
  {
    label: "bunx",
    title: "Install from registry",
    code: `bunx --bun shadcn@latest add ${REGISTRY_ALIAS}/hero-background`,
  },
];

export default async function SetupPage() {
  const [componentsJsonHtml, ...installHtml] = await Promise.all([
    codeToHtml(componentsJsonExample, {
      lang: "json",
      theme: "github-dark-dimmed",
    }),
    ...installTabs.map((tab) =>
      codeToHtml(tab.code, {
        lang: "bash",
        theme: "github-dark-dimmed",
      }),
    ),
  ]);

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
          tabs={installTabs.map((tab, index) => ({
            ...tab,
            highlightedHtml: installHtml[index],
          }))}
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
