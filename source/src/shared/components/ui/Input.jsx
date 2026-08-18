import React from "react";

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  disabled = false,
  error = null,
  ...props
}) {
  return (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border border-[#e7dfd0] bg-[#fffdf9] px-4 py-2.5 text-sm text-[#2b241c] placeholder:text-[#c7beae] outline-none transition-all focus:border-[#b99a65] focus:ring-1 focus:ring-[#b99a65] disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-[#bd6e5c] focus:ring-[#bd6e5c]" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#8a3e2e]">{error}</p>}
    </div>
  );
}
