import Link from "next/link";

import Button from "@/components/Button";
import ErrorState from "@/components/ErrorState";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <ErrorState
      code="404 — not found"
      title="This page is not on the ledger"
      body="The address you followed does not match a page on Moonriver.fun. It may have been renamed, or it may never have existed."
    >
      <Button as={Link} href="/app" variant="primary">
        Browse the ledger
      </Button>
      <Link
        href="/"
        className="text-sm font-semibold tracking-tight text-quiet no-underline underline-offset-[6px] transition-colors duration-150 hover:text-paper hover:underline"
      >
        Back to home
      </Link>
    </ErrorState>
  );
}
