"use client";

import { GithubIcon } from "lucide-react";
import Link from "next/link";
import {
  FloatingNavbar,
  type FloatingNavbarItem,
} from "@/components/ui/floating-navbar";

export function Navbar() {
  const navItems: FloatingNavbarItem[] = [
    { href: "/docs", label: "Components" },
    { href: "/skill", label: "Skill" },
    { href: "/templates", label: "Templates" },
  ];

  return (
    <div>
      <FloatingNavbar
        className="border-neutral-700"
        items={navItems}
        brand={{
          href: "/",
          text: "Arni",
        }}
        leadingSlot={
          <Link href="https://github.com/arjunsharmahehe/arni">
            <GithubIcon className="size-4" />
          </Link>
        }
      />
    </div>
  );
}
