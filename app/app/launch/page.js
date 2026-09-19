import LaunchForm from "@/components/dapp/LaunchForm";

export const metadata = {
  title: "Launch a token",
};

export default function LaunchPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 pt-8">
      <header>
        <p className="label m-0">New launch</p>
        <h1 className="mt-4 mb-0 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
          Launch a token
        </h1>
        <p className="mt-4 mb-0 max-w-[58ch] text-base leading-[1.7] text-quiet">
          Your token opens on a bonding curve. When the cap fills it graduates to
          Uniswap and the curve closes.
        </p>
      </header>

      <LaunchForm />
    </div>
  );
}
