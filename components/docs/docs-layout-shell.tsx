"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/docs/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function DocsLayoutShell({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {header}
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
