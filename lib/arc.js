import { defineChain } from "viem";

export const ARC_TESTNET_CHAIN_ID = 5042002;

/**
 * USDC on Arc is unusual: it is BOTH the native gas token and an ERC-20, and the two
 * use different decimals.
 *
 * - Native (gas, `msg.value`, `balance`, `wagmi`'s native balance): 18 decimals
 * - ERC-20 interface (allowance/transferFrom): 6 decimals
 *
 * Treating one as the other is a 10^12 error. Nothing outside this module and
 * `lib/format.js` should hardcode a USDC decimal count.
 */
export const NATIVE_USDC_DECIMALS = 18;
export const ERC20_USDC_DECIMALS = 6;

/** Canonical address of Arc's native USDC asset. */
export const NATIVE_USDC_ADDRESS = "0x3600000000000000000000000000000000000000";

/** Every token launched by this launchpad is a plain 18-decimal ERC-20. */
export const MEME_TOKEN_DECIMALS = 18;

export const ARC_TESTNET = {
  chainId: ARC_TESTNET_CHAIN_ID,
  chainIdHex: `0x${ARC_TESTNET_CHAIN_ID.toString(16)}`,
  name: "Arc Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_ARC_RPC_URL ?? "https://rpc.testnet.arc.io",
  explorerUrl: "https://testnet.arcscan.app",
  faucetUrl: "https://faucet.circle.com",
};

export const arcTestnet = defineChain({
  id: ARC_TESTNET_CHAIN_ID,
  name: ARC_TESTNET.name,
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: NATIVE_USDC_DECIMALS,
  },
  rpcUrls: {
    default: { http: [ARC_TESTNET.rpcUrl] },
  },
  blockExplorers: {
    default: { name: "Arcscan", url: ARC_TESTNET.explorerUrl },
  },
  testnet: true,
});

export function explorerAddressUrl(address) {
  return `${ARC_TESTNET.explorerUrl}/address/${address}`;
}

export function explorerTxUrl(hash) {
  return `${ARC_TESTNET.explorerUrl}/tx/${hash}`;
}
