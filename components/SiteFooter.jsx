import Image from "next/image";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-line py-[22px] text-muted min-[980px]:flex-row min-[980px]:items-center">
      <a href="#top" aria-label="Moonriver.fun home">
        <Image
          src="/assets/logo.svg"
          alt="Moonriver.fun"
          width={150}
          height={30}
          unoptimized
          className="h-[30px] w-auto"
        />
      </a>
      <p className="m-0">© {year} Moonriver.fun. All rights reserved.</p>
    </footer>
  );
}
