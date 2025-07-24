import React from 'react'

/**
 * CardMembership Icon Component
 *
 * A customizable membership card/certification icon with sacred theming support.
 *
 * @param props - Standard SVG props including className, style, etc.
 * @param sacredtheme - Optional prop to enable sacred theming with golden glow effects
 * @returns JSX.Element
 */

// Define props interface extending SVG props
interface CardMembershipIconProps extends React.SVGProps<SVGSVGElement> {
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

const CardMembershipIcon: React.FC<CardMembershipIconProps> = ({
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
        <path d="M20 4H4c-1.11 0-2 .89-2 2v7c0 1.11.89 2 2 2v2c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2v-2c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 9H4V6h16v7zm-10 2l2 3 2-3H10z" />
      </svg>
    </>
  )
}

export default CardMembershipIcon
