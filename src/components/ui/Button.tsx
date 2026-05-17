import * as React from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary-600 text-white shadow-md hover:bg-primary-700 active:scale-95",
      secondary: "bg-primary-100 text-primary-700 hover:bg-primary-200 active:scale-95",
      outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:scale-95",
      ghost: "text-gray-600 hover:bg-gray-100 active:scale-95",
      danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-base font-semibold",
      lg: "h-14 px-8 text-lg font-bold",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none gap-2",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);
