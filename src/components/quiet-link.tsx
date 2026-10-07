import Link from "next/link";
import type { ComponentProps } from "react";

export function QuietLink(props: ComponentProps<typeof Link>) {
  return <Link suppressHydrationWarning {...props} />;
}
