import "server-only";

import { cache } from "react";
import { componentNavigation } from "@/lib/component-navigation";
import { getComponent } from "@/lib/component-registry";

export function getAllComponentSlugs() {
  return componentNavigation.map((component) => component.slug);
}

export const getDocsComponentPageData = cache(async (slug: string) => {
  const component = getComponent(slug);

  if (
    !component ||
    !component.sourceCode ||
    !component.highlighted ||
    !component.installCommands
  ) {
    return null;
  }

  return {
    component,
    sourceCode: component.sourceCode,
    usageHtml: component.highlighted.usage,
    sourceHtml: component.highlighted.source,
    installCommands: component.installCommands,
    installHtml: component.highlighted.install,
  };
});
