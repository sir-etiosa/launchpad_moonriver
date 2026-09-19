/**
 * PLACEHOLDER DATA — not read from the chain.
 *
 * Renders the shell of the ledger so the UI can be reviewed before any contract is
 * deployed. Phase 2 replaces this module with reads from
 * `LaunchpadFactory.LaunchCreated` logs. Nothing here is a real token or address.
 *
 * Amounts are strings of MVR base units (18 decimals) so they exercise the same
 * `lib/format.js` path that on-chain reads will use.
 */
export const placeholderLaunches = [
  {
    address: "0x1111111111111111111111111111111111111111",
    name: "Nova Drift",
    symbol: "NDX",
    image: "/assets/tokens/nova-drift.svg",
    kind: "launchpad",
    description: "AI-powered liquidity orchestration for DeFi-native communities.",
    creator: "0xA11CE00000000000000000000000000000000001",
    raised: "120000000000000000000000",
    threshold: "5000000000000000000000",
    oneToOneEnabled: true,
    graduated: true,
    createdAt: "2026-07-02T09:14:00.000Z",
  },
  {
    address: "0x2222222222222222222222222222222222222222",
    name: "Zenith Grid",
    symbol: "ZGR",
    image: "/assets/tokens/zenith-grid.svg",
    kind: "meme",
    description: "Cross-chain gaming utility layer built for composable in-game assets.",
    creator: "0xB0B0000000000000000000000000000000000002",
    raised: "3100000000000000000000",
    threshold: "5000000000000000000000",
    oneToOneEnabled: true,
    graduated: false,
    createdAt: "2026-09-08T16:40:00.000Z",
  },
  {
    address: "0x3333333333333333333333333333333333333333",
    name: "Orbital Labs",
    symbol: "ORB",
    image: "/assets/tokens/orbital-labs.svg",
    kind: "launchpad",
    description: "Tokenized research funding and governance for next-gen protocol builders.",
    creator: "0xC0FFEE0000000000000000000000000000000003",
    raised: "5000000000000000000000",
    threshold: "5000000000000000000000",
    oneToOneEnabled: false,
    graduated: true,
    createdAt: "2026-05-19T11:02:00.000Z",
  },
  {
    address: "0x4444444444444444444444444444444444444444",
    name: "Static Bloom",
    symbol: "SBLM",
    image: "/assets/tokens/static-bloom.svg",
    kind: "meme",
    description: "A meme with no roadmap, which is the roadmap.",
    creator: "0xD00D000000000000000000000000000000000004",
    raised: "740000000000000000000",
    threshold: "5000000000000000000000",
    oneToOneEnabled: false,
    graduated: false,
    createdAt: "2026-09-12T21:25:00.000Z",
  },
];

export function findPlaceholderLaunch(address) {
  if (!address) return undefined;
  const target = address.toLowerCase();
  return placeholderLaunches.find((t) => t.address.toLowerCase() === target);
}
