import React from 'react'

/**
 * PostAdd Icon Component
 *
 * A customizable add post/content icon with sacred theming support.
 *
 * @param props - Standard SVG props including className, style, etc.
 * @param sacredtheme - Optional prop to enable sacred theming with golden glow effects
 * @returns JSX.Element
 */

// Define props interface extending SVG props
interface PostAddIconProps extends React.SVGProps<SVGSVGElement> {
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

const PostAddIcon: React.FC<PostAddIconProps> = ({
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
        <path d="M17 19.22H5V7h7V5H5c-1.1 0-2 .9-2 2v12.22h14v-8.22h-2v8.22z" />
        <path d="M19 2h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V7h3V5h-3V2zM7 9h8v2H7zM7 12v2h8v-2h-3-5zM7 15h8v2H7z" />
      </svg>
    </>
  )
}

export default PostAddIcon
