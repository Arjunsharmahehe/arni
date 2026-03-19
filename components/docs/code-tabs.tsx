"use client";

import { useMemo, useState } from "react";
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

  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0]?.label);
  const activeTab = useMemo(
    () => tabs.find((tab) => tab.label === activeTabLabel) ?? tabs[0],
    [activeTabLabel, tabs],
  );

  return (
    <Tabs
      value={activeTab.label}
      onValueChange={setActiveTabLabel}
      className={cn("space-y-0", className)}
    >
      <TabsList variant="line" className="mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={activeTab.label}>
        <CodePanel
          key={activeTab.label}
          title={activeTab.title}
          code={activeTab.code}
          highlightedHtml={activeTab.highlightedHtml}
        />
      </TabsContent>
    </Tabs>
  );
}
