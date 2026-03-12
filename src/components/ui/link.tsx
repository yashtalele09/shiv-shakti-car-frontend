import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const linkVariants = cva(
  "underline transition-colors duration-300 font-medium inline-flex items-center gap-1 sm:gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 dark:focus-visible:ring-cyan-400 hover:cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300",
        muted:
          "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
        destructive:
          "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
      },
      size: {
        sm: "text-xs sm:text-sm",
        default: "text-sm sm:text-base md:text-lg",
        lg: "text-base sm:text-lg md:text-xl",
        xl: "text-lg sm:text-xl md:text-2xl",
      },
      underline: {
        always: "underline",
        hover: "no-underline hover:underline",
        never: "no-underline",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      underline: "always",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      size,
      underline,
      asChild = false,
      external = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "a";

    const externalProps = external
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {};

    return (
      <Comp
        className={linkVariants({ variant, size, underline, className })}
        ref={ref}
        {...externalProps}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Link.displayName = "Link";

export { Link, linkVariants };
