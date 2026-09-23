import Image from "next/image";

import { SocialLink } from "@/components/socialIcons";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <a href="#top" aria-label="Moonriver.fun home">
          <Image
            src="/assets/logo.svg"
            alt="Moonriver.fun"
            width={280}
            height={56}
            unoptimized
            className="h-14 w-auto"
          />
        </a>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <a href="#mechanics" className="label no-underline hover:text-paper">
            Docs
          </a>
          <a href="#roadmap" className="label no-underline hover:text-paper">
            Roadmap
          </a>

          <span className="flex items-center gap-5">
            <SocialLink name="X" href="https://x.com/moonriverfun" />
            <SocialLink name="Instagram" href="https://instagram.com/moonriverfun" />
          </span>

          <span className="label" data-numeric="">
            © {year} Moonriver.fun
          </span>
        </div>
      </div>
    </footer>
  );
}
