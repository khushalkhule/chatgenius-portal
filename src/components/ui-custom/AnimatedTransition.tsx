
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 
    | "fade-in" 
    | "slide-up" 
    | "slide-down" 
    | "slide-left" 
    | "slide-right" 
    | "scale-up" 
    | "scale-down"
    | "bounce-in";
  delay?: number;
  duration?: number;
  once?: boolean;
}

const AnimatedTransition = ({
  children,
  className,
  animation = "fade-in",
  delay = 0,
  duration = 400,
  once = true,
}: AnimatedTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (once && hasAnimated) return;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasAnimated(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, once, hasAnimated]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
      className={cn(
        {
          "transform translate-y-0": isVisible && (animation === "slide-up" || animation === "slide-down"),
          "transform translate-y-4": !isVisible && animation === "slide-up",
          "transform -translate-y-4": !isVisible && animation === "slide-down",
          "transform translate-x-0": isVisible && (animation === "slide-left" || animation === "slide-right"),
          "transform translate-x-4": !isVisible && animation === "slide-left",
          "transform -translate-x-4": !isVisible && animation === "slide-right",
          "transform scale-100": isVisible && (animation === "scale-up" || animation === "scale-down"),
          "transform scale-95": !isVisible && animation === "scale-up",
          "transform scale-105": !isVisible && animation === "scale-down",
          "animate-bounce-in": isVisible && animation === "bounce-in",
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
