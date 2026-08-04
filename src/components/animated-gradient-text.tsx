"use client";

import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-brand via-brand-accent to-brand bg-[size:200%_auto] bg-clip-text text-transparent animate-text-gradient",
        className
      )}
    >
      {children}
    </span>
  );
}
