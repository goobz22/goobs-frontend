'use client'
import React from 'react'
import { CustomStepper, CustomStepperProps } from '../../../Stepper'

const useStepper = (props: {
  stepper?: CustomStepperProps | CustomStepperProps[]
}): React.ReactElement[] | null => {
  if (!props.stepper) return null

  const renderStepper = (
    stepperProps: CustomStepperProps,
    index: number
  ): React.ReactElement => {
    return <CustomStepper key={`stepper-${index}`} {...stepperProps} />
  }

  if (Array.isArray(props.stepper)) {
    return props.stepper.map((item, index) => renderStepper(item, index))
  } else {
    return [renderStepper(props.stepper, 0)]
  }
}

export default useStepper
