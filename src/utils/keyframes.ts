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
  sacredGlowPulse: () =>
    keyframes(
      'sacredGlowPulse',
      `
    0% {
      box-shadow: 0 0 20px var(--goobs-gold-a30), 0 0 40px var(--goobs-gold-a20);
      border-color: var(--goobs-gold-a50);
    }
    50% {
      box-shadow: 0 0 30px var(--goobs-gold-a50), 0 0 60px var(--goobs-gold-a30);
      border-color: var(--goobs-gold-a80);
    }
    100% {
      box-shadow: 0 0 20px var(--goobs-gold-a30), 0 0 40px var(--goobs-gold-a20);
      border-color: var(--goobs-gold-a50);
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
