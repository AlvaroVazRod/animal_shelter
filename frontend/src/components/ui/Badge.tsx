"use client"

import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "outline"
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "", style, onClick }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"

  const variants = {
    default: "bg-emerald-500 text-slate-900",
    secondary: "bg-slate-600 text-slate-200 hover:bg-slate-500",
    outline: "border border-current",
  }

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
