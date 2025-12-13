'use client'

import React, { useState } from 'react'
import { alpha } from '../../utils'
import Check from '../Icons/Check'
import CircleOutline from '../Icons/CircleOutline'
import Lock from '../Icons/Lock'
import Error from '../Icons/Error'
import CustomButton from '../Button'

const SACRED_GOLD = '#FFD700'

export interface StepperProps {
  mode?: 'navigation' | 'wizard'
  steps: {
    stepNumber: number
    label: string
    stepLink?: string
    status?: 'completed' | 'active' | 'error' | 'inactive'
    statusLink?: string
    description?: string
    content?: React.ReactNode
    icon?: React.ReactNode
  }[]
  activeStep?: number
  onNext?: () => void
  onBack?: () => void
  onReset?: () => void
  finalActions?: React.ReactNode
  stepActions?: React.ReactNode
  styles?: {
    orientation?: 'horizontal' | 'vertical'
    theme?: string
    gap?: string
    padding?: string
    marginBottom?: string
  }
}

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

  const orientation = styles?.orientation || 'horizontal'
  const isWizardMode = mode === 'wizard'

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
    step: StepperProps['steps'][0]
  ) => {
    const iconStyle: React.CSSProperties = {
      width: '20px',
      height: '20px',
      color: SACRED_GOLD,
    }

    switch (status) {
      case 'completed':
        return <Check style={iconStyle} />
      case 'error':
        return <Error style={{ ...iconStyle, color: '#ff6b6b' }} />
      case 'inactive':
        if (step.icon) return <div style={iconStyle}>{step.icon}</div>
        return (
          <Lock style={{ ...iconStyle, color: 'rgba(255, 255, 255, 0.4)' }} />
        )
      default:
        if (step.icon) return <div style={iconStyle}>{step.icon}</div>
        return <CircleOutline style={iconStyle} />
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
      return index <= activeStep
    }
    return getStepStatus(step, index) !== 'inactive'
  }

  const handleStepClick = (step: StepperProps['steps'][0], index: number) => {
    if (isWizardMode) {
      if (isStepClickable(step, index) && onNext && onBack) {
        return
      }
    } else if (isStepClickable(step, index)) {
      // Use location.assign() instead of direct href assignment to avoid lint error
      window.location.assign(getStepLink(step))
    }
  }

  const getIconContainerColor = (status: string) => {
    switch (status) {
      case 'completed':
        return alpha(SACRED_GOLD, 0.3)
      case 'active':
        return alpha(SACRED_GOLD, 0.5)
      case 'error':
        return 'rgba(255, 107, 107, 0.3)'
      default:
        return 'rgba(0, 0, 0, 0.6)'
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
            backgroundColor: alpha(SACRED_GOLD, 0.1),
            border: `1px solid ${alpha(SACRED_GOLD, 0.3)}`,
          }}
        >
          <div
            style={{
              color: SACRED_GOLD,
              fontWeight: 600,
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontFamily: '"Cinzel", serif',
            }}
          >
            All steps completed!
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {finalActions}
            {onReset && <CustomButton text="Start Over" onClick={onReset} />}
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
            <CustomButton text="← Back" onClick={onBack} />
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {stepActions && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {stepActions}
            </div>
          )}
          {onNext && (
            <CustomButton
              text={isLastStep ? 'Finish' : 'Continue'}
              onClick={onNext}
            />
          )}
        </div>
      </div>
    )
  }

  const containerStyle: React.CSSProperties = {
    width: '100%',
    position: 'relative',
  }

  const stepperContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: orientation === 'vertical' ? '1rem' : '0',
    alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
  }

  return (
    <div style={containerStyle}>
      <div style={stepperContainerStyle}>
        {steps.map((step, index) => {
          const status = getStepStatus(step, index)
          const isClickable = isStepClickable(step, index)
          const isHovered = hoveredStep === step.stepNumber

          const stepContainerStyle: React.CSSProperties = {
            flex: orientation === 'horizontal' ? 1 : 'none',
            width: orientation === 'vertical' ? '100%' : 'auto',
            display: 'flex',
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            alignItems: 'center',
            gap: '0.5rem',
          }

          const stepContentStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }

          const iconContainerStyle: React.CSSProperties = {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getIconContainerColor(status),
            border: `2px solid ${alpha(SACRED_GOLD, status === 'active' ? 0.6 : 0.3)}`,
            transition: 'all 0.3s ease',
          }

          const stepButtonStyle: React.CSSProperties = {
            background: 'none',
            border: 'none',
            color: isClickable
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(255, 255, 255, 0.4)',
            fontSize: '14px',
            fontFamily: '"Cinzel", serif',
            cursor: isClickable ? 'pointer' : 'not-allowed',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'all 0.3s ease',
            backgroundColor:
              isHovered && isClickable
                ? alpha(SACRED_GOLD, 0.2)
                : 'transparent',
            textDecoration: isHovered && isClickable ? 'underline' : 'none',
          }

          const connectorStyle: React.CSSProperties = {
            flex: 1,
            height: '2px',
            backgroundColor: alpha(SACRED_GOLD, 0.3),
            margin: '0 8px',
          }

          const verticalConnectorStyle: React.CSSProperties = {
            width: '2px',
            height: '30px',
            backgroundColor: alpha(SACRED_GOLD, 0.3),
            marginLeft: '20px',
          }

          return (
            <div key={step.label} style={stepContainerStyle}>
              <div style={stepContentStyle}>
                <div style={iconContainerStyle}>
                  {getStepIcon(status, step)}
                </div>

                <button
                  onClick={() => handleStepClick(step, index)}
                  disabled={!isClickable}
                  style={stepButtonStyle}
                  onMouseEnter={() => setHoveredStep(step.stepNumber)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {step.label}
                </button>
              </div>

              {index < steps.length - 1 && orientation === 'horizontal' && (
                <div style={connectorStyle} />
              )}

              {index < steps.length - 1 && orientation === 'vertical' && (
                <div style={verticalConnectorStyle} />
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

Stepper.displayName = 'Stepper'

export default Stepper
