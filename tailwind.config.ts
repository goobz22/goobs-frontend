import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        arapey: ['Arapey', 'serif'],
        inter: ['Inter', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        'cinzel-decorative': ['"Cinzel Decorative"', 'serif'],
        'crimson-text': ['"Crimson Text"', 'serif'],
        'trajan-pro': ['"Trajan Pro"', 'serif'],
      },
      colors: {
        // Sacred Theme Colors
        sacred: {
          gold: '#FFD700',
          'dark-gold': '#B8860B',
          'sand-gold': '#F4A460',
          'amber-gold': '#DAA520',
          temple: '#0a0a0a',
          obsidian: '#191919',
          lapis: '#26619C',
          turquoise: '#40E0D0',
          papyrus: '#F5F5DC',
          khaki: '#BDB76B',
          nile: '#8FBC8F',
        },
        // Main Palette Colors
        moss: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd28d',
          400: '#5bb85b',
          500: '#3a9d3a',
          600: '#2d7d2d',
          700: '#266326',
          800: '#225022',
          900: '#1f421f',
          950: '#0c240c',
        },
        aqua: {
          50: '#f0fdff',
          100: '#cdf9ff',
          200: '#a1f2ff',
          300: '#60e9ff',
          400: '#17d4f0',
          500: '#00bad6',
          600: '#0295b4',
          700: '#0a7792',
          800: '#146177',
          900: '#175165',
          950: '#083546',
        },
        // You can add more colors from the palette as needed
      },
      keyframes: {
        'sacred-glow': {
          '0%, 100%': {
            textShadow:
              '0 0 10px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)',
          },
          '50%': {
            textShadow:
              '0 0 20px #FFD700, 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.6)',
          },
        },
        'sacred-border-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2), inset 0 0 10px rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            boxShadow:
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 0.8)',
          },
        },
        'sacred-glow-pulse': {
          '0%, 100%': {
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            boxShadow:
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
            borderColor: 'rgba(255, 215, 0, 0.8)',
          },
        },
        'sacred-shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
            backgroundImage:
              'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%)',
          },
          '100%': {
            backgroundPosition: '200% 0',
            backgroundImage:
              'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%)',
          },
        },
        'glyph-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'sacred-float': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
            opacity: '0.6',
          },
          '50%': {
            transform: 'translateY(-3px) scale(1.05)',
            opacity: '0.8',
          },
        },
        'sacred-icon-glow': {
          '0%, 100%': {
            filter:
              'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))',
          },
          '50%': {
            filter:
              'drop-shadow(0 0 8px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))',
          },
        },
        'sacred-check-appear': {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'float-glyph': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.3' },
          '50%': { transform: 'translateY(-2px)', opacity: '0.6' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'sacred-drop-shadow-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))' },
        },
        'sacred-box-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 10px rgba(255, 215, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2)',
          },
          '50%': {
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)',
          },
        },
        'sacred-code-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'sacred-glyph-float': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.3' },
          '50%': { transform: 'translateY(-5px)', opacity: '0.6' },
        },
        'copy-success': {
          '0%, 100%': {
            transform: 'scale(1)',
            filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))',
          },
          '50%': {
            transform: 'scale(1.2)',
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))',
          },
        },
        'line-number-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        'sacred-input-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            boxShadow:
              '0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 0.8)',
          },
        },
        'sacred-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
        'sacred-success-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow:
              '0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)',
            transform: 'scale(1.05)',
          },
        },
        'status-glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 15px currentColor, 0 0 25px currentColor' },
        },
        'float-glyph-rotate': {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-2px) rotate(180deg)' },
          '100%': { transform: 'translateY(0px) rotate(360deg)' },
        },
        'gold-shimmer': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.9))' },
        },
        'radio-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '50%': { boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)' },
        },
        'datagrid-glow-pulse': {
          '0%, 100%': {
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            boxShadow:
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 0.8)',
          },
        },
        'datagrid-float': {
          '0%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.3' },
          '33%': {
            transform: 'translateY(-5px) rotate(120deg)',
            opacity: '0.5',
          },
          '66%': {
            transform: 'translateY(2px) rotate(240deg)',
            opacity: '0.4',
          },
          '100%': {
            transform: 'translateY(0px) rotate(360deg)',
            opacity: '0.3',
          },
        },
        'datagrid-datastream': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '0.3',
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
        'glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.4)' },
          '50%': { 'box-shadow': '0 0 20px rgba(255, 215, 0, 0.6)' },
        },
        'float-glyph-popover': {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-2px) rotate(180deg)' },
          '100%': { transform: 'translateY(0px) rotate(360deg)' },
        },
        'project-board-glow-pulse': {
          '0%, 100%': {
            'box-shadow':
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            'border-color': 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            'box-shadow':
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            'border-color': 'rgba(255, 215, 0, 0.8)',
          },
        },
        'project-board-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '33%': {
            transform: 'translateY(-5px) rotate(120deg)',
            opacity: '0.5',
          },
          '66%': {
            transform: 'translateY(2px) rotate(240deg)',
            opacity: '0.4',
          },
        },
        'manage-row-glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.4)' },
          '50%': { 'box-shadow': '0 0 20px rgba(255, 215, 0, 0.6)' },
        },
        'board-glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.4)' },
          '50%': { 'box-shadow': '0 0 20px rgba(255, 215, 0, 0.6)' },
        },
        'board-float-glyph': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-2px) rotate(180deg)' },
        },
        'add-task-glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.4)' },
          '50%': { 'box-shadow': '0 0 20px rgba(255, 215, 0, 0.6)' },
        },
        'add-task-float-glyph': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(-2px) rotate(180deg)',
            opacity: '0.5',
          },
        },
        'no-user-add-task-glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.4)' },
          '50%': { 'box-shadow': '0 0 20px rgba(255, 215, 0, 0.6)' },
        },
        'no-user-add-task-float-glyph': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(-2px) rotate(180deg)',
            opacity: '0.5',
          },
        },
        'show-task-glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.4)' },
          '50%': { 'box-shadow': '0 0 20px rgba(255, 215, 0, 0.6)' },
        },
        'show-task-float-glyph': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(-2px) rotate(180deg)',
            opacity: '0.5',
          },
        },
        'detailed-pricing-summary-glow': {
          '0%, 100%': {
            'box-shadow':
              '0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1)',
          },
          '50%': {
            'box-shadow':
              '0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2)',
          },
        },
        'detailed-pricing-summary-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'simple-pricing-summary-glow': {
          '0%, 100%': {
            'box-shadow':
              '0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1)',
          },
          '50%': {
            'box-shadow':
              '0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2)',
          },
        },
        'simple-pricing-summary-glyph-rotate': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)', opacity: '0.2' },
          '50%': { transform: 'rotate(180deg) scale(1.1)', opacity: '0.4' },
        },
        'product-card-glow': {
          '0%, 100%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.3)' },
          '50%': { 'box-shadow': '0 0 20px rgba(255, 215, 0, 0.5)' },
        },
        'product-card-rotate-glyph': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'product-card-counter-glow': {
          '0%, 100%': { 'box-shadow': 'inset 0 0 5px rgba(255, 215, 0, 0.3)' },
          '50%': { 'box-shadow': 'inset 0 0 10px rgba(255, 215, 0, 0.5)' },
        },
        'popup-glow-pulse': {
          '0%, 100%': {
            'box-shadow':
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            'border-color': 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            'box-shadow':
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            'border-color': 'rgba(255, 215, 0, 0.8)',
          },
        },
        'popup-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '33%': {
            transform: 'translateY(-5px) rotate(120deg)',
            opacity: '0.5',
          },
          '66%': {
            transform: 'translateY(2px) rotate(240deg)',
            opacity: '0.4',
          },
        },
        'popup-shimmer': {
          '0%': { 'background-position': '-200% center' },
          '100%': { 'background-position': '200% center' },
        },
        'popup-scrollbar-glow': {
          '0%, 100%': { 'box-shadow': '0 0 5px rgba(255, 215, 0, 0.3)' },
          '50%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.6)' },
        },
        'popup-close-button-glow': {
          '0%, 100%': {
            'text-shadow': '0 0 5px rgba(255, 215, 0, 0.5)',
            transform: 'rotate(0deg)',
          },
          '50%': {
            'text-shadow': '0 0 15px rgba(255, 215, 0, 0.8)',
            transform: 'rotate(180deg)',
          },
          '100%': {
            'text-shadow': '0 0 5px rgba(255, 215, 0, 0.5)',
            transform: 'rotate(360deg)',
          },
        },
        'dialog-glow-pulse': {
          '0%, 100%': {
            'box-shadow':
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            'border-color': 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            'box-shadow':
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            'border-color': 'rgba(255, 215, 0, 0.8)',
          },
        },
        'dialog-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '33%': {
            transform: 'translateY(-5px) rotate(120deg)',
            opacity: '0.5',
          },
          '66%': {
            transform: 'translateY(2px) rotate(240deg)',
            opacity: '0.4',
          },
        },
        'dialog-shimmer': {
          '0%': { 'background-position': '-200% center' },
          '100%': { 'background-position': '200% center' },
        },
        'dialog-scrollbar-glow': {
          '0%, 100%': { 'box-shadow': '0 0 5px rgba(255, 215, 0, 0.3)' },
          '50%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.6)' },
        },
        'complex-text-editor-glyph-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.2',
          },
          '50%': {
            transform: 'translateY(-5px) rotate(180deg)',
            opacity: '0.4',
          },
        },
        'widget-float': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.3' },
          '50%': { transform: 'translateY(-5px)', opacity: '0.6' },
        },
        'widget-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'metric-card-rotate-glyph': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'metric-card-glow': {
          '0%, 100%': {
            'box-shadow':
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            'border-color': 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            'box-shadow':
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            'border-color': 'rgba(255, 215, 0, 0.8)',
          },
        },
        'metric-card-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '33%': {
            transform: 'translateY(-3px) rotate(120deg)',
            opacity: '0.6',
          },
          '66%': {
            transform: 'translateY(1px) rotate(240deg)',
            opacity: '0.4',
          },
        },
        'metric-card-shimmer': {
          '0%': { 'background-position': '-200% center' },
          '100%': { 'background-position': '200% center' },
        },
        'metric-card-data-stream': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '0.3',
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
        'simple-editor-input-glow': {
          '0%, 100%': {
            'box-shadow':
              '0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1)',
          },
          '50%': {
            'box-shadow':
              '0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2)',
          },
        },
        'simple-editor-glyph-pulse': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.5' },
        },
        'toolbar-icon-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))' },
        },
        'rich-text-editor-text-glow': {
          '0%, 100%': { 'text-shadow': '0 0 3px rgba(255, 215, 0, 0.3)' },
          '50%': { 'text-shadow': '0 0 6px rgba(255, 215, 0, 0.5)' },
        },
        'rich-text-editor-border-pulse': {
          '0%, 100%': { 'border-color': 'rgba(255, 215, 0, 0.3)' },
          '50%': { 'border-color': 'rgba(255, 215, 0, 0.6)' },
        },
        'complex-toolbar-button-glow': {
          '0%, 100%': { 'box-shadow': '0 0 5px rgba(255, 215, 0, 0.3)' },
          '50%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.5)' },
        },
        'dropdown-sacred-glow': {
          '0%, 100%': { 'box-shadow': '0 0 10px rgba(255, 215, 0, 0.5)' },
          '50%': { 'box-shadow': '0 0 20px rgba(255, 215, 0, 0.8)' },
        },
        'dropdown-float-glyph': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-3px) rotate(180deg)' },
        },
        'markdown-editor-code-glow': {
          '0%, 100%': { 'text-shadow': '0 0 5px rgba(255, 215, 0, 0.3)' },
          '50%': { 'text-shadow': '0 0 10px rgba(255, 215, 0, 0.5)' },
        },
        'markdown-editor-glyph-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'time-range-glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.9))' },
        },
        'time-range-float-glyph': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-2px) scale(1.1)' },
        },
        'time-range-sacred-glow': {
          '0%, 100%': {
            'box-shadow':
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            'border-color': 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            'box-shadow':
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            'border-color': 'rgba(255, 215, 0, 0.8)',
          },
        },
        'form-datagrid-glow-pulse': {
          '0%, 100%': {
            'box-shadow':
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            'border-color': 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            'box-shadow':
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            'border-color': 'rgba(255, 215, 0, 0.8)',
          },
        },
        'form-datagrid-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.3',
          },
          '33%': {
            transform: 'translateY(-5px) rotate(120deg)',
            opacity: '0.5',
          },
          '66%': {
            transform: 'translateY(2px) rotate(240deg)',
            opacity: '0.4',
          },
        },
        'form-datagrid-shimmer': {
          '0%': { 'background-position': '-200% center' },
          '100%': { 'background-position': '200% center' },
        },
        'form-datagrid-data-flow': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '0.3',
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
        'cc-expiration-float-glyph': {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-2px) scale(1.1)' },
          '100%': { transform: 'translateY(0px) scale(1)' },
        },
        'cc-expiration-glow-pulse': {
          '0%': {
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            boxShadow:
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 0.8)',
          },
          '100%': {
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
        },
        'date-field-float-glyph': {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-2px) scale(1.1)' },
          '100%': { transform: 'translateY(0px) scale(1)' },
        },
        'date-field-glow-pulse': {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.9))' },
          '100%': { filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))' },
        },
        'date-field-sacred-glow': {
          '0%': {
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '50%': {
            boxShadow:
              '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
            borderColor: 'rgba(255, 215, 0, 0.8)',
          },
          '100%': {
            boxShadow:
              '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
        },
      },
      animation: {
        'sacred-glow': 'sacred-glow 3s ease-in-out infinite',
        'sacred-glow-pulse': 'sacred-glow-pulse 3s ease-in-out infinite',
        'sacred-shimmer': 'sacred-shimmer 2s ease-in-out infinite',
        'glyph-rotate': 'glyph-rotate 20s linear infinite',
        'glyph-rotate-reverse': 'glyph-rotate 15s linear infinite reverse',
        'sacred-float': 'sacred-float 2s ease-in-out infinite',
        'sacred-icon-glow': 'sacred-icon-glow 2s ease-in-out infinite',
        'sacred-check-appear': 'sacred-check-appear 0.4s ease-out',
        'float-glyph': 'float-glyph 3s ease-in-out infinite',
        'float-glyph-delayed': 'float-glyph 3s ease-in-out infinite 1.5s',
        'slide-in-left': 'slide-in-left 1s ease-in-out forwards',
        'slide-in-right': 'slide-in-right 1s ease-in-out forwards',
        'slide-in-up': 'slide-in-up 1s ease-in-out forwards',
        'slide-in-down': 'slide-in-down 1s ease-in-out forwards',
        'fade-in': 'fade-in 0.5s ease-in forwards',
        'fade-out': 'fade-out 0.5s ease-out forwards',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
        'sacred-drop-shadow-glow':
          'sacred-drop-shadow-glow 2s ease-in-out infinite',
        'sacred-box-glow': 'sacred-box-glow 4s ease-in-out infinite',
        'sacred-code-shimmer': 'sacred-code-shimmer 6s ease-in-out infinite',
        'sacred-glyph-float': 'sacred-glyph-float 6s ease-in-out infinite',
        'copy-success': 'copy-success 0.5s ease-out',
        'line-number-glow': 'line-number-glow 3s ease-in-out infinite',
        'sacred-input-glow': 'sacred-input-glow 4s ease-in-out infinite',
        'sacred-pulse': 'sacred-pulse 2s ease-in-out infinite',
        'sacred-success-glow': 'sacred-success-glow 3s ease-in-out infinite',
        'status-glow': 'status-glow 2s ease-in-out infinite',
        'float-glyph-rotate': 'float-glyph-rotate 4s ease-in-out infinite',
        'gold-shimmer': 'gold-shimmer 2s ease-in-out infinite',
        'radio-glow-pulse': 'radio-glow-pulse 2s ease-in-out infinite',
        'datagrid-glow-pulse': 'datagrid-glow-pulse 4s ease-in-out infinite',
        'datagrid-float': 'datagrid-float 5s ease-in-out infinite',
        'datagrid-float-reverse':
          'datagrid-float 5s ease-in-out infinite reverse',
        'datagrid-datastream': 'datagrid-datastream 6s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float-glyph-popover': 'float-glyph-popover 4s ease-in-out infinite',
        'project-board-glow-pulse':
          'project-board-glow-pulse 4s ease-in-out infinite',
        'project-board-float': 'project-board-float 5s ease-in-out infinite',
        'manage-row-glow-pulse':
          'manage-row-glow-pulse 3s ease-in-out infinite',
        'board-glow-pulse': 'board-glow-pulse 3s ease-in-out infinite',
        'board-float-glyph': 'board-float-glyph 4s ease-in-out infinite',
        'add-task-glow-pulse': 'add-task-glow-pulse 3s ease-in-out infinite',
        'add-task-float-glyph': 'add-task-float-glyph 4s ease-in-out infinite',
        'no-user-add-task-glow-pulse':
          'no-user-add-task-glow-pulse 3s ease-in-out infinite',
        'no-user-add-task-float-glyph':
          'no-user-add-task-float-glyph 4s ease-in-out infinite',
        'show-task-glow-pulse': 'show-task-glow-pulse 3s ease-in-out infinite',
        'show-task-float-glyph':
          'show-task-float-glyph 4s ease-in-out infinite',
        'detailed-pricing-summary-glow':
          'detailed-pricing-summary-glow 3s ease-in-out infinite',
        'detailed-pricing-summary-float':
          'detailed-pricing-summary-float 4s ease-in-out infinite',
        'simple-pricing-summary-glow':
          'simple-pricing-summary-glow 4s ease-in-out infinite',
        'simple-pricing-summary-glyph-rotate':
          'simple-pricing-summary-glyph-rotate 8s ease-in-out infinite',
        'inventory-card-pulse': 'inventory-card-pulse 3s ease-in-out infinite',
        'inventory-card-border-glow':
          'inventory-card-border-glow 4s ease-in-out infinite',
        'inventory-card-shimmer':
          'inventory-card-shimmer 3s ease-in-out infinite',
        'task-card-glow': 'task-card-glow 2s ease-in-out infinite',
        'task-card-glyph-float':
          'task-card-glyph-float 4s ease-in-out infinite',
        'product-summary-pulse':
          'product-summary-pulse 2s ease-in-out infinite',
        'product-summary-switch-glow':
          'product-summary-switch-glow 2s ease-in-out infinite',
        'product-summary-float':
          'product-summary-float 10s ease-in-out infinite',
        'product-card-glow': 'product-card-glow 4s ease-in-out infinite',
        'product-card-rotate-glyph':
          'product-card-rotate-glyph 20s linear infinite',
        'product-card-counter-glow':
          'product-card-counter-glow 3s ease-in-out infinite',
        'nav-glow-pulse': 'nav-glow-pulse 2s ease-in-out infinite',
        'nav-float': 'nav-float 4s ease-in-out infinite',
        'nav-rotate-glyph': 'nav-rotate-glyph 15s linear infinite reverse',
        'nav-list-shimmer': 'nav-list-shimmer 1s ease-in-out',
        'sub-nav-list-shimmer': 'sub-nav-list-shimmer 1.2s ease-in-out',
        'form-project-board-glow-pulse':
          'form-project-board-glow-pulse 4s ease-in-out infinite',
        'form-project-board-float':
          'form-project-board-float 5s ease-in-out infinite',
        'form-project-board-shimmer':
          'form-project-board-shimmer 3s linear infinite',
        'form-project-board-task-flow':
          'form-project-board-task-flow 4s linear infinite',
        'popup-glow-pulse': 'popup-glow-pulse 4s ease-in-out infinite',
        'popup-float': 'popup-float 5s ease-in-out infinite',
        'popup-shimmer': 'popup-shimmer 3s linear infinite',
        'popup-scrollbar-glow': 'popup-scrollbar-glow 3s ease-in-out infinite',
        'popup-close-button-glow':
          'popup-close-button-glow 6s ease-in-out infinite',
        'dialog-glow-pulse': 'dialog-glow-pulse 4s ease-in-out infinite',
        'dialog-float': 'dialog-float 5s ease-in-out infinite',
        'dialog-shimmer': 'dialog-shimmer 3s linear infinite',
        'dialog-scrollbar-glow':
          'dialog-scrollbar-glow 3s ease-in-out infinite',
        'widget-float': 'widget-float 6s ease-in-out infinite',
        'widget-pulse': 'widget-pulse 4s ease-in-out infinite',
        'metric-card-rotate-glyph':
          'metric-card-rotate-glyph 60s linear infinite',
        'metric-card-glow': 'metric-card-glow 4s ease-in-out infinite',
        'metric-card-float': 'metric-card-float 8s ease-in-out infinite',
        'metric-card-shimmer': 'metric-card-shimmer 3s linear infinite',
        'metric-card-data-stream': 'metric-card-data-stream 6s linear infinite',
        'complex-text-editor-glyph-float':
          'complex-text-editor-glyph-float 10s ease-in-out infinite',
        'simple-editor-input-glow':
          'simple-editor-input-glow 4s ease-in-out infinite',
        'simple-editor-glyph-pulse':
          'simple-editor-glyph-pulse 3s ease-in-out infinite',
        'rich-text-editor-text-glow':
          'rich-text-editor-text-glow 3s ease-in-out infinite',
        'rich-text-editor-border-pulse':
          'rich-text-editor-border-pulse 4s ease-in-out infinite',
        'markdown-editor-code-glow':
          'markdown-editor-code-glow 4s ease-in-out infinite',
        'markdown-editor-glyph-rotate':
          'markdown-editor-glyph-rotate 20s linear infinite',
        'toolbar-icon-glow': 'toolbar-icon-glow 2s ease-in-out infinite',
        'complex-toolbar-button-glow':
          'complex-toolbar-button-glow 2s ease-in-out infinite',
        'time-range-glow-pulse':
          'time-range-glow-pulse 2s ease-in-out infinite',
        'time-range-float-glyph':
          'time-range-float-glyph 2s ease-in-out infinite',
        'time-range-sacred-glow':
          'time-range-sacred-glow 4s ease-in-out infinite',
        'dropdown-sacred-glow': 'dropdown-sacred-glow 2s ease-in-out infinite',
        'dropdown-float-glyph': 'dropdown-float-glyph 4s ease-in-out infinite',
        'form-datagrid-glow-pulse':
          'form-datagrid-glow-pulse 4s ease-in-out infinite',
        'form-datagrid-float': 'form-datagrid-float 5s ease-in-out infinite',
        'form-datagrid-shimmer': 'form-datagrid-shimmer 3s linear infinite',
        'form-datagrid-data-flow': 'form-datagrid-data-flow 4s linear infinite',
        'cc-expiration-float-glyph':
          'cc-expiration-float-glyph 6s ease-in-out infinite',
        'cc-expiration-glow-pulse':
          'cc-expiration-glow-pulse 4s ease-in-out infinite',
        'date-field-float-glyph':
          'date-field-float-glyph 2s ease-in-out infinite',
        'date-field-glow-pulse':
          'date-field-glow-pulse 2s ease-in-out infinite',
        'date-field-sacred-glow':
          'date-field-sacred-glow 4s ease-in-out infinite',
      },
      boxShadow: {
        'sacred-hover':
          '0 0 20px rgba(255, 215, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.4)',
        'sacred-glow-lg': '0 0 8px rgba(255, 215, 0, 0.6)',
        'sacred-glow-md': '0 0 6px rgba(255, 215, 0, 0.5)',
      },
    },
  },
  plugins: [
    plugin(pluginApi => {
      pluginApi.addUtilities({
        '.sacred-text-shadow': {
          textShadow: '0 0 10px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5)',
        },
        '.sacred-text-shadow-sm': {
          textShadow: '0 0 6px #FFD700, 0 0 12px rgba(255, 215, 0, 0.4)',
        },
        '.sacred-text-shadow-xs': {
          textShadow: '0 0 4px #FFD700, 0 0 8px rgba(255, 215, 0, 0.3)',
        },
        '.sacred-shimmer-bg': {
          backgroundImage:
            'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.95) 50%, rgba(255, 215, 0, 0.1) 100%)',
        },
        '.sacred-temple-bg': {
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
            radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
          `,
        },
        '.sacred-obsidian-bg': {
          backgroundColor: '#191919',
          backgroundImage:
            'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
        },
        '.sacred-checkbox-wrapper:hover::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)`,
          opacity: '1',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        },
        '.sacred-box': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid rgba(255, 215, 0, 0.6)',
          animation: 'sacred-border-glow 3s ease-in-out infinite',
        },
      })
    }),
  ],
}
export default config
