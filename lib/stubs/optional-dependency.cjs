// Stub for optional dependencies we never execute.
//
// @rainbow-me/rainbowkit -> @wagmi/connectors -> @base-org/account -> @coinbase/cdp-sdk
// dynamically (and in one case statically) imports the `@x402/*` payment packages.
// That code path only runs for Base Account x402 payments, which this dapp does not
// use — but the static import still has to resolve at build time.
//
// A Proxy makes every named import resolve to a no-op function, so the module loads
// and the unused path stays inert rather than failing the build.
// .cjs so this is unambiguously CommonJS regardless of how the bundler treats .js.
module.exports = new Proxy(
  {},
  {
    get: () => () => {
      throw new Error("x402 stub: this code path is not implemented.");
    },
  },
);
