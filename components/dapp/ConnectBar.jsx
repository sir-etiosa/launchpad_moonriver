"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { useProfile } from "@/components/dapp/ProfileProvider";

export default function ConnectBar() {
  const { isConnected } = useAccount();
  const { displayName } = useProfile();

  return (
    <div className="flex items-center gap-3">
      {isConnected ? (
        <span className="hidden max-w-32 truncate rounded-full border border-live/40 bg-live-dim px-3 py-1.5 text-sm font-semibold text-live md:inline-block">
          {displayName}
        </span>
      ) : null}
      <ConnectButton
        chainStatus="icon"
        accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
        showBalance={{ smallScreen: false, largeScreen: true }}
      />
    </div>
  );
}
