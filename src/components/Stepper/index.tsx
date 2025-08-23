'use client'

import React, { JSX, useState, useMemo, useEffect } from 'react'
import { getStepperStyles, SACRED_GLYPHS } from '../../theme'
import type { StepperStyles } from '../../theme'
import { injectKeyframes } from '../../theme/shared'
import Check from '../Icons/Check'
import CircleOutline from '../Icons/CircleOutline'
import Lock from '../Icons/Lock'
import Error from '../Icons/Error'
import CustomButton from '../Button'

// --------------------------------------------------------------------------
// PROPS INTERFACE
// --------------------------------------------------------------------------

export interface StepperProps {
  /** Mode: navigation (current) or wizard (new) */
  mode?: 'navigation' | 'wizard'

  /** Array of step objects defining the stepper configuration */
  steps: {
    stepNumber: number
    label: string
    stepLink?: string // Optional in wizard mode
    status?: 'completed' | 'active' | 'error' | 'inactive' // Auto-calculated in wizard mode
    statusLink?: string
    description?: string
    content?: React.ReactNode // For wizard mode
    icon?: React.ReactNode // Custom icon for this step (used when active/inactive)
  }[]

  // Wizard mode specific props
  activeStep?: number
  onNext?: () => void
  onBack?: () => void
  onReset?: () => void
  finalActions?: React.ReactNode
  stepActions?: React.ReactNode // Custom actions to show during step navigation

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

const Stepper: React.FC<StepperProps> = ({
  mode = 'navigation',
  steps,
  activeStep = 0,
  onNext,
  onBack,
  onReset,
  finalActions,
  stepActions,
  styles,
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [hoveredErrorIcon, setHoveredErrorIcon] = useState<number | null>(null)

  const orientation = styles?.orientation || 'horizontal'
  const isSacredTheme = styles?.theme === 'sacred'
  const isWizardMode = mode === 'wizard'

  const computedStyles = useMemo(() => getStepperStyles(styles), [styles])

  // Inject keyframes for animations
  useEffect(() => {
    injectKeyframes()
  }, [])

  // Auto-calculate step status for wizard mode
  const getStepStatus = (
    step: StepperProps['steps'][0],
    index: number
  ): 'completed' | 'active' | 'error' | 'inactive' => {
    if (!isWizardMode) {
      return step.status || 'inactive'
    }

    if (index < activeStep) return 'completed'
    if (index === activeStep) return 'active'
    return 'inactive'
  }

  const getStepIcon = (
    status: 'completed' | 'active' | 'error' | 'inactive',
    step: StepperProps['steps'][0],
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
        // Use custom icon if provided, otherwise use Lock
        if (step.icon) {
          return <div style={computedStyles.inactiveIcon}>{step.icon}</div>
        }
        return <Lock style={computedStyles.inactiveIcon} />
      default:
        // Use custom icon if provided, otherwise use CircleOutline
        if (step.icon) {
          return <div style={computedStyles.icon}>{step.icon}</div>
        }
        return <CircleOutline style={computedStyles.icon} />
    }
  }

  const getStepLink = (step: StepperProps['steps'][0]): string => {
    return step.statusLink || step.stepLink || '#'
  }

  const isStepClickable = (
    step: StepperProps['steps'][0],
    index: number
  ): boolean => {
    if (isWizardMode) {
      // In wizard mode, only allow navigation to completed steps or current step
      return index <= activeStep
    }
    return getStepStatus(step, index) !== 'inactive'
  }

  const handleStepClick = (step: StepperProps['steps'][0], index: number) => {
    if (isWizardMode) {
      // In wizard mode, clicking navigates to that step if allowed
      if (isStepClickable(step, index) && onNext && onBack) {
        // This would need additional logic to jump to specific steps
        // For now, we'll just prevent navigation in wizard mode
        return
      }
    } else if (isStepClickable(step, index)) {
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

  const renderWizardContent = () => {
    if (!isWizardMode) return null

    const currentStep = steps[activeStep]
    if (!currentStep) return null

    return (
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        {currentStep.content}
      </div>
    )
  }

  const renderWizardNavigation = () => {
    if (!isWizardMode) return null

    const isFirstStep = activeStep === 0
    const isLastStep = activeStep === steps.length - 1
    const isCompleted = activeStep >= steps.length

    if (isCompleted && finalActions) {
      return (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderRadius: '8px',
            backgroundColor: isSacredTheme
              ? 'rgba(255, 215, 0, 0.1)'
              : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
          }}
        >
          <div
            style={{
              color: isSacredTheme ? '#FFD700' : '#16a34a',
              fontWeight: 600,
              marginBottom: '1rem',
              fontSize: '1.1rem',
            }}
          >
            🎉 All steps completed!
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {finalActions}
            {onReset && (
              <CustomButton
                text="Start Over"
                onClick={onReset}
                styles={{
                  theme: styles?.theme || 'light',
                }}
              />
            )}
          </div>
        </div>
      )
    }

    return (
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          {!isFirstStep && onBack && (
            <CustomButton
              text="← Back"
              onClick={onBack}
              styles={{
                theme: styles?.theme || 'light',
                marginRight: '1rem',
              }}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {stepActions && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {stepActions}
            </div>
          )}
          {!isLastStep && onNext && (
            <CustomButton
              text={isLastStep ? 'Finish' : 'Continue →'}
              onClick={onNext}
              styles={{
                theme: styles?.theme || 'light',
              }}
            />
          )}
          {isLastStep && onNext && (
            <CustomButton
              text="Finish"
              onClick={onNext}
              styles={{
                theme: styles?.theme || 'light',
              }}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={computedStyles.container}>
      {isSacredTheme && <SacredGlyphDecoration />}
      <div
        style={{
          ...computedStyles.stepperContainer,
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: orientation === 'vertical' ? '1rem' : '0',
        }}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(step, index)
          const isClickable = isStepClickable(step, index)
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
                <div style={getStepIconContainerStyle(status)}>
                  {status === 'error' && step.description ? (
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
                        {getStepIcon(status, step, step.stepNumber)}
                      </div>
                    </Tooltip>
                  ) : (
                    getStepIcon(status, step, step.stepNumber)
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
                    onClick={() => handleStepClick(step, index)}
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

      {renderWizardContent()}
      {renderWizardNavigation()}
    </div>
  )
}

export default Stepper

// Render glyph only after hydration to avoid SSR/CSR mismatch
const SacredGlyphDecoration: React.FC = () => {
  const [glyph, setGlyph] = useState<string | null>(null)

  useEffect(() => {
    setGlyph(
      SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)] ?? null
    )
  }, [])

  if (!glyph) return null
  const styles = getStepperStyles({ theme: 'sacred' })
  return <div style={styles.sacredGlyph}>{glyph}</div>
}
