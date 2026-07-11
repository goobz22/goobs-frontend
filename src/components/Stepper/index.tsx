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
  /**
   * Forwarded ref to the root `<div>` (React 19 ref-as-prop). A Stepper renders
   * a LIST of step `<button>`/`<a>` controls plus the wizard Back/Continue
   * controls, so there is no single "the button" — the root is the meaningful
   * consumer handle (scroll the stepper into view, measure it, or query its
   * step controls). Individual steps stay reachable via `data-action="goto-step"`.
   */
  ref?: React.Ref<HTMLDivElement>
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
  ref,
}) => {
  const orientation = styles?.orientation || 'horizontal'
  const theme = styles?.theme || 'sacred'
  const isWizardMode = mode === 'wizard'

  // Stable id base for wiring each step's secondary `description` to its
  // control via aria-describedby (SSR-safe; unique per Stepper instance).
  const baseId = React.useId()

  // Screen-reader-only status word for each step. A step's status is otherwise
  // conveyed only by the (decorative, aria-hidden) status icon plus colour, so
  // without this a non-sighted user cannot tell a completed step from a locked
  // or errored one (WCAG 1.1.1 / 1.3.1 / 1.4.1 — never colour/icon alone). The
  // 'active' status is intentionally omitted because aria-current="step" on the
  // control already announces "current step".
  const getStatusLabel = (
    status: 'completed' | 'active' | 'error' | 'inactive'
  ): string | undefined => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'error':
        return 'Error'
      case 'inactive':
        return 'Locked'
      default:
        return undefined
    }
  }

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
    //
    // Navigation-mode reachable steps now render as real <a href> anchors and
    // navigate natively (crawlable, keyboard-operable, open-in-new-tab), so no
    // JS window.location assignment happens here anymore. Wizard-mode step
    // buttons are inert beyond this diagnostic beacon.
    if (isStepClickable(step, index)) {
      emitDiag({
        type: 'nav.change',
        component: 'Stepper',
        to: String(index),
      })
    }
  }

  const renderWizardContent = () => {
    if (!isWizardMode) return null
    const currentStep = steps[activeStep]
    if (!currentStep) return null

    return <div className={cssStyles.wizardContent}>{currentStep.content}</div>
  }

  // The built-in Back/Continue/Finish/Start Over controls thread the
  // Stepper's own theme into Button. Without it Button falls back to its
  // sacred default (near-white text over a translucent-black control bg),
  // which fails WCAG contrast when a light/dark-themed wizard sits on a
  // light surface (rgba(255,255,255,0.9) over rgba(0,0,0,0.4) on white
  // computes to #f5f5f5 on #999999 — 2.61:1).
  const renderWizardNavigation = () => {
    if (!isWizardMode) return null

    const isFirstStep = activeStep === 0
    const isLastStep = activeStep === steps.length - 1
    const isCompleted = activeStep >= steps.length

    if (isCompleted && finalActions) {
      return (
        <div className={cssStyles.wizardCompleted}>
          {/* Visible completion heading for sighted users. The screen-reader
              ANNOUNCEMENT is made separately, by the persistent initially-empty
              role="status" live region declared once at the component root (see
              the main return): populating an already-present live region is
              announced reliably, whereas a role="status" node inserted already
              containing its text is dropped by some assistive tech. This
              heading therefore carries NO role, so the completion message is
              announced exactly once (WCAG 4.1.3 Status Messages). */}
          <div className={cssStyles.wizardCompletedTitle}>
            All steps completed!
          </div>
          <div className={cssStyles.wizardCompletedActions}>
            {finalActions}
            {onReset && (
              <CustomButton
                text="Start Over"
                onClick={onReset}
                action="reset"
                styles={{ theme }}
              />
            )}
          </div>
        </div>
      )
    }

    return (
      <div className={cssStyles.wizardNavigation}>
        <div>
          {!isFirstStep && onBack && (
            <CustomButton
              text="← Back"
              onClick={onBack}
              action="back"
              styles={{ theme }}
            />
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
              action="next"
              styles={{ theme }}
            />
          )}
        </div>
      </div>
    )
  }

  // The steps render as a real ordered list (WCAG 1.3.1) so assistive tech
  // announces "list, N items" / "step X of N". In navigation mode a
  // <nav aria-label="Progress"> landmark wraps it (the steps are genuine
  // links); in wizard mode there is no navigation landmark, so the <ol> names
  // itself.
  //
  // role="list" is set EXPLICITLY even though <ol> carries that role
  // implicitly: .stepperContainer applies `list-style: none` (required for the
  // flex row/column layout), and WebKit strips the implicit list role from any
  // list whose computed list-style is `none`. On Safari + VoiceOver (the
  // default AT stack on macOS/iOS) the "list, N items" / "step X of N"
  // announcement would otherwise silently disappear. The explicit role
  // restores it. (See Scott O'Hara, "Fixing lists".)
  const stepList = (
    <ol
      className={cssStyles.stepperContainer}
      role="list"
      data-orientation={orientation}
      aria-label={isWizardMode ? 'Progress' : undefined}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(step, index)
        const isClickable = isStepClickable(step, index)
        const isCurrent = status === 'active'
        const statusLabel = getStatusLabel(status)
        const descriptionId = step.description
          ? `${baseId}-step-${index}-description`
          : undefined

        // Visually-hidden status word appended to the control's accessible
        // name (leading comma → "Personal Info, Completed").
        const statusNode = statusLabel ? (
          <span className={cssStyles.srOnly}>{`, ${statusLabel}`}</span>
        ) : null

        const labelContent = (
          <>
            {step.label}
            {statusNode}
          </>
        )

        // Navigation-mode reachable steps are real anchors (crawlable, native
        // keyboard/focus, open-in-new-tab). Everything else — locked navigation
        // steps and every wizard step — stays a native <button> (disabled when
        // not reachable) that fires the click handler / diagnostic beacon.
        // Both carry data-action="goto-step" and aria-current for the machine
        // selector + assistive-tech contract.
        const stepControl =
          !isWizardMode && isClickable ? (
            <a
              href={getStepLink(step)}
              className={cssStyles.stepButton}
              data-action="goto-step"
              aria-current={isCurrent ? 'step' : undefined}
              aria-describedby={descriptionId}
              onClick={() => handleStepClick(step, index)}
            >
              {labelContent}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => handleStepClick(step, index)}
              disabled={!isClickable}
              data-action="goto-step"
              className={cssStyles.stepButton}
              aria-current={isCurrent ? 'step' : undefined}
              aria-describedby={descriptionId}
            >
              {labelContent}
            </button>
          )

        return (
          <li
            key={step.label}
            className={cssStyles.stepContainer}
            data-orientation={orientation}
          >
            <div className={cssStyles.stepContent}>
              <div className={cssStyles.iconContainer} data-status={status}>
                {getStepIcon(status, step)}
              </div>

              <div className={cssStyles.stepText}>
                {stepControl}
                {step.description && (
                  <div
                    id={descriptionId}
                    className={cssStyles.stepDescription}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Purely decorative connector line — hidden from assistive tech. */}
            {index < steps.length - 1 && orientation === 'horizontal' && (
              <div className={cssStyles.connector} aria-hidden="true" />
            )}

            {index < steps.length - 1 && orientation === 'vertical' && (
              <div className={cssStyles.verticalConnector} aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )

  return (
    <div
      ref={ref}
      className={cssStyles.root}
      data-component="Stepper"
      data-theme={theme}
      style={dynamicStyle}
    >
      {isWizardMode ? stepList : <nav aria-label="Progress">{stepList}</nav>}

      {renderWizardContent()}
      {renderWizardNavigation()}

      {/* Persistent, initially-EMPTY polite live region for the wizard-
          completion announcement (WCAG 4.1.3). It is mounted for the whole life
          of a wizard-mode Stepper and only its text content changes when the
          wizard finishes: assistive tech announces text inserted into an
          already-present role="status" reliably, but may drop a role="status"
          node that is inserted already populated. The visible heading in the
          completion pane carries no role, so the message is announced once. */}
      {isWizardMode && (
        <div className={cssStyles.srOnly} role="status">
          {activeStep >= steps.length && finalActions
            ? 'All steps completed!'
            : ''}
        </div>
      )}
    </div>
  )
}

Stepper.displayName = 'Stepper'

export default Stepper
