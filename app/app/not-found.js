import Link from "next/link";

import Button from "@/components/Button";
import ErrorState from "@/components/ErrorState";

export default function DappNotFound() {
  return (
    <ErrorState
      code="404 — unknown token"
      title="That token is not on the ledger"
      body="No launch matches this address. If it graduated, it has left the curve and now trades on Uniswap. Otherwise the address may be mistyped."
    >
      <Button as={Link} href="/app" variant="primary">
        Back to the ledger
      </Button>
      <Link
        href="/"
        className="text-base font-semibold tracking-tight text-quiet no-underline underline-offset-[6px] transition-colors duration-150 hover:text-paper hover:underline"
      >
        Back to home
      </Link>
    </ErrorState>
  );
}
