"use client";

import Link from "next/link";
import { useEffect } from "react";

import Button from "@/components/Button";
import ErrorState from "@/components/ErrorState";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled render error:", error);
  }, [error]);

  return (
    <ErrorState
      code="Error"
      title="This page failed to render"
      body="Something broke while loading. It is not anything you did. Try again, and if it keeps happening, send us the reference below."
      detail={error.digest ? `Reference ${error.digest}` : undefined}
    >
      <Button onClick={reset} variant="primary">
        Try again
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
