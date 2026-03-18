export default function ComponentPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-8 bg-neutral-900 animate-pulse rounded-md w-1/2"></div>
        <div className="h-4 bg-neutral-900 animate-pulse rounded-md w-full max-w-2xl"></div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
          Preview
        </h2>
        <div className="h-64 bg-neutral-900 animate-pulse rounded-md"></div>
      </div>

      {/* Code (tabbed: Usage / Source) */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
          Install
        </h2>
        <div className="h-32 bg-neutral-900 animate-pulse rounded-md"></div>
      </div>

      {/* Code (tabbed: Usage / Source) */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
          Code
        </h2>
        <div className="h-48 bg-neutral-900 animate-pulse rounded-md"></div>
      </div>

      {/* Props */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
          Props
        </h2>
        <div className="h-40 bg-neutral-900 animate-pulse rounded-md"></div>

        <div className="space-y-4">
          <h2 className="text-sm font-mono font-medium text-muted-foreground uppercase tracking-wider">
            Sub-Components
          </h2>
          <div className="h-20 bg-neutral-900 animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
