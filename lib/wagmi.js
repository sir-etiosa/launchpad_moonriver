import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

import { arcTestnet } from "@/lib/arc";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ?? "";
const appName = "Moonriver.fun";

/**
 * WalletConnect (and therefore RainbowKit's full wallet list) needs a free project id
 * from https://cloud.walletconnect.com. `getDefaultConfig` *throws* without one, which
 * would break the build and every SSR render, so when it is missing we fall back to a
 * plain injected-wallet config: MetaMask and friends still connect, the QR/mobile
 * flows and the curated wallet list simply do not appear.
 */
function buildConfig() {
  if (projectId) {
    return getDefaultConfig({ appName, projectId, chains: [arcTestnet], ssr: true });
  }

  console.warn(
    "[moonriver] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set — falling back to " +
      "injected wallets only. Set it to enable WalletConnect and the full wallet list.",
  );

  return createConfig({
    chains: [arcTestnet],
    connectors: [injected()],
    transports: { [arcTestnet.id]: http() },
    ssr: true,
  });
}

export const wagmiConfig = buildConfig();
