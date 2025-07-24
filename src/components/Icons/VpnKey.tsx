import React from 'react'

/**
 * VpnKey Icon Component
 *
 * A customizable VPN key/security icon with sacred theming support.
 *
 * @param props - Standard SVG props including className, style, etc.
 * @param sacredtheme - Optional prop to enable sacred theming with golden glow effects
 * @returns JSX.Element
 */

// Define props interface extending SVG props
interface VpnKeyIconProps extends React.SVGProps<SVGSVGElement> {
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

const VpnKeyIcon: React.FC<VpnKeyIconProps> = ({
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
        <path d="M12.65 10C11.7 7.31 8.9 5.5 5.77 6.12c-2.29.46-4.15 2.29-4.63 4.58C.32 14.57 2.92 18 6.71 18c1.89 0 3.62-.75 4.88-1.97l5.66 5.66c.39.39 1.02.39 1.41 0l.71-.71c.39-.39.39-1.02 0-1.41L13.71 14c.5-.65.8-1.45.8-2.31 0-.26-.03-.51-.08-.76C14.99 10.33 13.88 10 12.65 10zM6.5 15.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5S9 11.62 9 13s-1.12 2.5-2.5 2.5z" />
      </svg>
    </>
  )
}

export default VpnKeyIcon
