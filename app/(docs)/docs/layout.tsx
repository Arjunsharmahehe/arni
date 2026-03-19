import { DocsLayoutShell } from "@/components/docs/docs-layout-shell";
import { DocsSidebarTrigger } from "@/components/docs/docs-sidebar-trigger";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayoutShell
      header={
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <DocsSidebarTrigger />
          <div className="mr-2 h-4 w-px bg-border" />
          <span className="text-sm font-medium text-muted-foreground">Docs</span>
        </header>
      }
    >
      {children}
    </DocsLayoutShell>
  );
}
