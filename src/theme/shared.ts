// --------------------------------------------------------------------------
// SHARED THEME ELEMENTS
// --------------------------------------------------------------------------

// Sacred glyphs used in sacred theme components
export const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

// Common animations and keyframes that can be shared across components
export const SACRED_ANIMATIONS = {
  float: 'sacredFloat 3s ease-in-out infinite',
  glow: 'sacredGlow 3s ease-in-out infinite',
  rotate: 'sacredGlyphRotate 20s linear infinite',
  shimmer: 'sacredShimmer 2s ease-in-out infinite',
}

// Common transition configurations
export const TRANSITIONS = {
  fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  medium: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  premium: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// Common shadow configurations
export const SHADOWS = {
  light: {
    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    large: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
    large: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  sacred: {
    small: '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
    medium: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
    large: '0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)',
  },
}
