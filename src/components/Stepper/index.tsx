'use client'

import React from 'react'
import Check from '../Icons/Check'
import CircleOutline from '../Icons/CircleOutline'
import Lock from '../Icons/Lock'
import Error from '../Icons/Error'
import CustomButton from '../Button'
import cssStyles from './Stepper.module.css'
import { emitDiag } from '../../utils/diag'

// Allows CSS custom properties alongside standard CSS properties. Caller
// overrides land here only when provided; the stylesheet default (the same
// value transcribed into Stepper.module.css) applies otherwise.
type DynamicStyle = React.CSSProperties & Record<string, string | undefined>

export interface StepperProps {
  /**
   * 'navigation' (default): each step carries its own status and clicking a
   * non-inactive step navigates to its link. 'wizard': statuses derive from
   * `activeStep`, and the active step's `content` plus Back/Continue/Finish
   * controls render below the indicator.
   */
  mode?: 'navigation' | 'wizard'
  /** The ordered steps to render. */
  steps: {
    /** Step title on the clickable step button; also the React key, so labels must be unique. */
    label: string
    /** Navigation-mode destination assigned on click ('#' fallback); `statusLink` wins when both are set. */
    stepLink?: string
    /**
     * Explicit status in navigation mode (default 'inactive'; inactive steps
     * are unclickable). Ignored in wizard mode, where status derives from
     * `activeStep`.
     */
    status?: 'completed' | 'active' | 'error' | 'inactive'
    /** Overrides `stepLink` as the navigation-mode click destination. */
    statusLink?: string
    /** Secondary text rendered under the step label. */
    description?: string
    /** Step body rendered below the indicator while this step is active (wizard mode only). */
    content?: React.ReactNode
    /**
     * Custom indicator icon, used for the 'active' and 'inactive' states in
     * place of the built-in circle/lock; 'completed' and 'error' always
     * render the built-in Check/Error icons.
     */
    icon?: React.ReactNode
  }[]
  /**
   * Wizard-mode current step index (default 0): earlier steps render
   * completed, later ones inactive. An index past the last step shows the
   * all-steps-completed pane when `finalActions` is provided.
   */
  activeStep?: number
  /** Wizard mode: renders the Continue (Finish on the last step) button and receives its clicks. */
  onNext?: () => void
  /** Wizard mode: renders the Back button (hidden on the first step) and receives its clicks. */
  onBack?: () => void
  /** Wizard mode: renders a "Start Over" button in the all-steps-completed pane. */
  onReset?: () => void
  /**
   * Wizard mode: actions shown in the all-steps-completed pane. The pane
   * renders only when this is provided AND `activeStep >= steps.length`.
   */
  finalActions?: React.ReactNode
  /** Wizard mode: extra nodes rendered beside the Continue/Finish button. */
  stepActions?: React.ReactNode
  /** Styling options; the spacing keys ride in as `--stepper-*` CSS custom properties. */
  styles?: {
    /** Step layout and connector direction: 'horizontal' (default) or 'vertical'. */
    orientation?: 'horizontal' | 'vertical'
    /** `data-theme` variant on the root: 'sacred' (default), 'light', or 'dark'. */
    theme?: string
    /** Gap between steps; overrides the stylesheet default. */
    gap?: string
    /** Root padding; overrides the stylesheet default. */
    padding?: string
    /** Root bottom margin; overrides the stylesheet default. */
    marginBottom?: string
  }
}

/**
 * Multi-step progress indicator supporting a link-based `navigation` mode and a
 * self-contained `wizard` mode (renders the active step's content plus
 * Back/Continue/Finish controls). Offers horizontal/vertical orientation,
 * per-step status icons and secondary `description` text, sacred/light/dark
 * theming, caller `gap`/`padding`/`marginBottom` spacing overrides, and emits
 * `nav.change` diagnostics.
 */
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

  // Caller-supplied spacing overrides → CSS custom properties (set only when
  // provided; the Stepper.module.css defaults apply otherwise).
  const dynamicStyle: DynamicStyle = {}
  if (styles?.gap) dynamicStyle['--stepper-gap'] = styles.gap
  if (styles?.padding) dynamicStyle['--stepper-padding'] = styles.padding
  if (styles?.marginBottom)
    dynamicStyle['--stepper-margin-bottom'] = styles.marginBottom

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
    <div
      className={cssStyles.root}
      data-component="Stepper"
      data-theme={theme}
      style={dynamicStyle}
    >
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
                <div className={cssStyles.iconContainer} data-status={status}>
                  {getStepIcon(status, step)}
                </div>

                <div className={cssStyles.stepText}>
                  <button
                    onClick={() => handleStepClick(step, index)}
                    disabled={!isClickable}
                    className={cssStyles.stepButton}
                  >
                    {step.label}
                  </button>
                  {step.description && (
                    <div className={cssStyles.stepDescription}>
                      {step.description}
                    </div>
                  )}
                </div>
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
