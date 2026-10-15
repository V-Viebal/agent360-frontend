import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "secondary" | "primary";
}

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "ghost",
  className = "",
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-9 w-9 text-base",
  };

  const variantClasses = {
    ghost: "text-neutral-400 hover:text-white hover:bg-[#1f1f28]",
    secondary: "bg-[#181820] hover:bg-[#22222e] text-neutral-300 hover:text-white border border-[#2a2a38]",
    primary: "bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-semibold",
  };

  return (
    <button
      type="button"
      className={`rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={label}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}
