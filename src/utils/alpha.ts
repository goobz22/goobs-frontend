/**
 * Creates a transparent color from a base color and opacity value
 * @param color - Base color (hex string like "#FF0000" or color name)
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA string
 */
export const alpha = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/)
    if (rgbaMatch) {
      const [, r, g, b] = rgbaMatch
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
  }

  // For named colors or other formats, return as-is (may not work perfectly)
  return color
}
