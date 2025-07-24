/**
 * Creates and injects CSS keyframes animations and returns the animation name
 * @param name - The name for the keyframes animation
 * @param animation - The CSS keyframes content (without @keyframes wrapper)
 * @returns The animation name to be used in CSS animation properties
 */
export const keyframes = (name: string, animation: string): string => {
  if (typeof document !== 'undefined') {
    const existingStyle = document.head.querySelector(
      `style[data-keyframe="${name}"]`
    )
    if (!existingStyle) {
      const styleElement = document.createElement('style')
      styleElement.setAttribute('data-keyframe', name)
      styleElement.textContent = `@keyframes ${name} { ${animation} }`
      document.head.appendChild(styleElement)
    }
  }
  return name
}

/**
 * Template literal version for styled-components-like syntax
 * @param strings - Template literal strings
 * @param values - Template literal values
 * @returns Generated animation name
 */
export const css = (
  strings: TemplateStringsArray,
  ...values: any[]
): string => {
  const name = `animation-${Math.random().toString(36).substr(2, 9)}`
  const animation = strings.reduce((result, string, i) => {
    return result + string + (values[i] || '')
  }, '')

  return keyframes(name, animation)
}

/**
 * Common keyframes that can be reused across components
 */
export const commonKeyframes = {
  sacredGlowPulse: (color: string = '#FFD700') =>
    keyframes(
      'sacredGlowPulse',
      `
    0% { 
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2);
      border-color: rgba(255, 215, 0, 0.5);
    }
    50% { 
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3);
      border-color: rgba(255, 215, 0, 0.8);
    }
    100% { 
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2);
      border-color: rgba(255, 215, 0, 0.5);
    }
  `
    ),

  rotateGlyph: () =>
    keyframes(
      'rotateGlyph',
      `
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `
    ),

  sacredFloat: () =>
    keyframes(
      'sacredFloat',
      `
    0% { transform: translateY(0px); opacity: 0.6; }
    50% { transform: translateY(-3px); opacity: 0.8; }
    100% { transform: translateY(0px); opacity: 0.6; }
  `
    ),
}
