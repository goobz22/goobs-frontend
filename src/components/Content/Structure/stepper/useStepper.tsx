'use client'
import React from 'react'
import Stepper, { type StepperProps } from '../../../Stepper'

const useStepper = (props: {
  stepper?: StepperProps | StepperProps[]
}): React.ReactElement[] | null => {
  if (!props.stepper) return null

  const renderStepper = (
    stepperProps: StepperProps,
    index: number
  ): React.ReactElement => {
    return <Stepper key={`stepper-${index}`} {...stepperProps} />
  }

  if (Array.isArray(props.stepper)) {
    return props.stepper.map((item, index) => renderStepper(item, index))
  } else {
    return [renderStepper(props.stepper, 0)]
  }
}

export default useStepper
