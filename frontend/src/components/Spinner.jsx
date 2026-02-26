import React from 'react'

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
}

export default function Spinner({ size = 'md' }) {
  return (
    <div className={`${sizes[size]} border-4 border-gray-300 border-t-black rounded-full animate-spin`} />
  )
}