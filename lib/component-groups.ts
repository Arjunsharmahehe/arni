import type { ComponentNavMeta } from "@/lib/component-registry-schema";

export type ComponentGroup = {
  category: string;
  label: string;
  components: ComponentNavMeta[];
};

function toCategoryLabel(category: string) {
  return category
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function groupComponentsByCategory(
  components: ComponentNavMeta[],
): ComponentGroup[] {
  const groupedComponents = components.reduce<
    Record<string, ComponentNavMeta[]>
  >((groups, component) => {
    const primaryCategory = component.categories?.[0] ?? "other";

    if (!groups[primaryCategory]) {
      groups[primaryCategory] = [];
    }

    groups[primaryCategory].push(component);
    return groups;
  }, {});

  return Object.entries(groupedComponents)
    .map(([category, grouped]) => ({
      category,
      label: category === "other" ? "Other" : toCategoryLabel(category),
      components: [...grouped].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
    }))
    .sort((left, right) => {
      if (left.category === "other") {
        return 1;
      }

      if (right.category === "other") {
        return -1;
      }

      return left.label.localeCompare(right.label);
    });
}
