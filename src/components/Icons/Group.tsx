'use client'

import React from 'react'

const GroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="24"
      height="24"
      {...props}
    >
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.97 2.97 0 0 0 17.14 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.77A2 2 0 0 0 15.28 16H16v6h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm1.5 1h-2c-.83 0-1.5.67-1.5 1.5v6h5v-6c0-.83-.67-1.5-1.5-1.5zM6 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm2 4c-.8 0-1.54.5-1.85 1.26L3.61 16.37A2 2 0 0 0 5.48 19H8v3h2v-6H7.72c-.8 0-1.54-.5-1.85-1.26L8 10c.28-.67.91-1 1.59-1H10v6h2v-6c0-.83-.67-1.5-1.5-1.5z" />
    </svg>
  )
}

export default GroupIcon
