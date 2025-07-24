import React from 'react'

interface LocationCityIconProps {
  sx?: React.CSSProperties
  className?: string
}

const LocationCityIcon: React.FC<LocationCityIconProps> = ({
  sx,
  className,
}) => (
  <svg
    className={className}
    style={sx}
    fill="currentColor"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zM7 19H5v-2h2v2zM7 15H5v-2h2v2zM7 11H5V9h2v2zM13 19h-2v-2h2v2zM13 15h-2v-2h2v2zM13 11h-2V9h2v2zM13 7h-2V5h2v2zM19 19h-2v-2h2v2zM19 15h-2v-2h2v2z" />
  </svg>
)

export default LocationCityIcon
