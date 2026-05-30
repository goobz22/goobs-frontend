'use client'

import React from 'react'
import Check from '../Icons/Check'
import CircleOutline from '../Icons/CircleOutline'
import Lock from '../Icons/Lock'
import Error from '../Icons/Error'
import CustomButton from '../Button'
import cssStyles from './Stepper.module.css'
import { emitDiag } from '../../utils/diag'

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
  const orientation = styles?.orientation || 'horizontal'
  const theme = styles?.theme || 'sacred'
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

  // Icon size + colour are sourced from the data-theme-aware CSS custom
  // properties declared on the .root element. We pass them through the icon's
  // `style` prop (not className) because the underlying Icon components merge
  // their own inline `color: currentColor` AFTER any className, so an inline
  // style is the only reliable way to win the cascade on the <svg>.
  const iconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    color: 'var(--stepper-icon-color)',
  }
  const errorIconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    color: 'var(--stepper-icon-color-error)',
  }
  const inactiveIconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    color: 'var(--stepper-icon-color-inactive)',
  }

  const getStepIcon = (
    status: 'completed' | 'active' | 'error' | 'inactive',
    step: StepperProps['steps'][0]
  ) => {
    switch (status) {
      case 'completed':
        return <Check style={iconStyle} />
      case 'error':
        return <Error style={errorIconStyle} />
      case 'inactive':
        if (step.icon)
          return <div className={cssStyles.customIcon}>{step.icon}</div>
        return <Lock style={inactiveIconStyle} />
      default:
        if (step.icon)
          return <div className={cssStyles.customIcon}>{step.icon}</div>
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
    // Additive diagnostics: a clickable step click is a nav.change to that
    // step index. Non-clickable (locked / future) steps emit nothing.
    // emitDiag is a no-op without a host bus.
    if (isStepClickable(step, index)) {
      emitDiag({
        type: 'nav.change',
        component: 'Stepper',
        to: String(index),
      })
    }
    if (isWizardMode) {
      if (isStepClickable(step, index) && onNext && onBack) {
        return
      }
    } else if (isStepClickable(step, index)) {
      // Use location.assign() instead of direct href assignment to avoid lint error
      window.location.assign(getStepLink(step))
    }
  }

  const renderWizardContent = () => {
    if (!isWizardMode) return null
    const currentStep = steps[activeStep]
    if (!currentStep) return null

    return <div className={cssStyles.wizardContent}>{currentStep.content}</div>
  }

  const renderWizardNavigation = () => {
    if (!isWizardMode) return null

    const isFirstStep = activeStep === 0
    const isLastStep = activeStep === steps.length - 1
    const isCompleted = activeStep >= steps.length

    if (isCompleted && finalActions) {
      return (
        <div className={cssStyles.wizardCompleted}>
          <div className={cssStyles.wizardCompletedTitle}>
            All steps completed!
          </div>
          <div className={cssStyles.wizardCompletedActions}>
            {finalActions}
            {onReset && <CustomButton text="Start Over" onClick={onReset} />}
          </div>
        </div>
      )
    }

    return (
      <div className={cssStyles.wizardNavigation}>
        <div>
          {!isFirstStep && onBack && (
            <CustomButton text="← Back" onClick={onBack} />
          )}
        </div>

        <div className={cssStyles.wizardNavigationActions}>
          {stepActions && (
            <div className={cssStyles.wizardNavigationActions}>
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

  return (
    <div className={cssStyles.root} data-component="Stepper" data-theme={theme}>
      <div
        className={cssStyles.stepperContainer}
        data-orientation={orientation}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(step, index)
          const isClickable = isStepClickable(step, index)

          return (
            <div
              key={step.label}
              className={cssStyles.stepContainer}
              data-orientation={orientation}
            >
              <div className={cssStyles.stepContent}>
                <div
                  className={cssStyles.iconContainer}
                  data-status={status}
                >
                  {getStepIcon(status, step)}
                </div>

                <button
                  onClick={() => handleStepClick(step, index)}
                  disabled={!isClickable}
                  className={cssStyles.stepButton}
                >
                  {step.label}
                </button>
              </div>

              {index < steps.length - 1 && orientation === 'horizontal' && (
                <div className={cssStyles.connector} />
              )}

              {index < steps.length - 1 && orientation === 'vertical' && (
                <div className={cssStyles.verticalConnector} />
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
