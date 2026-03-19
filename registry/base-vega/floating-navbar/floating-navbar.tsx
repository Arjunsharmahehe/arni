"use client";

import { ArrowRight, Menu } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  type HTMLAttributeAnchorTarget,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type FloatingNavbarItem = {
  href: string;
  label: ReactNode;
  mobileLabel?: ReactNode;
  className?: string;
  mobileClassName?: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
};

export type FloatingNavbarBrandLogoConfig = {
  src: string;
  alt: string;
  darkSrc?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export type FloatingNavbarBrand = {
  href?: string;
  logo?: FloatingNavbarBrandLogoConfig;
  text?: ReactNode;
  content?: ReactNode;
  className?: string;
  textClassName?: string;
};

export type FloatingNavbarCallToAction = {
  href: string;
  label: ReactNode;
  icon?: ReactNode;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
};

export type FloatingNavbarProps = {
  items: FloatingNavbarItem[];
  brand?: FloatingNavbarBrand;
  callToAction?: FloatingNavbarCallToAction;
  leadingSlot?: ReactNode;
  trailingSlot?: ReactNode;
  className?: string;
  contentClassName?: string;
  navClassName?: string;
  navItemClassName?: string;
  mobileSheetClassName?: string;
  mobileNavClassName?: string;
  mobileNavItemClassName?: string;
  mobileSide?: "top" | "right" | "bottom" | "left";
  menuButtonLabel?: string;
};

const DEFAULT_NAV_CLASS =
  "hidden md:flex items-center gap-8 text-sm font-medium";
const DEFAULT_NAV_ITEM_CLASS = "hover:text-primary transition-colors";
const DEFAULT_CTA_CLASS =
  "hidden md:flex group items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-all";
const DEFAULT_MOBILE_ITEM_CLASS =
  "text-2xl font-medium hover:text-primary transition-colors";

export function FloatingNavbarBrandLogo({
  src,
  darkSrc,
  alt,
  width = 140,
  height = 28,
  className,
  priority,
}: FloatingNavbarBrandLogoConfig) {
  if (!darkSrc) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("object-contain dark:hidden", className)}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("hidden object-contain dark:block", className)}
      />
    </>
  );
}

export function FloatingNavbarBrandText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-base font-semibold", className)}>{children}</span>
  );
}

export function FloatingNavbar({
  items,
  brand,
  callToAction,
  leadingSlot,
  trailingSlot,
  className,
  contentClassName,
  navClassName,
  navItemClassName,
  mobileSheetClassName,
  mobileNavClassName,
  mobileNavItemClassName,
  mobileSide = "right",
  menuButtonLabel = "Open menu",
}: FloatingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ maxWidth: "90%" }}
      animate={{
        maxWidth: scrolled ? "100%" : "90%",
        top: scrolled ? "8px" : "28px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-4 right-4 z-50 mx-auto rounded-xl border border-border/40 bg-background/80 backdrop-blur-md md:top-6 md:right-6 md:left-6",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between px-4 py-3",
          contentClassName,
        )}
      >
        <Link
          href={brand?.href ?? "/"}
          className={cn(
            "flex items-center gap-2 font-bold tracking-tight",
            brand?.className,
          )}
        >
          {brand?.content ? (
            brand.content
          ) : (
            <>
              {brand?.logo ? <FloatingNavbarBrandLogo {...brand.logo} /> : null}
              {brand?.text || !brand?.logo ? (
                <FloatingNavbarBrandText className={brand?.textClassName}>
                  {brand?.text ?? "Brand"}
                </FloatingNavbarBrandText>
              ) : null}
            </>
          )}
        </Link>

        <nav className={cn(DEFAULT_NAV_CLASS, navClassName)}>
          {items.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              target={item.target}
              rel={item.rel}
              className={cn(
                DEFAULT_NAV_ITEM_CLASS,
                navItemClassName,
                item.className,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {leadingSlot}
          {callToAction ? (
            <Link
              href={callToAction.href}
              target={callToAction.target}
              rel={callToAction.rel}
              className={cn(DEFAULT_CTA_CLASS, callToAction.className)}
            >
              <span>{callToAction.label}</span>
              {callToAction.icon ?? (
                <ArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={16}
                />
              )}
            </Link>
          ) : null}
          {trailingSlot}

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={menuButtonLabel}
                >
                  <Menu size={24} />
                </Button>
              }
            />
            <SheetContent
              side={mobileSide}
              className={cn("pt-24 pl-8", mobileSheetClassName)}
            >
              <nav className={cn("flex flex-col gap-6", mobileNavClassName)}>
                {items.map((item, index) => (
                  <SheetClose key={`${item.href}-mobile-${index}`}>
                    <Link
                      href={item.href}
                      target={item.target}
                      rel={item.rel}
                      className={cn(
                        DEFAULT_MOBILE_ITEM_CLASS,
                        mobileNavItemClassName,
                        item.mobileClassName,
                      )}
                    >
                      {item.mobileLabel ?? item.label}
                    </Link>
                  </SheetClose>
                ))}
                {callToAction ? (
                  <SheetClose>
                    <Link
                      href={callToAction.href}
                      target={callToAction.target}
                      rel={callToAction.rel}
                      className={cn(
                        DEFAULT_MOBILE_ITEM_CLASS,
                        mobileNavItemClassName,
                        callToAction.className,
                      )}
                    >
                      {callToAction.label}
                    </Link>
                  </SheetClose>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}

export const Navbar = FloatingNavbar;
