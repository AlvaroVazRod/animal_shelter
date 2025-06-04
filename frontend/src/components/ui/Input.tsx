import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  const baseClasses =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-200 mb-1">{label}</label>}
      <input className={`${baseClasses} bg-slate-700 border-slate-600 text-slate-100 ${className}`} {...props} />
    </div>
  )
}
