import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold outline-none transition-[opacity,transform,background-color,color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-95",
  {
    variants: {
      variant: {
        default: "rounded-full bg-accent text-accent-fg hover:opacity-90",
        secondary: "border border-border bg-surface-2 text-accent hover:bg-bg",
        ghost: "text-accent hover:bg-surface-2",
        outline: "border border-border text-fg hover:bg-surface-2",
        danger: "text-danger hover:bg-danger/10",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-xs",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
