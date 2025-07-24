import React from 'react'

interface MapIconProps {
  size?: number
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'info'
    | 'error'
    | string
  fontSize?: 'small' | 'inherit' | 'large'
  className?: string
  style?: React.CSSProperties
}

const MapIcon: React.FC<MapIconProps> = ({
  size = 24,
  color = 'inherit',
  fontSize = 'inherit',
  className,
  style,
}) => {
  const getColorValue = (colorProp: string): string => {
    const colorMap: { [key: string]: string } = {
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      warning: '#ed6c02',
      info: '#0288d1',
      error: '#d32f2f',
    }
    return colorMap[colorProp] || colorProp
  }

  const getFontSize = (): number => {
    switch (fontSize) {
      case 'small':
        return 20
      case 'large':
        return 35
      default:
        return size
    }
  }

  return (
    <svg
      width={getFontSize()}
      height={getFontSize()}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M20.5 3L20.34 3.03L15 5.1L9 3L3.36 4.97C3.15 5.04 3 5.24 3 5.46V20.5C3 20.78 3.22 21 3.5 21L3.66 20.97L9 18.9L15 21L20.64 19.03C20.85 18.96 21 18.76 21 18.54V3.5C21 3.22 20.78 3 20.5 3ZM10 5.47L14 6.87V18.53L10 17.13V5.47ZM5 6.46L8 5.45V17.15L5 18.31V6.46ZM19 17.54L16 18.55V6.86L19 5.69V17.54Z"
        fill={getColorValue(color)}
      />
    </svg>
  )
}

export default MapIcon
