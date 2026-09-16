import CtaPanel from "@/components/CtaPanel";
import Ecosystem from "@/components/Ecosystem";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Launches from "@/components/Launches";
import Roadmap from "@/components/Roadmap";
import SiteFooter from "@/components/SiteFooter";
import Testimonials from "@/components/Testimonials";
import Topbar from "@/components/Topbar";
import Trusted from "@/components/Trusted";

export default function Home() {
  return (
    <>
      <Topbar />
      <main id="top">
        <Hero />
        <Trusted />
        <Features />
        <Launches />
        <Ecosystem />
        <Roadmap />
        <Testimonials />
        <Faq />
        <CtaPanel />
      </main>
      <SiteFooter />
    </>
  );
}
