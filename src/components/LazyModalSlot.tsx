import { Suspense, useState, type ReactNode } from "react";

/**
 * Defers mounting (and therefore downloading) a lazily imported modal until it
 * is first opened, then keeps it mounted so close animations and internal state
 * behave exactly like an eagerly rendered modal.
 */
export function LazyModalSlot({ open, children }: { open: boolean; children: ReactNode }) {
  const [hasOpened, setHasOpened] = useState(open);
  if (open && !hasOpened) setHasOpened(true);
  if (!hasOpened && !open) return null;
  return <Suspense fallback={null}>{children}</Suspense>;
}
