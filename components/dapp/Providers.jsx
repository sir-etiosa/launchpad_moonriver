"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";

import { wagmiConfig } from "@/lib/wagmi";
import { ProfileProvider } from "@/components/dapp/ProfileProvider";

const dappTheme = darkTheme({
  accentColor: "#9d5cff",
  accentColorForeground: "#0c0a14",
  borderRadius: "none",
  overlayBlur: "small",
});

dappTheme.colors.modalBackground = "#171226";
dappTheme.colors.profileForeground = "#221a33";
dappTheme.colors.modalBorder = "rgba(214, 204, 240, 0.13)";
dappTheme.colors.generalBorder = "rgba(214, 204, 240, 0.13)";
dappTheme.shadows.dialog = "0 24px 60px rgba(0, 0, 0, 0.6)";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={dappTheme} modalSize="compact">
          <ProfileProvider>{children}</ProfileProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
