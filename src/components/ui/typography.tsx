import { cn } from "@/lib/utils";
import React from "react";

type TypographyProps = {
  variant?: "h1" | "h2" | "h3" | "p" | "p2" | "small" | "blockquote" | "code";
  color?: "default" | "primary" | "secondary" | "muted";
  weight?: "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  media?: "sm" | "md" | "lg";
  font?: "sans" | "abril";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

function Typography({
  variant = "p",
  color = "default",
  weight = "regular",
  align = "left",
  font = "sans",
  className,
  children,
  ...props
}: TypographyProps) {
  const colorClasses = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
  };

  const weightClasses = {
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const variantClasses = {
    h1: "text-[2.375rem] md:text-[3rem] lg:text-[3.375rem]",
    h2: "text-[1.5rem] md:text-[1.875rem] lg:text-[2.125rem]",
    h3: "text-[1rem] md:text-[1.125rem] lg:text-[1.375rem]",
    p: "text-[0.875rem] md:text-[1rem] lg:text-[1.125rem]",
    p2: "text-[0.75rem] md:text-[0.813rem] lg:text-[0.875rem]",
    small: "text-[0.625rem] md:text-[0.688rem] lg:text-[0.75rem]",
    blockquote: "text-lg italic border-l-4 border-primary pl-4",
    code: "font-mono text-sm bg-muted rounded px-1 py-0.5",
  };
  const lineHeightsClasses = {
    h1: "leading-[125%] md:leading-[125%] lg:leading-[125%]",
    h2: "leading-[134%] md:leading-[134%] lg:leading-[134%]",
    h3: "leading-[145%] md:leading-[145%] lg:leading-[145%]",
    p: "leading-[153%] md:leading-[153%] lg:leading-[155%]",
    p2: "md:leading-[140%] lg:leading-[140%]",
    small: "leading-[140%] md:leading-[140%] lg:leading-[140%]",
    blockquote: "leading-[1.75rem]",
    code: "leading-[1.25rem]",
  };
  const fontClasses = {
    sans: "font-sans",
    abril: "font-abril",
  };

  const classes = cn(
    variantClasses[variant],
    lineHeightsClasses[variant],
    colorClasses[color],
    weightClasses[weight],
    alignClasses[align],
    fontClasses[font],
    className
  );

  switch (variant) {
    case "h1":
      return (
        <h1 className={classes} {...props}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className={classes} {...props}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className={classes} {...props}>
          {children}
        </h3>
      );
    case "blockquote":
      return (
        <blockquote className={classes} {...props}>
          {children}
        </blockquote>
      );
    case "code":
      return (
        <code className={classes} {...props}>
          {children}
        </code>
      );
    default:
      return (
        <p className={classes} {...props}>
          {children}
        </p>
      );
  }
}

export default Typography;
