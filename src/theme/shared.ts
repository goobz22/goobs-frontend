// --------------------------------------------------------------------------
// SHARED THEME ELEMENTS
// --------------------------------------------------------------------------

// Sacred glyphs removed

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
