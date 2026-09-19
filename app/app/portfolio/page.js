import PortfolioView from "@/components/dapp/PortfolioView";

export const metadata = {
  title: "Portfolio",
};

export default function PortfolioPage() {
  return (
    <div className="max-w-3xl space-y-10 pt-8">
      <header>
        <p className="label m-0">Your wallet</p>
        <h1 className="mt-4 mb-0 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
          Portfolio
        </h1>
      </header>

      <PortfolioView />
    </div>
  );
}
