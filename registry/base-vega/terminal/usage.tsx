"use client";

import { Terminal } from "@/components/ui/terminal";

export function TerminalDemo() {
  return (
    <section className="w-full py-10 md:py-20">
      <Terminal
        commands={[
          "npx shadcn@latest init",
          "npm install motion",
          "npx shadcn@latest add button card",
          "Term Deez Nuts",
        ]}
        outputs={{
          0: [
            "✔ Preflight checks passed.",
            "✔ Created components.json",
            "✔ Initialized project.",
          ],
          1: ["added 1 package in 2s"],
          2: ["✔ Done. Installed button, card."],
        }}
        route="~/workspace/vega"
        windowName="bash - setup"
        variant="mac"
        windowNameAlign="center"
        backgroundVariant="gradient"
        playOnInView
        typingSpeed={45}
        delayBetweenCommands={1000}
      />
    </section>
  );
}

export function WindowsTerminalDemo() {
  return (
    <Terminal
      commands={["pnpm dev", "pnpm build"]}
      outputs={{
        0: ["Ready in 1.8s"],
        1: ["Compiled successfully"],
      }}
      route="C:\\Users\\you\\project"
      windowName="Windows Terminal"
      windowNameAlign="left"
      variant="windows"
    />
  );
}

export function HeaderlessTerminalDemo() {
  return (
    <Terminal
      commands={["docker compose up"]}
      outputs={{
        0: ["[+] Running 6/6", "api-1  | listening on :3000"],
      }}
      route="~/infra/local"
      showWindowPane={false}
      variant="linux"
    />
  );
}
