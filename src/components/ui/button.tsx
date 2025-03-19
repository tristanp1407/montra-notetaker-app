import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer h-7 gap-[2px] rounded-[6px] pt-[6px] pb-[6px] px-[10px] text-primary",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0px_1px_0px_0px_#0000000F] hover:bg-[#184bcd]",
        destructive:
          "bg-destructive text-white shadow-[0px_1px_0px_0px_#0000000F]  focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-[0px_1px_0px_0px_#0000000F]  hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0px_1px_0px_0px_#0000000F]  hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground shadow-[0px_1px_0px_0px_#0000000F] ",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "w-[125px] h-[28px] gap-[2px] rounded-[6px] pt-[6px] pb-[6px] px-[10px]",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
