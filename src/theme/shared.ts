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

// Keyframes for animations (CSS-in-JS format)
export const KEYFRAMES = `
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes glyph-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes progressIndeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(250%);
  }
}

@keyframes progressStripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 0;
  }
}

@keyframes progressPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

@keyframes sacredProgressIndeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(220%);
  }
}

@keyframes sacredProgressPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.8);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 215, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
}

@keyframes sacred-glow-pulse {
  0% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.15);
  }
  100% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.4), inset 0 0 40px rgba(255, 215, 0, 0.2);
  }
}

@keyframes sacred-error-pulse {
  0% {
    box-shadow: 0 0 30px rgba(184, 134, 11, 0.5), 0 0 60px rgba(184, 134, 11, 0.25), inset 0 0 30px rgba(184, 134, 11, 0.1);
  }
  100% {
    box-shadow: 0 0 40px rgba(184, 134, 11, 0.7), 0 0 80px rgba(184, 134, 11, 0.35), inset 0 0 40px rgba(184, 134, 11, 0.15);
  }
}

@keyframes sacred-icon-glow {
  0% {
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
  }
  100% {
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8));
  }
}

@keyframes sacred-error-icon-pulse {
  0% {
    filter: drop-shadow(0 0 8px rgba(184, 134, 11, 0.6));
  }
  100% {
    filter: drop-shadow(0 0 12px rgba(184, 134, 11, 0.8));
  }
}

@keyframes sacredFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes sacredGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  }
}

@keyframes sacredGlyphRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes sacredShimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`

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

// Helper function to inject keyframes into the document
export const injectKeyframes = () => {
  if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style')
    styleElement.textContent = KEYFRAMES
    if (!document.head.querySelector('style[data-keyframes="true"]')) {
      styleElement.setAttribute('data-keyframes', 'true')
      document.head.appendChild(styleElement)
    }
  }
}
