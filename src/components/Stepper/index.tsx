'use client'

import React, { JSX, useState, useMemo, useEffect } from 'react'
import { StepperStyles, getStepperStyles, SACRED_GLYPHS } from '../../theme'
import { injectKeyframes } from '../../theme/shared'
import Check from '../Icons/Check'
import CircleOutline from '../Icons/CircleOutline'
import Lock from '../Icons/Lock'
import Error from '../Icons/Error'
import InfoOutline from '../Icons/InfoOutline'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface StepperProps {
  /** Array of step objects defining the stepper configuration */
  steps: {
    stepNumber: number
    label: string
    stepLink: string
    status: 'completed' | 'active' | 'error' | 'inactive'
    statusLink?: string
    description?: string
  }[]
  /** Comprehensive styling options including theme, custom colors, and layout properties */
  styles?: StepperStyles
}

// --------------------------------------------------------------------------
// TOOLTIP COMPONENT
// --------------------------------------------------------------------------

const Tooltip: React.FC<{
  children: React.ReactNode
  title: string
  styles: ReturnType<typeof getStepperStyles>
}> = ({ children, title, styles }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      style={styles.tooltipContainer}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={styles.tooltip}>
          {title}
          <div style={styles.tooltipArrow} />
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN STEPPER COMPONENT
// --------------------------------------------------------------------------

const Stepper: React.FC<StepperProps> = ({ steps, styles }) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [hoveredErrorIcon, setHoveredErrorIcon] = useState<number | null>(null)

  const orientation = styles?.orientation || 'horizontal'
  const isSacredTheme = styles?.theme === 'sacred'

  const computedStyles = useMemo(() => getStepperStyles(styles), [styles])

  // Inject keyframes for animations
  useEffect(() => {
    injectKeyframes()
  }, [])

  const getStepIcon = (
    status: 'completed' | 'active' | 'error' | 'inactive',
    stepNumber?: number
  ): JSX.Element => {
    switch (status) {
      case 'completed': {
        return <Check style={computedStyles.icon} />
      }
      case 'error': {
        const isErrorHovered = hoveredErrorIcon === stepNumber
        return (
          <Error
            style={{
              ...computedStyles.errorIcon,
              ...(isErrorHovered && computedStyles.errorIconHover),
            }}
          />
        )
      }
      case 'inactive':
        return <Lock style={computedStyles.inactiveIcon} />
      default:
        return <CircleOutline style={computedStyles.icon} />
    }
  }

  const getStepLink = (step: StepperProps['steps'][0]): string => {
    return step.statusLink || step.stepLink
  }

  const isStepClickable = (step: StepperProps['steps'][0]): boolean => {
    return step.status !== 'inactive'
  }

  const handleStepClick = (step: StepperProps['steps'][0]) => {
    if (isStepClickable(step)) {
      window.location.href = getStepLink(step)
    }
  }

  const getStepIconContainerStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          ...computedStyles.stepIconContainer,
          ...computedStyles.stepIconContainerCompleted,
        }
      case 'active':
        return {
          ...computedStyles.stepIconContainer,
          ...computedStyles.stepIconContainerActive,
        }
      case 'error':
        return {
          ...computedStyles.stepIconContainer,
          ...computedStyles.stepIconContainerError,
        }
      case 'inactive':
        return {
          ...computedStyles.stepIconContainer,
          ...computedStyles.stepIconContainerInactive,
        }
      default:
        return computedStyles.stepIconContainer
    }
  }

  return (
    <div style={computedStyles.container}>
      {isSacredTheme && (
        <div style={computedStyles.sacredGlyph}>
          {SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]}
        </div>
      )}
      <div
        style={{
          ...computedStyles.stepperContainer,
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: orientation === 'vertical' ? '1rem' : '0',
        }}
      >
        {steps.map((step, index) => {
          const isClickable = isStepClickable(step)
          const isHovered = hoveredStep === step.stepNumber

          return (
            <div
              key={step.label}
              style={{
                ...computedStyles.stepContainer,
                flex: orientation === 'horizontal' ? 1 : 'none',
                width: orientation === 'vertical' ? '100%' : 'auto',
              }}
            >
              <div style={computedStyles.stepContent}>
                <div style={getStepIconContainerStyle(step.status)}>
                  {step.status === 'error' && step.description ? (
                    <Tooltip title={step.description} styles={computedStyles}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={() =>
                          setHoveredErrorIcon(step.stepNumber)
                        }
                        onMouseLeave={() => setHoveredErrorIcon(null)}
                      >
                        {getStepIcon(step.status, step.stepNumber)}
                      </div>
                    </Tooltip>
                  ) : (
                    getStepIcon(step.status, step.stepNumber)
                  )}
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
                      ...computedStyles.stepButton,
                      ...(isHovered &&
                        isClickable &&
                        computedStyles.stepButtonHover),
                      ...(!isClickable && computedStyles.stepButtonDisabled),
                    }}
                    onMouseEnter={() => setHoveredStep(step.stepNumber)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    {step.label}
                  </button>

                  {step.description && step.status !== 'error' && (
                    <Tooltip title={step.description} styles={computedStyles}>
                      <button
                        style={{
                          ...computedStyles.infoButton,
                          ...(isHovered && computedStyles.infoButtonHover),
                        }}
                      >
                        <InfoOutline
                          style={{ width: '1rem', height: '1rem' }}
                        />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && orientation === 'horizontal' && (
                <div style={computedStyles.connector} />
              )}

              {index < steps.length - 1 && orientation === 'vertical' && (
                <div style={computedStyles.verticalConnector} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

Stepper.displayName = 'Stepper'

export default Stepper
