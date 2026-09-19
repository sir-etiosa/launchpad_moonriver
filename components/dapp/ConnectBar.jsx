"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectBar() {
  return (
    <ConnectButton
      chainStatus="icon"
      accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
      showBalance={{ smallScreen: false, largeScreen: true }}
    />
  );
}
