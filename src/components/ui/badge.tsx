import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted shadow-[var(--shadow-border)]",
        className,
      )}
      {...props}
    />
  );
}
