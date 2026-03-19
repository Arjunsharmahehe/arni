"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { componentRegistry } from "@/lib/component-registry";

function toCategoryLabel(category: string) {
  return category
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const groupedComponents = componentRegistry.reduce<
  Record<string, typeof componentRegistry>
>((groups, component) => {
  const primaryCategory = component.categories?.[0] ?? "other";

  if (!groups[primaryCategory]) {
    groups[primaryCategory] = [];
  }

  groups[primaryCategory].push(component);
  return groups;
}, {});

const sortedComponentGroups = Object.entries(groupedComponents)
  .map(([category, components]) => ({
    category,
    label: category === "other" ? "Other" : toCategoryLabel(category),
    components: [...components].sort((left, right) =>
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

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-1.5">
          <span className="font-semibold text-sm tracking-tight">Arni</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Getting Started</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/docs" />}
                  isActive={pathname === "/docs"}
                >
                  <span>Introduction</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/docs/setup" />}
                  isActive={pathname === "/docs/setup"}
                >
                  <span>Setup</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {sortedComponentGroups.map((group) => (
          <SidebarGroup key={group.category}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.components.map((component) => (
                  <SidebarMenuItem key={component.slug}>
                    <SidebarMenuButton
                      render={
                        <Link href={`/docs/components/${component.slug}`} />
                      }
                      isActive={
                        pathname === `/docs/components/${component.slug}`
                      }
                    >
                      <span>{component.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
