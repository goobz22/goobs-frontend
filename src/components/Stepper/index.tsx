'use client'

import React, { JSX } from 'react'
import { styled } from '@mui/material/styles'
import MuiStepper, { StepperProps } from '@mui/material/Stepper'
import MuiStep, { StepProps } from '@mui/material/Step'
import MuiStepLabel, { StepLabelProps } from '@mui/material/StepLabel'
import CustomButton from '../Button'
import StepConnector from '@mui/material/StepConnector'
import {
  Check,
  CircleOutlined,
  LockOutlined,
  InfoOutlined,
} from '@mui/icons-material'
import {
  Box,
  Tooltip,
  IconButton,
  tooltipClasses,
  TooltipProps,
} from '@mui/material'

const StyledStepper = styled((props: StepperProps) => (
  <MuiStepper {...props} />
))({})

const Step = styled((props: StepProps) => <MuiStep {...props} />)({})

const StepLabel = styled((props: StepLabelProps) => (
  <MuiStepLabel
    {...props}
    slots={{ stepIcon: props.slots?.stepIcon }}
    sx={{
      '.MuiStepLabel-labelContainer': {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        '.MuiStepLabel-label': {
          marginLeft: '15px',
          flex: 1,
        },
      },
    }}
  />
))({})

const BlackTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: 14,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'black',
  },
})

type CustomStepperProps = Omit<StepperProps, 'children'> & {
  steps: {
    stepNumber: number
    label: string
    stepLink: string
    status: 'completed' | 'active' | 'error' | 'inactive'
    statusLink?: string
    description?: string
  }[]
  activeStep: number
}

function CustomStepper({
  steps,
  activeStep,
  ...rest
}: CustomStepperProps): JSX.Element {
  const getStepIcon = (
    status: 'completed' | 'active' | 'error' | 'inactive'
  ): JSX.Element => {
    switch (status) {
      case 'completed':
        return <Check sx={{ color: 'black' }} />
      case 'error':
        return <CircleOutlined sx={{ color: 'black' }} />
      case 'inactive':
        return <LockOutlined sx={{ color: 'black' }} />
      default:
        return <CircleOutlined sx={{ color: 'black' }} />
    }
  }

  const getStepLink = (step: CustomStepperProps['steps'][0]): string => {
    if (step.statusLink) {
      return step.statusLink
    }
    return step.stepLink
  }

  const isStepClickable = (step: CustomStepperProps['steps'][0]): boolean => {
    return step.status !== 'inactive'
  }

  return (
    <StyledStepper {...rest} connector={<StepConnector />}>
      {steps.map(step => (
        <Step key={step.label} active={step.stepNumber === activeStep}>
          <StepLabel slots={{ stepIcon: () => getStepIcon(step.status) }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: 1,
              }}
            >
              <CustomButton
                text={step.label}
                variant="text"
                fontcolor="black"
                fontlocation="left"
                href={isStepClickable(step) ? getStepLink(step) : undefined}
                sx={{
                  padding: 0,
                  minWidth: 0,
                  flex: 1,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              />
              {step.description && (
                <BlackTooltip title={step.description} arrow placement="right">
                  <IconButton
                    size="small"
                    sx={{
                      padding: 0,
                      color: 'black',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </BlackTooltip>
              )}
            </Box>
          </StepLabel>
        </Step>
      ))}
    </StyledStepper>
  )
}

CustomStepper.displayName = 'CustomStepper'

export { CustomStepper }
export type { CustomStepperProps }
