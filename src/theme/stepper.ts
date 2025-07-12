/**
 * @fileoverview Stepper component theme system with light, dark, and sacred themes.
 */
import React from 'react'
import {
  SACRED_GLYPHS,
  SACRED_ANIMATIONS,
  TRANSITIONS,
  SHADOWS,
} from './shared'

export interface StepperTheme {
  /** Main container styling */
  container: React.CSSProperties
  /** Sacred decorative glyph styling */
  sacredGlyph: React.CSSProperties
  /** Stepper container styling */
  stepperContainer: React.CSSProperties
  /** Individual step container styling */
  stepContainer: React.CSSProperties
  /** Step content wrapper styling */
  stepContent: React.CSSProperties
  /** Step icon container styling */
  stepIconContainer: React.CSSProperties
  /** Step icon container when completed */
  stepIconContainerCompleted: React.CSSProperties
  /** Step icon container when active */
  stepIconContainerActive: React.CSSProperties
  /** Step icon container when error */
  stepIconContainerError: React.CSSProperties
  /** Step icon container when inactive */
  stepIconContainerInactive: React.CSSProperties
  /** Step button styling */
  stepButton: React.CSSProperties
  /** Step button hover styling */
  stepButtonHover: React.CSSProperties
  /** Step button disabled styling */
  stepButtonDisabled: React.CSSProperties
  /** Info button styling */
  infoButton: React.CSSProperties
  /** Info button hover styling */
  infoButtonHover: React.CSSProperties
  /** Horizontal connector styling */
  connector: React.CSSProperties
  /** Vertical connector styling */
  verticalConnector: React.CSSProperties
  /** Step icon styling */
  icon: React.CSSProperties
  /** Inactive step icon styling */
  inactiveIcon: React.CSSProperties
  /** Tooltip container styling */
  tooltipContainer: React.CSSProperties
  /** Tooltip styling */
  tooltip: React.CSSProperties
  /** Tooltip arrow styling */
  tooltipArrow: React.CSSProperties
}

export interface StepperStyles {
  /** Theme selection: light, dark, or sacred */
  theme?: 'light' | 'dark' | 'sacred'
  /** Stepper orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Whether to show alternative labels */
  alternativeLabel?: boolean
  /** Custom container background color */
  containerBackground?: string
  /** Custom border color */
  borderColor?: string
  /** Custom border radius */
  borderRadius?: string
  /** Custom text color */
  textColor?: string
  /** Custom active color */
  activeColor?: string
  /** Custom completed color */
  completedColor?: string
  /** Custom inactive color */
  inactiveColor?: string
  /** Custom error color */
  errorColor?: string
  /** Custom connector color */
  connectorColor?: string
  /** Custom font family */
  fontFamily?: string
  /** Custom font size */
  fontSize?: string
  /** Custom font weight */
  fontWeight?: string | number
  /** Custom animation duration for sacred theme */
  animationDuration?: string
  /** Custom spacing between steps */
  stepSpacing?: string
  /** Custom icon size */
  iconSize?: string
  /** Custom step size */
  stepSize?: string
}

const lightTheme: StepperTheme = {
  container: {
    position: 'relative',
    padding: '1rem',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    transition: TRANSITIONS.medium,
  },
  sacredGlyph: {
    display: 'none',
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  stepContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  stepIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    border: '2px solid #D1D5DB',
    backgroundColor: '#F9FAFB',
    transition: TRANSITIONS.medium,
  },
  stepIconContainerCompleted: {
    backgroundColor: '#F0F9FF',
    borderColor: '#3B82F6',
  },
  stepIconContainerActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  stepIconContainerError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  stepIconContainerInactive: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  stepButton: {
    textAlign: 'left',
    fontWeight: 500,
    fontSize: '0.875rem',
    color: '#374151',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: TRANSITIONS.medium,
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  stepButtonHover: {
    color: '#2563EB',
  },
  stepButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    color: '#9CA3AF',
  },
  infoButton: {
    padding: '0.25rem',
    borderRadius: '50%',
    transition: TRANSITIONS.medium,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: '#374151',
  },
  connector: {
    flex: 1,
    height: '2px',
    margin: '0 1rem',
    backgroundColor: '#D1D5DB',
    transition: TRANSITIONS.medium,
  },
  verticalConnector: {
    width: '2px',
    height: '2rem',
    marginLeft: '1.25rem',
    marginRight: '0.5rem',
    backgroundColor: '#D1D5DB',
    transition: TRANSITIONS.medium,
  },
  icon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#374151',
  },
  inactiveIcon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#9CA3AF',
  },
  tooltipContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 50,
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    boxShadow: SHADOWS.light.small,
    whiteSpace: 'nowrap',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '8px',
    backgroundColor: '#1F2937',
    color: 'white',
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '4px solid transparent',
    borderTopColor: '#1F2937',
  },
}

const darkTheme: StepperTheme = {
  container: {
    position: 'relative',
    padding: '1rem',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    transition: TRANSITIONS.medium,
  },
  sacredGlyph: {
    display: 'none',
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  stepContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  stepIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    border: '2px solid #4B5563',
    backgroundColor: '#1F2937',
    transition: TRANSITIONS.medium,
  },
  stepIconContainerCompleted: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  stepIconContainerActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#60A5FA',
    boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.2)',
  },
  stepIconContainerError: {
    backgroundColor: '#7F1D1D',
    borderColor: '#EF4444',
  },
  stepIconContainerInactive: {
    backgroundColor: '#1F2937',
    borderColor: '#4B5563',
  },
  stepButton: {
    textAlign: 'left',
    fontWeight: 500,
    fontSize: '0.875rem',
    color: '#D1D5DB',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: TRANSITIONS.medium,
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  stepButtonHover: {
    color: '#60A5FA',
  },
  stepButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    color: '#6B7280',
  },
  infoButton: {
    padding: '0.25rem',
    borderRadius: '50%',
    transition: TRANSITIONS.medium,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#D1D5DB',
  },
  connector: {
    flex: 1,
    height: '2px',
    margin: '0 1rem',
    backgroundColor: '#4B5563',
    transition: TRANSITIONS.medium,
  },
  verticalConnector: {
    width: '2px',
    height: '2rem',
    marginLeft: '1.25rem',
    marginRight: '0.5rem',
    backgroundColor: '#4B5563',
    transition: TRANSITIONS.medium,
  },
  icon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#D1D5DB',
  },
  inactiveIcon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#6B7280',
  },
  tooltipContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 50,
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    boxShadow: SHADOWS.dark.small,
    whiteSpace: 'nowrap',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '8px',
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '4px solid transparent',
    borderTopColor: '#F3F4F6',
  },
}

const sacredTheme: StepperTheme = {
  container: {
    position: 'relative',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    transition: TRANSITIONS.premium,
    animation: SACRED_ANIMATIONS.glow,
  },
  sacredGlyph: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    fontSize: '1.25rem',
    color: 'rgba(255, 215, 0, 0.2)',
    animation: 'glyph-rotate 10s linear infinite',
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  stepContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  stepIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    transition: TRANSITIONS.premium,
  },
  stepIconContainerCompleted: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
  },
  stepIconContainerActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: '#FFD700',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
    animation: 'sacred-glow-pulse 1.5s infinite alternate',
  },
  stepIconContainerError: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderColor: '#EF4444',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
  },
  stepIconContainerInactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  stepButton: {
    textAlign: 'left',
    fontWeight: 500,
    fontSize: '0.875rem',
    color: 'rgba(255, 215, 0, 0.9)',
    fontFamily: 'Cinzel, serif',
    transition: TRANSITIONS.premium,
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  stepButtonHover: {
    color: '#FFD700',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  },
  stepButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    color: 'rgba(255, 215, 0, 0.4)',
  },
  infoButton: {
    padding: '0.25rem',
    borderRadius: '50%',
    transition: TRANSITIONS.premium,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#FFD700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
  },
  connector: {
    flex: 1,
    height: '2px',
    margin: '0 1rem',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    transition: TRANSITIONS.premium,
    backgroundImage:
      'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.3), transparent)',
  },
  verticalConnector: {
    width: '2px',
    height: '2rem',
    marginLeft: '1.25rem',
    marginRight: '0.5rem',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    transition: TRANSITIONS.premium,
    backgroundImage:
      'linear-gradient(to bottom, transparent, rgba(255, 215, 0, 0.3), transparent)',
  },
  icon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#FFD700',
    animation: 'sacred-icon-glow 1.5s infinite alternate',
    filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))',
  },
  inactiveIcon: {
    width: '1.5rem',
    height: '1.5rem',
    color: 'rgba(255, 215, 0, 0.5)',
    filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))',
  },
  tooltipContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 50,
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
    whiteSpace: 'nowrap',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '8px',
    backgroundColor: '#FFD700',
    color: '#1C1917',
    fontWeight: 'bold',
    fontFamily: 'Cinzel, serif',
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '4px solid transparent',
    borderTopColor: '#FFD700',
  },
}

export const getStepperStyles = (styles?: StepperStyles): StepperTheme => {
  const baseTheme =
    styles?.theme === 'light'
      ? lightTheme
      : styles?.theme === 'sacred'
        ? sacredTheme
        : darkTheme

  const customStyles: StepperTheme = {
    container: {
      ...baseTheme.container,
      ...(styles?.containerBackground && {
        backgroundColor: styles.containerBackground,
      }),
      ...(styles?.borderColor && { borderColor: styles.borderColor }),
      ...(styles?.borderRadius && { borderRadius: styles.borderRadius }),
    },
    sacredGlyph: baseTheme.sacredGlyph,
    stepperContainer: baseTheme.stepperContainer,
    stepContainer: baseTheme.stepContainer,
    stepContent: {
      ...baseTheme.stepContent,
      ...(styles?.stepSpacing && { gap: styles.stepSpacing }),
    },
    stepIconContainer: {
      ...baseTheme.stepIconContainer,
      ...(styles?.stepSize && {
        width: styles.stepSize,
        height: styles.stepSize,
      }),
    },
    stepIconContainerCompleted: {
      ...baseTheme.stepIconContainerCompleted,
      ...(styles?.completedColor && {
        borderColor: styles.completedColor,
      }),
    },
    stepIconContainerActive: {
      ...baseTheme.stepIconContainerActive,
      ...(styles?.activeColor && {
        borderColor: styles.activeColor,
      }),
    },
    stepIconContainerError: {
      ...baseTheme.stepIconContainerError,
      ...(styles?.errorColor && {
        borderColor: styles.errorColor,
      }),
    },
    stepIconContainerInactive: {
      ...baseTheme.stepIconContainerInactive,
      ...(styles?.inactiveColor && {
        borderColor: styles.inactiveColor,
      }),
    },
    stepButton: {
      ...baseTheme.stepButton,
      ...(styles?.textColor && { color: styles.textColor }),
      ...(styles?.fontFamily && { fontFamily: styles.fontFamily }),
      ...(styles?.fontSize && { fontSize: styles.fontSize }),
      ...(styles?.fontWeight && { fontWeight: styles.fontWeight }),
    },
    stepButtonHover: baseTheme.stepButtonHover,
    stepButtonDisabled: baseTheme.stepButtonDisabled,
    infoButton: baseTheme.infoButton,
    infoButtonHover: baseTheme.infoButtonHover,
    connector: {
      ...baseTheme.connector,
      ...(styles?.connectorColor && { backgroundColor: styles.connectorColor }),
    },
    verticalConnector: {
      ...baseTheme.verticalConnector,
      ...(styles?.connectorColor && { backgroundColor: styles.connectorColor }),
    },
    icon: {
      ...baseTheme.icon,
      ...(styles?.iconSize && {
        width: styles.iconSize,
        height: styles.iconSize,
      }),
    },
    inactiveIcon: {
      ...baseTheme.inactiveIcon,
      ...(styles?.iconSize && {
        width: styles.iconSize,
        height: styles.iconSize,
      }),
    },
    tooltipContainer: baseTheme.tooltipContainer,
    tooltip: baseTheme.tooltip,
    tooltipArrow: baseTheme.tooltipArrow,
  }

  return customStyles
}

export { SACRED_GLYPHS }
