import React from 'react'

export default function FormField({ label, error, required = false, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}