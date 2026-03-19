"use client";

import Image from "next/image";
import {
  FloatingNavbar,
  type FloatingNavbarItem,
} from "@/registry/base-vega/floating-navbar/floating-navbar";

const navigationItems: FloatingNavbarItem[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
];

export function FloatingNavbarPreview() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <section className="relative isolate min-h-120 overflow-hidden rounded-md border border-border bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.18),transparent_45%),radial-gradient(circle_at_80%_90%,hsl(var(--primary)/0.1),transparent_42%),hsl(var(--background))] px-6 py-24 md:px-10">
        <FloatingNavbar
          items={navigationItems}
          className="absolute! left-6! right-6! border border-neutral-800"
          brand={{
            href: "/",
            logo: {
              src: "/logo/arni.png",
              darkSrc: "/logo/arni-dark.png",
              alt: "Studio logo",
              width: 140,
              height: 28,
            },
          }}
          callToAction={{ href: "/contact", label: "Contact Us" }}
        />

        <div className="mx-auto mt-28 max-w-2xl text-center md:mt-32">
          <p className="text-sm text-muted-foreground">Floating Navbar</p>
          <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Array-driven links with optional brand logo or brand text.
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-balance text-sm text-muted-foreground md:text-base">
            The component keeps the original motion behavior while letting you
            configure links, branding, call to action, and mobile menu with
            clean object-based props.
          </p>
        </div>
      </section>
    </div>
  );
}
