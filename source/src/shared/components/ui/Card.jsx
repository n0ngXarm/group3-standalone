import React from "react";

export default function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[#e7dfd0] bg-[#fffdf9] p-5 shadow-xs transition-all duration-300 ${
        hoverable ? "cursor-pointer hover:border-[#b99a65]/60 hover:shadow-sm hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
