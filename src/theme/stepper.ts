/**
 * @fileoverview Stepper component theme system with light, dark, and sacred themes.
 */
import React from 'react'
import { TRANSITIONS, SHADOWS } from './shared'

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
  /** Error step icon styling */
  errorIcon: React.CSSProperties
  /** Error step icon hover styling */
  errorIconHover: React.CSSProperties
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
    padding: '1.5rem',
    backgroundColor: 'transparent',
    borderRadius: '12px',
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
    position: 'relative',
  },
  stepContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  stepIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    border: '2px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    transition: TRANSITIONS.medium,
    boxShadow: SHADOWS.light.small,
    position: 'relative',
    cursor: 'pointer',
  },
  stepIconContainerCompleted: {
    backgroundColor: '#F0F9FF',
    borderColor: '#3B82F6',
    boxShadow:
      '0 4px 12px rgba(59, 130, 246, 0.15), 0 2px 4px rgba(59, 130, 246, 0.1)',
    transform: 'scale(1.05)',
  },
  stepIconContainerActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    boxShadow:
      '0 0 0 4px rgba(37, 99, 235, 0.1), 0 4px 16px rgba(37, 99, 235, 0.2)',
    transform: 'scale(1.1)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  stepIconContainerError: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    transform: 'none',
    width: 'auto',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconContainerInactive: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    opacity: 0.6,
  },
  stepButton: {
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#1F2937',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: TRANSITIONS.medium,
    background: 'none',
    border: 'none',
    padding: '0.25rem 0',
    cursor: 'pointer',
    letterSpacing: '0.025em',
    lineHeight: 1.4,
  },
  stepButtonHover: {
    color: '#2563EB',
    transform: 'translateY(-1px)',
  },
  stepButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.4,
    color: '#9CA3AF',
  },
  infoButton: {
    padding: '0.375rem',
    borderRadius: '50%',
    transition: TRANSITIONS.medium,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  infoButtonHover: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#2563EB',
    transform: 'scale(1.1)',
  },
  connector: {
    flex: 1,
    height: '3px',
    margin: '0 1.5rem',
    backgroundColor: '#E5E7EB',
    borderRadius: '1.5px',
    transition: TRANSITIONS.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  verticalConnector: {
    width: '3px',
    height: '2.5rem',
    marginLeft: '1.5rem',
    marginRight: '1rem',
    backgroundColor: '#E5E7EB',
    borderRadius: '1.5px',
    transition: TRANSITIONS.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  icon: {
    width: '1.25rem',
    height: '1.25rem',
    color: '#2563EB',
    transition: TRANSITIONS.medium,
  },
  errorIcon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#EF4444',
    transition: TRANSITIONS.medium,
    cursor: 'pointer',
    filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
  },
  errorIconHover: {
    transform: 'scale(1.1)',
  },
  inactiveIcon: {
    width: '1.25rem',
    height: '1.25rem',
    color: '#9CA3AF',
  },
  tooltipContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 50,
    padding: '0.5rem 0.75rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
    boxShadow: SHADOWS.light.medium,
    whiteSpace: 'nowrap',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '0.5rem',
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    fontWeight: 500,
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '5px solid transparent',
    borderTopColor: '#1F2937',
  },
}

const darkTheme: StepperTheme = {
  container: {
    position: 'relative',
    padding: '1.5rem',
    backgroundColor: 'transparent',
    borderRadius: '12px',
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
    position: 'relative',
  },
  stepContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  stepIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    border: '2px solid #374151',
    backgroundColor: '#1F2937',
    transition: TRANSITIONS.medium,
    boxShadow: SHADOWS.dark.small,
    position: 'relative',
    cursor: 'pointer',
  },
  stepIconContainerCompleted: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
    boxShadow:
      '0 4px 12px rgba(59, 130, 246, 0.25), 0 2px 4px rgba(59, 130, 246, 0.15)',
    transform: 'scale(1.05)',
  },
  stepIconContainerActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#60A5FA',
    boxShadow:
      '0 0 0 4px rgba(96, 165, 250, 0.15), 0 4px 16px rgba(96, 165, 250, 0.3)',
    transform: 'scale(1.1)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  stepIconContainerError: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    transform: 'none',
    width: 'auto',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconContainerInactive: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    opacity: 0.6,
  },
  stepButton: {
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#F3F4F6',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: TRANSITIONS.medium,
    background: 'none',
    border: 'none',
    padding: '0.25rem 0',
    cursor: 'pointer',
    letterSpacing: '0.025em',
    lineHeight: 1.4,
  },
  stepButtonHover: {
    color: '#60A5FA',
    transform: 'translateY(-1px)',
  },
  stepButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.4,
    color: '#6B7280',
  },
  infoButton: {
    padding: '0.375rem',
    borderRadius: '50%',
    transition: TRANSITIONS.medium,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  infoButtonHover: {
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    color: '#60A5FA',
    transform: 'scale(1.1)',
  },
  connector: {
    flex: 1,
    height: '3px',
    margin: '0 1.5rem',
    backgroundColor: '#374151',
    borderRadius: '1.5px',
    transition: TRANSITIONS.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  verticalConnector: {
    width: '3px',
    height: '2.5rem',
    marginLeft: '1.5rem',
    marginRight: '1rem',
    backgroundColor: '#374151',
    borderRadius: '1.5px',
    transition: TRANSITIONS.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  icon: {
    width: '1.25rem',
    height: '1.25rem',
    color: '#60A5FA',
    transition: TRANSITIONS.medium,
  },
  errorIcon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#EF4444',
    transition: TRANSITIONS.medium,
    cursor: 'pointer',
    filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
  },
  errorIconHover: {
    transform: 'scale(1.1)',
  },
  inactiveIcon: {
    width: '1.25rem',
    height: '1.25rem',
    color: '#6B7280',
  },
  tooltipContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 50,
    padding: '0.5rem 0.75rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
    boxShadow: SHADOWS.dark.medium,
    whiteSpace: 'nowrap',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '0.5rem',
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
    fontWeight: 500,
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '5px solid transparent',
    borderTopColor: '#F3F4F6',
  },
}

const sacredTheme: StepperTheme = {
  container: {
    position: 'relative',
    padding: '2rem 2.5rem',
    backgroundColor: 'rgba(8, 8, 12, 0.95)',
    borderRadius: '20px',
    border: '2px solid transparent',
    backgroundImage: `
      linear-gradient(rgba(8, 8, 12, 0.95), rgba(8, 8, 12, 0.95)),
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.4) 0%, 
        rgba(255, 215, 0, 0.1) 25%, 
        rgba(184, 134, 11, 0.2) 50%, 
        rgba(255, 215, 0, 0.1) 75%, 
        rgba(255, 215, 0, 0.4) 100%
      )
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    transition: TRANSITIONS.premium,
    boxShadow: `
      0 0 40px rgba(255, 215, 0, 0.3),
      0 0 80px rgba(255, 215, 0, 0.1),
      inset 0 0 40px rgba(255, 215, 0, 0.05)
    `,
  },
  sacredGlyph: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    fontSize: '1.75rem',
    color: 'rgba(255, 215, 0, 0.4)',
    animation: 'glyph-rotate 20s linear infinite',
    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.3))',
    userSelect: 'none',
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    gap: '0.5rem',
  },
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },
  stepContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
    zIndex: 1,
  },
  stepIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3.25rem',
    height: '3.25rem',
    borderRadius: '50%',
    border: '2px solid rgba(255, 215, 0, 0.5)',
    backgroundColor: 'rgba(8, 8, 12, 0.8)',
    transition: TRANSITIONS.premium,
    position: 'relative',
    cursor: 'pointer',
    boxShadow: `
      0 0 20px rgba(255, 215, 0, 0.2),
      inset 0 0 20px rgba(255, 215, 0, 0.1)
    `,
  },
  stepIconContainerCompleted: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderColor: 'rgba(255, 215, 0, 0.8)',
    boxShadow: `
      0 0 30px rgba(255, 215, 0, 0.4),
      0 0 60px rgba(255, 215, 0, 0.2),
      inset 0 0 30px rgba(255, 215, 0, 0.15)
    `,
    transform: 'scale(1.08)',
  },
  stepIconContainerActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    borderColor: 'rgba(255, 215, 0, 0.9)',
    boxShadow: `
      0 0 40px rgba(255, 215, 0, 0.6),
      0 0 80px rgba(255, 215, 0, 0.3),
      inset 0 0 40px rgba(255, 215, 0, 0.2)
    `,
    transform: 'scale(1.12)',
  },
  stepIconContainerError: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    transform: 'none',
    width: 'auto',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconContainerInactive: {
    backgroundColor: 'rgba(8, 8, 12, 0.8)',
    borderColor: 'rgba(255, 215, 0, 0.25)',
    opacity: 0.5,
    boxShadow: `
      0 0 10px rgba(255, 215, 0, 0.1),
      inset 0 0 10px rgba(255, 215, 0, 0.05)
    `,
  },
  stepButton: {
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '1rem',
    color: 'rgba(255, 215, 0, 0.95)',
    fontFamily: 'Cinzel, serif',
    transition: TRANSITIONS.premium,
    background: 'none',
    border: 'none',
    padding: '0.5rem 0',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    lineHeight: 1.3,
    textShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
    position: 'relative',
  },
  stepButtonHover: {
    color: 'rgba(255, 215, 0, 1)',
    textShadow: `
      0 0 20px rgba(255, 215, 0, 0.8),
      0 0 40px rgba(255, 215, 0, 0.4)
    `,
    transform: 'translateY(-1px)',
  },
  stepButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.4,
    color: 'rgba(255, 215, 0, 0.3)',
    textShadow: 'none',
  },
  infoButton: {
    padding: '0.5rem',
    borderRadius: '50%',
    transition: TRANSITIONS.premium,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255, 215, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  infoButtonHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    color: 'rgba(255, 215, 0, 1)',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
    transform: 'scale(1.1)',
  },
  connector: {
    flex: 1,
    height: '3px',
    margin: '0 1.5rem',
    backgroundColor: 'transparent',
    borderRadius: '1.5px',
    transition: TRANSITIONS.premium,
    position: 'relative',
    overflow: 'hidden',
    background: `
      linear-gradient(90deg, 
        rgba(255, 215, 0, 0.1) 0%, 
        rgba(255, 215, 0, 0.4) 30%, 
        rgba(255, 215, 0, 0.6) 50%, 
        rgba(255, 215, 0, 0.4) 70%, 
        rgba(255, 215, 0, 0.1) 100%
      )
    `,
    boxShadow: `
      0 0 10px rgba(255, 215, 0, 0.3),
      inset 0 0 10px rgba(255, 215, 0, 0.1)
    `,
  },
  verticalConnector: {
    width: '3px',
    height: '2.5rem',
    marginLeft: '1.625rem',
    marginRight: '1rem',
    backgroundColor: 'transparent',
    borderRadius: '1.5px',
    transition: TRANSITIONS.premium,
    position: 'relative',
    overflow: 'hidden',
    background: `
      linear-gradient(180deg, 
        rgba(255, 215, 0, 0.1) 0%, 
        rgba(255, 215, 0, 0.4) 30%, 
        rgba(255, 215, 0, 0.6) 50%, 
        rgba(255, 215, 0, 0.4) 70%, 
        rgba(255, 215, 0, 0.1) 100%
      )
    `,
    boxShadow: `
      0 0 10px rgba(255, 215, 0, 0.3),
      inset 0 0 10px rgba(255, 215, 0, 0.1)
    `,
  },
  icon: {
    width: '1.375rem',
    height: '1.375rem',
    color: 'rgba(255, 215, 0, 0.95)',
    transition: TRANSITIONS.premium,
    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))',
  },
  errorIcon: {
    width: '1.75rem',
    height: '1.75rem',
    color: 'rgba(184, 134, 11, 0.95)',
    transition: TRANSITIONS.premium,
    cursor: 'pointer',
    filter: 'drop-shadow(0 0 12px rgba(184, 134, 11, 0.7))',
  },
  errorIconHover: {
    transform: 'scale(1.1)',
  },
  inactiveIcon: {
    width: '1.375rem',
    height: '1.375rem',
    color: 'rgba(255, 215, 0, 0.4)',
    filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.3))',
  },
  tooltipContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 50,
    padding: '0.75rem 1.25rem',
    fontSize: '0.875rem',
    borderRadius: '12px',
    boxShadow: `
      0 0 30px rgba(255, 215, 0, 0.6),
      0 0 60px rgba(255, 215, 0, 0.3)
    `,
    whiteSpace: 'nowrap',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '1rem',
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    color: 'rgba(8, 8, 12, 0.95)',
    fontWeight: 700,
    fontFamily: 'Cinzel, serif',
    letterSpacing: '0.025em',
    border: '1px solid rgba(255, 215, 0, 0.8)',
    textShadow: 'none',
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '6px solid transparent',
    borderTopColor: 'rgba(255, 215, 0, 0.95)',
    filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))',
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
    errorIcon: {
      ...baseTheme.errorIcon,
      ...(styles?.iconSize && {
        width: styles.iconSize,
        height: styles.iconSize,
      }),
    },
    errorIconHover: baseTheme.errorIconHover,
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
