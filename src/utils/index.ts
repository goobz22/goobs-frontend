/**
 * Converts a hex color to rgba with the specified alpha value
 * @param color - Hex color code (e.g., '#FFD700')
 * @param opacity - Alpha value between 0 and 1
 * @returns RGBA color string
 */
export function alpha(color: string, opacity: number): string {
  // Remove the hash if present
  const hex = color.replace('#', '')

  // Parse r, g, b values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
