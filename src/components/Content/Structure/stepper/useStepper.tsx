import React from 'react'
import {
  CustomStepper,
  Step,
  StepLabel,
} from './../../../../components/Stepper'
import { columnconfig, cellconfig } from '../../../Grid'
import { CustomStepperProps as BaseCustomStepperProps } from './../../../../components/Stepper'

export interface ExtendedStepperProps extends BaseCustomStepperProps {
  cellconfig?: cellconfig
  columnconfig?: columnconfig
}

const useStepper = (grid: {
  stepper?: ExtendedStepperProps | ExtendedStepperProps[]
}) => {
  if (!grid.stepper) return null

  const renderStepper = (stepperProps: ExtendedStepperProps): columnconfig => {
    const { steps, columnconfig, cellconfig, ...restProps } = stepperProps
    const mergedConfig = {
      ...columnconfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <CustomStepper steps={steps} {...restProps}>
          {steps.map(step => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </CustomStepper>
      ),
    }
    return mergedConfig
  }

  if (Array.isArray(grid.stepper)) {
    return grid.stepper.map(renderStepper)
  } else {
    return renderStepper(grid.stepper)
  }
}

export default useStepper
