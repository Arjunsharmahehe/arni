import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-2xl text-center space-y-6 px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Components
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A collection of carefully crafted UI components. Minimal, precise, and
          designed to feel premium.
        </p>
        <Link
          href="/docs"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Components
        </Link>
      </div>
    </div>
  );
}
