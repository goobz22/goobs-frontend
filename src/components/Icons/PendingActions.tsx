import React from 'react'

/**
 * PendingActions Icon Component
 *
 * A customizable pending actions/tasks icon with sacred theming support.
 *
 * @param props - Standard SVG props including className, style, etc.
 * @param sacredtheme - Optional prop to enable sacred theming with golden glow effects
 * @returns JSX.Element
 */

// Define props interface extending SVG props
interface PendingActionsIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Optional sacred theme styling
   * When true, applies golden glow and sacred aesthetic
   */
  sacredtheme?: boolean

  /**
   * Size of the icon (width and height)
   * @default 24
   */
  size?: number
}

// Sacred theme styles
const sacredStyles = {
  filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
  color: '#FFD700',
  animation: 'sacredGlow 2s ease-in-out infinite alternate',
}

// Define keyframes for sacred glow animation
const sacredKeyframes = `
  @keyframes sacredGlow {
    0% {
      filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
    }
    100% {
      filter: drop-shadow(0 0 16px rgba(255, 215, 0, 0.9));
    }
  }
`

const PendingActionsIcon: React.FC<PendingActionsIconProps> = ({
  sacredtheme,
  size = 24,
  style,
  ...props
}) => {
  // Combine styles
  const combinedStyle = {
    ...(sacredtheme && sacredStyles),
    ...style,
  }

  return (
    <>
      {sacredtheme && <style>{sacredKeyframes}</style>}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        style={combinedStyle}
        {...props}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </>
  )
}

export default PendingActionsIcon
