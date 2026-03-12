import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98] touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[hsl(var(--action-from))] to-[hsl(var(--action-to))] hover:from-[hsl(var(--action-hover-from))] hover:to-[hsl(var(--action-hover-to))] active:from-[hsl(var(--action-active-from))] active:to-[hsl(var(--action-active-to))] text-[hsl(var(--action-foreground))] shadow-md hover:shadow-lg focus-visible:ring-[hsl(var(--action-to))]/50 focus-visible:ring-offset-2 disabled:from-[hsl(var(--action-active-from))] disabled:to-[hsl(var(--action-active-to))] disabled:text-[hsl(var(--action-foreground))] disabled:shadow-none disabled:opacity-60",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 text-white shadow-md hover:shadow-lg focus-visible:ring-red-500/50 focus-visible:ring-offset-2",
        outline:
          "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow focus-visible:ring-gray-400/50 focus-visible:ring-offset-2",
        ghost:
          "text-gray-700 hover:bg-cyan-50 hover:text-gray-900 hover:shadow-sm focus-visible:ring-gray-400/50 focus-visible:ring-offset-2",
        link: "text-[hsl(var(--action-to))] underline-offset-4 hover:underline hover:text-[hsl(var(--action-hover-to))] focus-visible:ring-[hsl(var(--action-to))]/50 px-0",
        sponsor:
          "border-2 border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-500 hover:text-yellow-800 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 transition-all duration-300",
        WITHDRAW:
          "border-2 border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-500 hover:text-orange-800 focus-visible:ring-orange-400/50 focus-visible:ring-offset-2 transition-all duration-200",
        WITHDRAWN:
          "border-2 border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-500 hover:text-orange-800 focus-visible:ring-orange-400/50 focus-visible:ring-offset-2 transition-all duration-200",
      },
      size: {
        default:
          "h-10 px-4 py-2 text-sm sm:h-11 sm:px-5 md:h-12 md:px-6 md:text-base rounded-lg min-w-[80px] sm:min-w-[100px]",
        sm: "h-8 px-3 py-1.5 text-xs sm:h-9 sm:px-4 sm:text-sm rounded-md min-w-[60px] sm:min-w-[80px]",
        lg: "h-12 px-6 py-3 text-base sm:h-13 sm:px-8 md:h-14 md:px-10 md:text-lg rounded-lg min-w-[120px] sm:min-w-[140px]",
        xl: "h-12 px-6 py-3 text-base sm:h-13 sm:px-8 md:h-14 md:px-10 md:text-lg rounded-lg w-full",
        icon: "h-9 w-9 p-0 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-lg [&_svg]:size-4 sm:[&_svg]:size-5 md:[&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    // Determine icon size based on button size
    const getIconSize = () => {
      switch (size) {
        case "sm":
          return "h-3.5 w-3.5 sm:h-4 sm:w-4";
        case "lg":
          return "h-5 w-5 sm:h-6 sm:w-6";
        case "icon":
          return "h-4 w-4 sm:h-5 sm:w-5";
        default:
          return "h-4 w-4 sm:h-5 sm:w-5";
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        type={(props as any)?.type ?? "button"}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2
              className={cn(
                "animate-spin",
                getIconSize(),
                variant === "default" && "text-white",
                variant === "destructive" && "text-white",
                variant === "outline" && "text-cyan-500",
                variant === "secondary" && "text-cyan-500",
                variant === "ghost" && "text-cyan-500",
                variant === "link" && "text-cyan-600",
                variant === "sponsor" && "text-yellow-700",
                variant === "WITHDRAW" && "text-orange-700",
              )}
            />
            {loadingText ? <span>{loadingText}</span> : null}
          </>
        ) : (
          <>
            {children}
            {rightIcon && (
              <span
                className={cn(
                  "ml-1",
                  getIconSize(),
                  "flex items-center justify-center",
                )}
              >
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
