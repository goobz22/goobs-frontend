'use client'

import React from 'react'

const AddPhotoAlternateIcon: React.FC<
  React.SVGProps<SVGSVGElement>
> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    {...props}
  >
    <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V9h-3V7h-3v2.4L12.6 11H16zm-5 0v2h3v2.99s-1.99.01-2 0V13H9v-2h2zm-2 4H7v-2H5v2H2v2h3v3h2v-3h2v-2z" />
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="m21 19.1-8-6.7-2.9 2.7L8 13v8h12.1zM5 16l3-4 2.03 2.71L16 8l5 6v6c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-4z"
      opacity="0.3"
    />
  </svg>
)

export default AddPhotoAlternateIcon
