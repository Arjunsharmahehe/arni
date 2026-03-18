"use client";

import { CodePanel } from "@/components/docs/code-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type CodeTab = {
  label: string;
  title: string;
  code: string;
  highlightedHtml: string;
};

export function CodeTabs({
  tabs,
  className,
}: {
  tabs: CodeTab[];
  className?: string;
}) {
  if (tabs.length === 0) return null;

  return (
    <Tabs defaultValue={tabs[0].label} className={cn("space-y-0", className)}>
      <TabsList variant="line" className="mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          <CodePanel
            title={tab.title}
            code={tab.code}
            highlightedHtml={tab.highlightedHtml}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
