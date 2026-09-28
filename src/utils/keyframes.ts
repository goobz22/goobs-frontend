/**
 * ONE constructed stylesheet for every runtime keyframe, adopted by the document once.
 *
 * This used to append a `<style data-keyframe>` element per name. A Content-Security-Policy with a
 * nonce-only `style-src-elem` refuses every unnonced <style> element, and a library cannot know the
 * page's nonce. A constructed stylesheet (`new CSSStyleSheet()` + `document.adoptedStyleSheets`) is
 * not an inline <style> element, so the rules land without weakening the host page's CSP.
 */
let runtimeKeyframeSheet: CSSStyleSheet | null = null
const runtimeKeyframeNames = new Set<string>()

function keyframeSheet(): CSSStyleSheet | null {
  if (runtimeKeyframeSheet) return runtimeKeyframeSheet
  if (
    typeof document === 'undefined' ||
    typeof CSSStyleSheet === 'undefined' ||
    !('adoptedStyleSheets' in document)
  ) {
    return null
  }
  runtimeKeyframeSheet = new CSSStyleSheet()
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, runtimeKeyframeSheet]
  return runtimeKeyframeSheet
}

/**
 * Registers CSS keyframes (once per name) and returns the animation name
 * @param name - The name for the keyframes animation
 * @param animation - The CSS keyframes content (without @keyframes wrapper)
 * @returns The animation name to be used in CSS animation properties
 */
export const keyframes = (name: string, animation: string): string => {
  if (runtimeKeyframeNames.has(name)) return name
  const sheet = keyframeSheet()
  if (sheet) {
    try {
      sheet.insertRule(`@keyframes ${name} { ${animation} }`, sheet.cssRules.length)
      runtimeKeyframeNames.add(name)
    } catch {
      // An invalid body is dropped, exactly as the browser dropped an invalid <style> rule.
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
