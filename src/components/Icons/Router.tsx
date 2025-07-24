import React from 'react'

/**
 * Router Icon Component
 *
 * A customizable router/network device icon with sacred theming support.
 *
 * @param props - Standard SVG props including className, style, etc.
 * @param sacredtheme - Optional prop to enable sacred theming with golden glow effects
 * @returns JSX.Element
 */

// Define props interface extending SVG props
interface RouterIconProps extends React.SVGProps<SVGSVGElement> {
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

const RouterIcon: React.FC<RouterIconProps> = ({
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
        <path d="M15.9 5c-.17 0-.32.09-.41.23l-.07.15-1.37 3.34c-.14.35.18.73.54.73h2.54c.36 0 .68-.38.54-.73L15.46 5.38c-.09-.2-.26-.38-.47-.38zm-4.07 0c-.21 0-.38.18-.47.38L9.99 8.72c-.14.35.18.73.54.73h2.54c.36 0 .68-.38.54-.73L12.24 5.38c-.09-.2-.26-.38-.47-.38zM8.93 5c-.17 0-.32.09-.41.23l-.07.15-1.37 3.34c-.14.35.18.73.54.73h2.54c.36 0 .68-.38.54-.73L8.33 5.38C8.24 5.18 8.07 5 7.86 5zM20 13H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      </svg>
    </>
  )
}

export default RouterIcon
