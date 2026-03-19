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
import { groupComponentsByCategory } from "@/lib/component-groups";
import { componentNavigation } from "@/lib/component-navigation";

const sortedComponentGroups = groupComponentsByCategory(componentNavigation);

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
