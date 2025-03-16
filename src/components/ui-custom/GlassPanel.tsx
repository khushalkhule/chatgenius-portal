
import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark" | "accent";
  bordered?: boolean;
  elevated?: boolean;
}

const GlassPanel = ({
  children,
  className,
  variant = "light",
  bordered = true,
  elevated = true,
  ...props
}: GlassPanelProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl backdrop-blur-lg transition-all duration-300 ease-out",
        {
          "bg-white/40 dark:bg-white/5": variant === "light",
          "bg-black/40 dark:bg-black/40": variant === "dark",
          "bg-primary/10 dark:bg-primary/10": variant === "accent",
          "border": bordered,
          "border-white/20 dark:border-white/10": bordered && variant === "light",
          "border-black/10 dark:border-white/5": bordered && variant === "dark",
          "border-primary/20 dark:border-primary/20": bordered && variant === "accent",
          "shadow-lg": elevated,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
