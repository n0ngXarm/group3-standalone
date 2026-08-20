import React, { useRef } from "react";
import { gsap } from "@lib";


export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  ...props
}) {
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (disabled) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && btnRef.current) {
      gsap
        .timeline()
        .to(btnRef.current, { scale: 0.97, duration: 0.1, ease: "power1.in" })
        .to(btnRef.current, { scale: 1, duration: 0.3, ease: "back.out(1.1)" });
    }

    onClick?.(e);
  };

  const baseStyles =
    "inline-flex cursor-pointer items-center justify-center font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b99a65] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#86693b] text-[#fdfbf6] hover:shadow-sm hover:bg-[#6c542f]",
    secondary: "border border-[#b99a65] text-[#86693b] bg-transparent hover:bg-[#b99a65]/10",
    ghost: "text-[#7c7264] bg-transparent hover:text-[#2b241c] hover:bg-[#f2ecdd]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
