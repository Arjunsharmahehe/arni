export const REGISTRY_ALIAS = process.env.NEXT_PUBLIC_REGISTRY_ALIAS ?? "@vega";

export const REGISTRY_URL_TEMPLATE =
  process.env.NEXT_PUBLIC_REGISTRY_URL_TEMPLATE ??
  "http://localhost:3000/r/{name}.json";

export const REGISTRY_HOMEPAGE =
  process.env.NEXT_PUBLIC_REGISTRY_HOMEPAGE ?? "http://localhost:3000";

export function getRegistryItemUrl(name: string) {
  return REGISTRY_URL_TEMPLATE.replace("{name}", name);
}

export function getInstallCommands(slug: string) {
  const target = `${REGISTRY_ALIAS}/${slug}`;

  return {
    npx: `npx shadcn@latest add ${target}`,
    pnpm: `pnpm dlx shadcn@latest add ${target}`,
    bun: `bunx --bun shadcn@latest add ${target}`,
  };
}
