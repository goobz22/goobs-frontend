import React from 'react'
import {
  CustomStepper,
  Step,
  StepLabel,
} from './../../../../components/Stepper'
import { columnconfig, cellconfig } from '../../../Grid'
import { CustomStepperProps as BaseCustomStepperProps } from './../../../../components/Stepper'

type ExtendedColumnConfig = Omit<columnconfig, 'component'> & {
  component?: columnconfig['component']
}

export interface ExtendedStepperProps
  extends Omit<BaseCustomStepperProps, 'columnconfig'> {
  cellconfig?: cellconfig
  columnconfig?: ExtendedColumnConfig
}

const useStepper = (grid: {
  stepper?: ExtendedStepperProps | ExtendedStepperProps[]
}): columnconfig | columnconfig[] | null => {
  if (!grid.stepper) return null

  const renderStepper = (
    stepperProps: ExtendedStepperProps,
    index: number
  ): columnconfig => {
    const {
      steps,
      columnconfig: itemColumnConfig,
      cellconfig,
      ...restProps
    } = stepperProps

    if (
      !itemColumnConfig ||
      typeof itemColumnConfig !== 'object' ||
      typeof itemColumnConfig.row !== 'number' ||
      typeof itemColumnConfig.column !== 'number'
    ) {
      throw new Error(
        'columnconfig must be an object with row and column as numbers'
      )
    }

    const mergedConfig: columnconfig = {
      ...itemColumnConfig,
      cellconfig: {
        ...cellconfig,
      },
      component: (
        <CustomStepper key={`stepper-${index}`} steps={steps} {...restProps}>
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
    return grid.stepper.map((stepper, index) => renderStepper(stepper, index))
  } else {
    return renderStepper(grid.stepper, 0)
  }
}

export default useStepper
