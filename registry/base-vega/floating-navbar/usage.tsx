import Image from "next/image";
import {
  FloatingNavbar,
  type FloatingNavbarItem,
} from "@/registry/base-vega/floating-navbar/floating-navbar";

const navItems: FloatingNavbarItem[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
];

// Logo branding variant
<FloatingNavbar
  items={navItems}
  brand={{
    href: "/",
    logo: {
      src: "/logo/ss-black.png",
      darkSrc: "/logo/ss-white.png",
      alt: "Studio logo",
      width: 140,
      height: 28,
    },
  }}
  leadingSlot={
    <Image
      alt="Indian flag"
      src="/logo/india.png"
      height={20}
      width={20}
      className="object-cover"
    />
  }
  callToAction={{ href: "/contact", label: "Contact Us" }}
/>;

// Text branding variant
<FloatingNavbar
  items={navItems}
  brand={{
    href: "/",
    text: "Acme Studio",
  }}
  callToAction={{ href: "/contact", label: "Book a Call" }}
/>;
