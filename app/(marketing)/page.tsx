"use client";

import { ArrowRight, Github } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal } from "@/components/ui/terminal";

const blurFadeVariants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-6 py-12 md:py-24">
      <section className="mx-auto mt-24 mb-12 grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        <motion.div
          className="order-last md:order-last"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Terminal
            commands={[
              "pnpm dlx shadcn@latest add @arni/linear-card",
              "pnpm dlx shadcn@latest add @arni/floating-navbar",
              `cowsay "Explore the components now"`,
            ]}
            outputs={{
              0: [
                "✔ Checking registry",
                "✔ Installing dependencies.",
                "✔ Created 2 files:",
                "  - components\\reactive-svg\\card-wave.tsx",
                "  - components\\ui\\linear-card.tsx",
              ],
              1: [
                "✔ Checking registry.",
                "✔ Installing dependencies.",
                "√ The file button.tsx already exists. Would you like to overwrite? ... no",
                "✔ Created 2 files:",
                "  - components\\ui\\sheet.tsx",
                "  - components\\ui\\floating-navbar.tsx",
                "ℹ Skipped 1 file: (files might be identical, use --overwrite to overwrite)",
                "  - components\\ui\\button.tsx",
              ],
              2: [
                "____________",
                "Explore the components now",
                "------------",
                "        \\   ^__^",
                "         \\  (oo)\\_______",
                "            (__)\\       )/\n",
                "                ||----w |",
                "                ||     ||",
              ],
            }}
            route="~/projects/react"
            windowName="shadcn - Arni"
            variant="mac"
            windowNameAlign="center"
            backgroundVariant="gradient"
            playOnInView
            typingSpeed={45}
            delayBetweenCommands={1000}
          />
        </motion.div>

        <div className="flex flex-col items-start space-y-8">
          <div className="space-y-4">
            <motion.div
              className="rounded-full flex items-center px-4 py-1 border border-neutral-800 w-fit"
              variants={blurFadeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0 }}
            >
              <span className="text-xs md:text-sm">
                100% Open Source & Free
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              variants={blurFadeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Build <span className="text-primary">faster</span>,
              <br />
              design better.
            </motion.h1>
            <motion.p
              className="max-w-135 text-base md:text-lg leading-relaxed text-muted-foreground sm:text-2xl"
              variants={blurFadeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Arni UI is a curated collection of high-performance components
              built for modern React apps. Beautifully designed, accessible, and
              ready for production.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-wrap gap-4"
            variants={blurFadeVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href="/docs">
                  Browse Components
                  <ArrowRight className="size-4 ml-1" />
                </Link>
              }
            ></Button>
            <Button
              variant="outline"
              nativeButton={false}
              size="lg"
              render={
                <Link
                  href="https://github.com/arjunsharmahehe/arni"
                  target="_blank"
                >
                  <Github className="mr-1 size-4" />
                  Contribute
                </Link>
              }
            ></Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
