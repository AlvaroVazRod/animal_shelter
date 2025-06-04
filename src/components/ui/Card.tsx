import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`bg-[#35273a] hover:bg-[#3e2443] border-[#c27aff] border rounded-lg shadow-lg ${className}`}>{children}</div>
}

export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`p-6 pb-3 ${className}`}>{children}</div>
}

export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

export const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
}
