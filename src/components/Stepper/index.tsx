'use client'

import React, { JSX, useState } from 'react'
import Check from '../Icons/Check'
import CircleOutline from '../Icons/CircleOutline'
import Lock from '../Icons/Lock'
import InfoOutline from '../Icons/InfoOutline'

type CustomStepperProps = {
  steps: {
    stepNumber: number
    label: string
    stepLink: string
    status: 'completed' | 'active' | 'error' | 'inactive'
    statusLink?: string
    description?: string
  }[]
  sacredtheme?: boolean
  orientation?: 'horizontal' | 'vertical'
  alternativeLabel?: boolean
}

const premiumTooltipStyles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  } as React.CSSProperties,
  tooltip: {
    position: 'absolute',
    zIndex: 50,
    padding: '4px 8px',
    fontSize: '14px',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    whitespace: 'nowrap',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '8px',
    backgroundColor: 'black',
    color: 'white',
  } as React.CSSProperties,
  arrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '4px solid transparent',
    borderTopColor: 'black',
  } as React.CSSProperties,
}

const sacredTooltipStyles = {
  ...premiumTooltipStyles,
  tooltip: {
    ...premiumTooltipStyles.tooltip,
    backgroundColor: '#FFD700',
    color: 'black',
    fontWeight: 'bold',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
  } as React.CSSProperties,
  arrow: {
    ...premiumTooltipStyles.arrow,
    borderTopColor: '#FFD700',
  } as React.CSSProperties,
}

const Tooltip: React.FC<{
  children: React.ReactNode
  title: string
  sacredtheme?: boolean
}> = ({ children, title, sacredtheme }) => {
  const [isVisible, setIsVisible] = useState(false)
  const styles = sacredtheme ? sacredTooltipStyles : premiumTooltipStyles

  return (
    <div
      style={styles.container}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={styles.tooltip}>
          {title}
          <div style={styles.arrow} />
        </div>
      )}
    </div>
  )
}

const getStyles = (sacredtheme?: boolean) => ({
  container: {
    position: 'relative',
    padding: '1rem',
    ...(sacredtheme && {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 215, 0, 0.3)',
    }),
  } as React.CSSProperties,
  sacredGlyph: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    fontSize: '1.25rem',
    color: 'rgba(255, 215, 0, 0.2)',
    animation: 'glyph-rotate 10s linear infinite',
  } as React.CSSProperties,
  stepperContainer: {
    display: 'flex',
  } as React.CSSProperties,
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  stepContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  } as React.CSSProperties,
  stepIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    borderWidth: '2px',
  } as React.CSSProperties,
  stepButton: {
    textAlign: 'left',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.9)' : 'black',
  } as React.CSSProperties,
  stepButtonHover: {
    color: sacredtheme ? '#FFD700' : '#2563EB',
    textShadow: sacredtheme ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
  } as React.CSSProperties,
  stepButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  } as React.CSSProperties,
  infoButton: {
    padding: '0.25rem',
    borderRadius: '9999px',
    transition: 'all 0.3s ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: sacredtheme ? '#FFD700' : 'black',
  } as React.CSSProperties,
  infoButtonHover: {
    backgroundColor: sacredtheme
      ? 'rgba(255, 215, 0, 0.1)'
      : 'rgba(0, 0, 0, 0.05)',
  } as React.CSSProperties,
  connector: {
    flex: 1,
    height: '2px',
    margin: '0 1rem',
    backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#D1D5DB',
  } as React.CSSProperties,
  verticalConnector: {
    width: '2px',
    height: '2rem',
    marginLeft: '1.25rem',
    marginRight: '0.5rem',
    backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#D1D5DB',
  } as React.CSSProperties,
  icon: {
    width: '1.5rem',
    height: '1.5rem',
    color: sacredtheme ? '#FFD700' : 'black',
    animation: sacredtheme
      ? 'sacred-icon-glow 1.5s infinite alternate'
      : 'none',
  } as React.CSSProperties,
  inactiveIcon: {
    width: '1.5rem',
    height: '1.5rem',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.5)' : 'black',
    filter: sacredtheme
      ? 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))'
      : 'none',
  } as React.CSSProperties,
})

function CustomStepper({
  steps,
  sacredtheme,
  orientation = 'horizontal',
}: CustomStepperProps): JSX.Element {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const styles = getStyles(sacredtheme)

  const getStepIcon = (
    status: 'completed' | 'active' | 'error' | 'inactive'
  ): JSX.Element => {
    switch (status) {
      case 'completed':
        return <Check style={styles.icon} />
      case 'error':
        return <CircleOutline style={styles.icon} />
      case 'inactive':
        return <Lock style={styles.inactiveIcon} />
      default:
        return <CircleOutline style={styles.icon} />
    }
  }

  const getStepLink = (step: CustomStepperProps['steps'][0]): string => {
    return step.statusLink || step.stepLink
  }

  const isStepClickable = (step: CustomStepperProps['steps'][0]): boolean => {
    return step.status !== 'inactive'
  }

  const handleStepClick = (step: CustomStepperProps['steps'][0]) => {
    if (isStepClickable(step)) {
      window.location.href = getStepLink(step)
    }
  }

  return (
    <div style={styles.container}>
      {sacredtheme && <div style={styles.sacredGlyph}>𓊻</div>}
      <div
        style={{
          ...styles.stepperContainer,
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: orientation === 'vertical' ? '1rem' : '0',
        }}
      >
        {steps.map((step, index) => {
          const isClickable = isStepClickable(step)
          const isHovered = hoveredStep === step.stepNumber

          const stepIconContainerStyle = {
            ...styles.stepIconContainer,
            ...(step.status === 'completed' && {
              backgroundColor: sacredtheme
                ? 'rgba(255, 215, 0, 0.2)'
                : '#F3F4F6',
              borderColor: sacredtheme ? '#FFD700' : 'black',
            }),
            ...(step.status === 'active' && {
              backgroundColor: sacredtheme
                ? 'rgba(255, 215, 0, 0.1)'
                : '#EFF6FF',
              borderColor: sacredtheme ? '#FFD700' : '#3B82F6',
              animation: sacredtheme
                ? 'sacred-glow-pulse 1.5s infinite alternate'
                : 'none',
            }),
            ...(step.status === 'error' && {
              backgroundColor: '#FEF2F2',
              borderColor: '#EF4444',
            }),
            ...(step.status === 'inactive' && {
              backgroundColor: sacredtheme ? 'rgba(0, 0, 0, 0.4)' : '#F9FAFB',
              borderColor: sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#D1D5DB',
            }),
          }

          return (
            <div
              key={step.label}
              style={{
                ...styles.stepContainer,
                flex: orientation === 'horizontal' ? 1 : 'none',
                width: orientation === 'vertical' ? '100%' : 'auto',
              }}
            >
              <div style={styles.stepContent}>
                <div style={stepIconContainerStyle}>
                  {getStepIcon(step.status)}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    onClick={() => handleStepClick(step)}
                    disabled={!isClickable}
                    style={{
                      ...styles.stepButton,
                      ...(isHovered && isClickable && styles.stepButtonHover),
                      ...(!isClickable && styles.stepButtonDisabled),
                    }}
                    onMouseEnter={() => setHoveredStep(step.stepNumber)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {step.label}
                  </button>

                  {step.description && (
                    <Tooltip title={step.description} sacredtheme={sacredtheme}>
                      <button style={styles.infoButton}>
                        <InfoOutline
                          style={{ width: '1rem', height: '1rem' }}
                        />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && orientation === 'horizontal' && (
                <div style={styles.connector} />
              )}

              {index < steps.length - 1 && orientation === 'vertical' && (
                <div style={styles.verticalConnector} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

CustomStepper.displayName = 'CustomStepper'

export { CustomStepper }
export type { CustomStepperProps }
