"use client";

import { Terminal } from "@/registry/base-vega/terminal/terminal";

const commands = [
  "npx shadcn@latest init",
  "npm install motion",
  "npx shadcn@latest add button card",
  'echo "Procedural execution complete"',
];

const outputs = {
  0: [
    "✔ Preflight checks passed.",
    "✔ Created components.json",
    "✔ Initialized project.",
  ],
  1: ["added 1 package in 2s"],
  2: ["✔ Done. Installed button, card."],
  3: ["Procedural execution complete"],
} satisfies Record<number, string[]>;

export function TerminalPreview() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Terminal
        commands={commands}
        outputs={outputs}
        route="~/workspace/vega"
        windowName="bash - setup"
        backgroundVariant="gradient"
        variant="mac"
        typingSpeed={42}
        delayBetweenCommands={950}
      />
    </div>
  );
}
