import Image from "next/image";
import Link from "next/link";

import Button from "@/components/Button";

const navLinks = [
  { href: "#swap", label: "Swap" },
  { href: "#futures", label: "Futures" },
  { href: "#launchpad", label: "Launchpad" },
  { href: "#games", label: "Games" },
];

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-ink/92 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
        <a href="#top" className="flex items-center" aria-label="Moonriver.fun home">
          <Image
            src="/assets/logo.svg"
            alt="Moonriver.fun"
            width={280}
            height={56}
            priority
            unoptimized
            className="h-14 w-auto"
          />
        </a>

        <nav
          aria-label="Main"
          className="order-3 flex w-full flex-wrap items-center gap-x-7 gap-y-2 border-t border-rule pt-3 md:order-none md:w-auto md:border-t-0 md:pt-0"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="label transition-colors duration-150 hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button as={Link} href="/app" variant="primary">
            Open app
          </Button>
        </div>
      </div>
    </header>
  );
}
