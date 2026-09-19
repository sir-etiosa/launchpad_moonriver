const STUB = "./lib/stubs/optional-dependency.cjs";

/**
 * Where build output goes.
 *
 * `next dev` and `next build` both write to `.next` by default, so running a production
 * build while the dev server is up clobbers its state and forces a restart. Pointing
 * verification builds at a different directory (see `scripts/build-check.mjs`) lets both
 * run side by side and keeps the dev server hot-reloading through changes.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    resolveAlias: {
      "@x402/core/client": STUB,
      "@x402/evm": STUB,
      "@x402/evm/exact/client": STUB,
      "@x402/evm/upto/client": STUB,
      "@x402/svm/exact/client": STUB,
    },
  },
};

export default nextConfig;
