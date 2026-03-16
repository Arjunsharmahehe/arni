"use client";

import { CopyButton } from "@/components/docs/copy-button";
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
          <div className="group relative rounded-md border border-border bg-neutral-950 text-sm">
            <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
              <span className="font-mono text-xs text-neutral-400">
                {tab.title}
              </span>
            </div>

            <div className="relative">
              <div
                className="overflow-x-auto p-4 [&_pre]:bg-transparent! [&_pre]:p-0! [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_code]:bg-transparent!"
                dangerouslySetInnerHTML={{ __html: tab.highlightedHtml }}
              />
              <CopyButton code={tab.code} />
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
