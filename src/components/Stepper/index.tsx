'use client'

import React, { JSX } from 'react'
import { styled, keyframes, alpha } from '@mui/material/styles'
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

// Sacred theming animations
const glowPulse = keyframes`
  0% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); }
  100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`

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

const SacredTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#FFD700',
    color: '#000000',
    fontSize: 14,
    fontWeight: 500,
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#FFD700',
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
  sacredTheme?: boolean
}

function CustomStepper({
  steps,
  activeStep,
  sacredTheme,
  ...rest
}: CustomStepperProps): JSX.Element {
  const getStepIcon = (
    status: 'completed' | 'active' | 'error' | 'inactive'
  ): JSX.Element => {
    const iconColor = sacredTheme ? '#FFD700' : 'black'
    const iconStyle = sacredTheme
      ? {
          animation: `${glowPulse} 2s ease-in-out infinite`,
        }
      : undefined

    switch (status) {
      case 'completed':
        return <Check sx={{ color: iconColor, ...iconStyle }} />
      case 'error':
        return <CircleOutlined sx={{ color: iconColor, ...iconStyle }} />
      case 'inactive':
        return (
          <LockOutlined
            sx={{
              color: sacredTheme ? alpha('#FFD700', 0.5) : 'black',
              ...(sacredTheme && {
                filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))',
              }),
            }}
          />
        )
      default:
        return <CircleOutlined sx={{ color: iconColor, ...iconStyle }} />
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

  const TooltipComponent = sacredTheme ? SacredTooltip : BlackTooltip

  return (
    <Box
      sx={
        sacredTheme
          ? {
              position: 'relative',
              padding: 2,
              backgroundColor: alpha('#000000', 0.8),
              borderRadius: 2,
              border: `1px solid ${alpha('#FFD700', 0.3)}`,
              backgroundImage: `
        linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),
        radial-gradient(circle at top left, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
      `,
              '&::before': {
                content: '"𓊻"',
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '20px',
                color: alpha('#FFD700', 0.2),
                animation: `rotate 25s linear infinite`,
              },
            }
          : undefined
      }
    >
      <StyledStepper
        {...rest}
        connector={
          <StepConnector
            sx={
              sacredTheme
                ? {
                    '& .MuiStepConnector-line': {
                      borderColor: alpha('#FFD700', 0.3),
                      borderWidth: 2,
                    },
                  }
                : undefined
            }
          />
        }
      >
        {steps.map(step => (
          <Step key={step.label} active={step.stepNumber === activeStep}>
            <StepLabel
              slots={{ stepIcon: () => getStepIcon(step.status) }}
              sx={
                sacredTheme
                  ? {
                      '& .MuiStepLabel-label': {
                        color: alpha('#FFD700', 0.9),
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#FFD700',
                          textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                        },
                      },
                    }
                  : undefined
              }
            >
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
                  fontcolor={sacredTheme ? '#FFD700' : 'black'}
                  fontlocation="left"
                  href={isStepClickable(step) ? getStepLink(step) : undefined}
                  sacredTheme={sacredTheme}
                  sx={{
                    padding: 0,
                    minWidth: 0,
                    flex: 1,
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: sacredTheme
                        ? alpha('#FFD700', 0.1)
                        : 'transparent',
                    },
                  }}
                />
                {step.description && (
                  <TooltipComponent
                    title={step.description}
                    arrow
                    placement="right"
                  >
                    <IconButton
                      size="small"
                      sx={{
                        padding: 0,
                        color: sacredTheme ? '#FFD700' : 'black',
                        '&:hover': {
                          backgroundColor: sacredTheme
                            ? alpha('#FFD700', 0.1)
                            : 'transparent',
                        },
                        ...(sacredTheme && {
                          animation: `${floatAnimation} 2s ease-in-out infinite`,
                        }),
                      }}
                    >
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </TooltipComponent>
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </StyledStepper>
    </Box>
  )
}

CustomStepper.displayName = 'CustomStepper'

export { CustomStepper }
export type { CustomStepperProps }
