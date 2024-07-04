import React from 'react'
import { styled } from '@mui/material/styles'
import MuiStepper, { StepperProps } from '@mui/material/Stepper'
import MuiStep, { StepProps } from '@mui/material/Step'
import MuiStepLabel, { StepLabelProps } from '@mui/material/StepLabel'
import CustomButton from '../Button'
import StepConnector from '@mui/material/StepConnector'
import { Check, CircleOutlined, LockOutlined } from '@mui/icons-material'

// Styled components for Stepper, Step, and StepLabel
const StyledStepper = styled((props: StepperProps) => (
  <MuiStepper {...props} />
))({})

const Step = styled((props: StepProps) => <MuiStep {...props} />)({})

const StepLabel = styled((props: StepLabelProps) => (
  <MuiStepLabel
    {...props}
    StepIconComponent={props.StepIconComponent}
    sx={{
      '.MuiStepLabel-labelContainer': {
        display: 'flex',
        alignItems: 'center',
        '.MuiStepLabel-label': {
          marginLeft: '15px',
        },
      },
    }}
  />
))({})

/**
 * Interface for the props of the CustomStepper component
 */
export interface CustomStepperProps extends StepperProps {
  steps: {
    stepNumber: number
    label: string
    stepLink: string
    status: 'completed' | 'active' | 'error' | 'inactive'
    statusLink?: string
  }[]
  activeStep: number
}

/**
 * CustomStepper component renders a customized stepper with clickable steps
 * @param {CustomStepperProps} props - The props for the CustomStepper component
 * @returns {JSX.Element} The rendered CustomStepper component
 */
const CustomStepper: React.FC<CustomStepperProps> = ({
  steps,
  activeStep,
  ...rest
}) => {
  /**
   * Get the appropriate icon for each step based on its status
   * @param {string} status - The status of the step
   * @returns {JSX.Element} The icon component for the step
   */
  const getStepIcon = (
    status: 'completed' | 'active' | 'error' | 'inactive'
  ) => {
    switch (status) {
      case 'completed':
        return <Check />
      case 'error':
        return <CircleOutlined color="error" />
      case 'inactive':
        return <LockOutlined />
      default:
        return <CircleOutlined />
    }
  }

  /**
   * Get the appropriate link for each step
   * @param {Object} step - The step object
   * @returns {string} The link for the step
   */
  const getStepLink = (step: CustomStepperProps['steps'][0]) => {
    if (step.statusLink) {
      return step.statusLink
    }
    return step.stepLink
  }

  /**
   * Determine if a step is clickable
   * @param {Object} step - The step object
   * @returns {boolean} Whether the step is clickable
   */
  const isStepClickable = (step: CustomStepperProps['steps'][0]) => {
    return step.status !== 'inactive'
  }

  return (
    <StyledStepper {...rest} connector={<StepConnector />}>
      {steps.map(step => (
        <Step key={step.label} active={step.stepNumber === activeStep}>
          <StepLabel StepIconComponent={() => getStepIcon(step.status)}>
            <CustomButton
              text={step.label}
              variant="text"
              fontcolor="black"
              fontlocation="left"
              href={isStepClickable(step) ? getStepLink(step) : undefined}
              sx={{
                padding: 0,
                minWidth: 0,
                justifyContent: 'flex-start',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            />
          </StepLabel>
        </Step>
      ))}
    </StyledStepper>
  )
}

export { CustomStepper, Step, StepLabel }
