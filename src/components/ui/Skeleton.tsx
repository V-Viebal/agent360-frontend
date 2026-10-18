import React from "react";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "circle";
}

export function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const variantClass =
    variant === "circle"
      ? "rounded-full"
      : variant === "card"
      ? "rounded-xl"
      : "rounded-md";

  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer ${variantClass} ${className}`}
    />
  );
}
