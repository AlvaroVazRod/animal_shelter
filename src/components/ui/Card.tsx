import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`bg-slate-800 border border-slate-700 rounded-lg shadow-lg ${className}`}>{children}</div>
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
