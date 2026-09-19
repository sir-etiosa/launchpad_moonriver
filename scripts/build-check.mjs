import { spawn } from "node:child_process";

/**
 * A production build that does not touch `.next`, so it can run while the dev server is
 * up. Same check as `next build` — it just writes to `.next-build` instead.
 */
const child = spawn("next", ["build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: ".next-build" },
});

child.on("exit", (code) => process.exit(code ?? 0));
