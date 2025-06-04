import type React from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea: React.FC<TextareaProps> = ({ label, className = "", ...props }) => {
  const baseClasses =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ad03cb] focus:border-transparent resize-none"

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-200 mb-1">{label}</label>}
      <textarea className={`${baseClasses} bg-[#35273a] border-[#c27aff] text-slate-100 ${className}`} {...props} />
    </div>
  )
}
