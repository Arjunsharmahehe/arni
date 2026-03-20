import type { Metadata } from "next";
import Link from "next/link";
import { groupComponentsByCategory } from "@/lib/component-groups";
import { componentNavigation } from "@/lib/component-navigation";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Docs - Arni",
  description:
    "Browse Arni docs and discover minimal, composable UI components ready to drop into your project.",
};

const sortedComponentGroups = groupComponentsByCategory(componentNavigation);

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Introduction
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          A growing collection of UI components built with React, Tailwind CSS,
          and Motion. Each component is designed to be minimal, composable, and
          ready to drop into your project.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-lg font-medium text-foreground">Components</h2>

        {sortedComponentGroups.map((group) => (
          <section key={group.category} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {group.label}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.components.map((component) => (
                <Link
                  key={component.slug}
                  href={`/docs/components/${component.slug}`}
                  className="group rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <h4 className="text-sm font-medium text-foreground group-hover:text-foreground">
                    {component.name}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {component.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
