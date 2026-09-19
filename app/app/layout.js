import Image from "next/image";
import Link from "next/link";

import ConnectBar from "@/components/dapp/ConnectBar";
import Providers from "@/components/dapp/Providers";
import { SocialLink } from "@/components/socialIcons";

export const metadata = {
  title: "App",
  description:
    "Launch, trade and track meme tokens on Arc testnet. Moonriver.fun.",
};

const navItems = [
  { href: "/app", label: "Ledger" },
  { href: "/app/launch", label: "Launch" },
  { href: "/app/games", label: "Games" },
  { href: "/app/portfolio", label: "Portfolio" },
];

const socials = [
  { name: "X", href: "https://x.com/moonriverfun" },
  { name: "Instagram", href: "https://instagram.com/moonriverfun" },
];

export default function DappLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <Providers>
      <div className="text-paper">
        <header className="sticky top-0 z-30 border-b border-rule bg-ink/92 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-6 py-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center" aria-label="Moonriver.fun">
                <Image
                  src="/assets/logo.svg"
                  alt="Moonriver.fun"
                  width={200}
                  height={40}
                  unoptimized
                  priority
                  className="h-10 w-auto"
                />
              </Link>

              <nav aria-label="App" className="hidden items-center gap-6 sm:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="label no-underline transition-colors duration-150 hover:text-paper"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <ConnectBar />
          </div>
        </header>

        <main className="pb-20">{children}</main>

        <footer className="border-t border-rule py-8">
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
            <nav
              aria-label="Elsewhere"
              className="flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              <a
                href="/#mechanics"
                className="label no-underline transition-colors duration-150 hover:text-paper"
              >
                Docs
              </a>

              <span className="flex items-center gap-5">
                {socials.map((item) => (
                  <SocialLink key={item.name} name={item.name} href={item.href} />
                ))}
              </span>
            </nav>

            <span className="label" data-numeric="">
              © {year} Moonriver.fun
            </span>
          </div>
        </footer>
      </div>
    </Providers>
  );
}
