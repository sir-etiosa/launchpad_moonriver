import Image from "next/image";

import Button from "@/components/Button";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#launches", label: "Launches" },
  { href: "#ecosystem", label: "Ecosystem" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#faq", label: "FAQ" },
];

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 mt-2 flex flex-wrap items-center justify-center gap-5 border-b border-line bg-[rgba(5,15,25,0.45)] pt-[18px] pb-3.5 backdrop-blur-[14px] min-[980px]:flex-nowrap min-[980px]:justify-between min-[980px]:pb-[18px]">
      <a href="#top" className="flex items-center" aria-label="Moonriver.fun home">
        <Image
          src="/assets/logo.svg"
          alt="Moonriver.fun"
          width={210}
          height={42}
          priority
          unoptimized
          className="h-[42px] w-auto"
        />
      </a>

      <nav
        aria-label="Main navigation"
        className="order-3 flex w-full flex-wrap items-center justify-center gap-[22px] min-[980px]:order-none min-[980px]:w-auto min-[980px]:flex-nowrap"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-muted no-underline transition-colors duration-200 hover:text-ink"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex w-full items-center justify-center gap-3 min-[640px]:w-auto min-[640px]:justify-start">
        <Button variant="ghost">Docs</Button>
        <Button variant="primary">Launch App</Button>
      </div>
    </header>
  );
}
