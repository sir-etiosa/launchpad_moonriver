import CtaPanel from "@/components/CtaPanel";
import Faq from "@/components/Faq";
import Games from "@/components/Games";
import Hero from "@/components/Hero";
import Launchpad from "@/components/Launchpad";
import Mechanics from "@/components/Mechanics";
import Roadmap from "@/components/Roadmap";
import SiteFooter from "@/components/SiteFooter";
import Topbar from "@/components/Topbar";
import Trading from "@/components/Trading";

export default function Home() {
  return (
    <>
      <Topbar />
      <main>
        <Hero />
        <Launchpad />
        <Mechanics />
        <Games />
        <Trading />
        <Roadmap />
        <Faq />
        <CtaPanel />
      </main>
      <SiteFooter />
    </>
  );
}
