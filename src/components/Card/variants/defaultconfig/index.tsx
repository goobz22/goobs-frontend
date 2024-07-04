import React from 'react'
import { Box, Paper, BoxProps, useMediaQuery, useTheme } from '@mui/material'
import Typography from '../../../../components/Typography'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import InfoIcon from '@mui/icons-material/Info'
import StyledTooltip from '../../../../components/Tooltip'
import CustomButton from '../../../../components/Button'
import Link from 'next/link'
import FavoriteIcon from '../../../../components/Icons/FavoriteIcon'
import {
  CustomStepper,
  CustomStepperProps,
} from '../../../../components/Stepper'

/**
 * Props for the DefaultCard component.
 * Extends BoxProps from Material-UI and includes additional custom properties.
 */
interface DefaultCardProps extends BoxProps {
  /** Title of the card */
  title?: string
  /** Whether to show an underline for the title */
  titleUnderline?: boolean
  /** Body text of the card */
  body?: string
  /** URL or path of the image to display */
  image?: string
  /** Position of the image in the card */
  imagePosition?: 'top' | 'left'
  /** Text for the parent breadcrumb */
  parentText?: string
  /** Link for the parent breadcrumb */
  parentLink?: string
  /** Text for the child breadcrumb */
  childText?: string
  /** Link for the child breadcrumb */
  childLink?: string
  /** Link for the grandchild breadcrumb */
  grandchildLink?: string
  /** Whether to enable the favorite feature */
  favoriteEnabled?: boolean
  /** Whether to show breadcrumbs */
  breadcrumbEnabled?: boolean
  /** Whether to enable links */
  linkEnabled?: boolean
  /** Width of the card */
  width?: string
  /** Height of the card */
  height?: string | number
  /** Whether to show a stepper */
  stepperEnabled?: boolean
  /** Active step in the stepper */
  stepperActiveStep?: number
  /** Steps configuration for the stepper */
  stepperSteps?: CustomStepperProps['steps']
}

/**
 * DefaultCard component renders a customizable card with various features such as
 * image, title, body text, breadcrumbs, favorite icon, and stepper.
 * It adapts its layout based on the screen size and provided props.
 */
const DefaultCard: React.FC<DefaultCardProps> = ({
  title,
  titleUnderline = true,
  body,
  image,
  imagePosition = 'top',
  parentText = 'Parent',
  parentLink = '/',
  childText = 'Child',
  childLink = '/',
  grandchildLink = '/',
  favoriteEnabled = false,
  breadcrumbEnabled = false,
  linkEnabled = false,
  width = '100%',
  height,
  stepperEnabled = false,
  stepperActiveStep = -1,
  stepperSteps = [],
  ...rest
}) => {
  const theme = useTheme()
  /** Determines if the current viewport is mobile size */
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Paper
      elevation={1}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection:
          imagePosition === 'left' ? 'row' : isMobile ? 'row' : 'column',
        justifyContent: isMobile ? 'space-between' : 'flex-start',
        alignItems: isMobile ? 'center' : 'stretch',
        border: '1px solid #e8e8e8',
        width: width,
        height: height,
        ...rest.sx,
      }}
    >
      {/* Render image if provided */}
      {image && (
        <Box
          // @ts-ignore
          sx={{
            width: imagePosition === 'left' ? '200px' : '100%',
            height: imagePosition === 'left' ? '100%' : '200px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0,
          }}
        />
      )}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Render title and favorite icon if title is provided */}
        {title && (
          <Box
            sx={{
              borderBottom: titleUnderline ? '1px solid #e8e8e8' : 'none',
              width: '100%',
              paddingLeft: '15px',
              paddingRight: '15px',
              paddingBottom: '10px',
              paddingTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography text={title} fontcolor="black" fontvariant="merrih5" />
            {favoriteEnabled && <FavoriteIcon />}
          </Box>
        )}
        {/* Render body text or info icon for mobile */}
        {body && (
          <Box sx={{ padding: isMobile ? '0 15px' : '16px 15px' }}>
            {!isMobile && (
              <Typography
                text={body}
                fontcolor="black"
                fontvariant="merriparagraph"
              />
            )}
            {isMobile && (
              <StyledTooltip
                title={body}
                placement="right"
                arrow
                tooltipcolor="black"
                tooltipplacement="right"
                offsetX={0}
                offsetY={0}
                disableHoverListener
              >
                <InfoIcon style={{ color: 'black', cursor: 'pointer' }} />
              </StyledTooltip>
            )}
          </Box>
        )}
        {/* Render stepper if enabled */}
        {stepperEnabled && (
          <Box sx={{ padding: '0px 15px' }}>
            <CustomStepper
              activeStep={stepperActiveStep}
              nonLinear
              orientation="vertical"
              steps={stepperSteps}
              sx={{
                '.MuiStepIcon-text': { display: 'none' },
                '.MuiStepConnector-line': { display: 'none' },
              }}
            />
          </Box>
        )}
        {/* Render breadcrumbs and link button */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '15px',
            paddingRight: '15px',
            paddingBottom: '10px',
            marginTop: 'auto',
          }}
        >
          <Box>
            {breadcrumbEnabled && (
              <>
                <Link href={parentLink} passHref>
                  <Typography
                    text={parentText}
                    fontcolor="black"
                    fontvariant="merriparagraph"
                  />
                </Link>
                <Typography
                  text=">"
                  fontcolor="black"
                  fontvariant="merriparagraph"
                />
                <Link href={childLink} passHref>
                  <Typography
                    text={childText}
                    fontcolor="black"
                    fontvariant="merriparagraph"
                  />
                </Link>
              </>
            )}
          </Box>
          <Box sx={{ paddingLeft: '10px' }}>
            {linkEnabled && (
              <Link href={grandchildLink} passHref>
                <CustomButton
                  icon={<ArrowForwardIosIcon />}
                  iconcolor="black"
                  iconsize="15px"
                  iconlocation="right"
                  backgroundcolor="none"
                  variant="text"
                />
              </Link>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default DefaultCard
