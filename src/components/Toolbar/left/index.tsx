// src/components/Toolbar/Left/index.tsx

'use client'

import React, { FC } from 'react'
import CustomButton, { CustomButtonProps } from '../../Button'

const premiumStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
  } as React.CSSProperties,
  divider: {
    height: '20px',
    borderLeft: '2px solid black',
  } as React.CSSProperties,
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 16px',
  } as React.CSSProperties,
}

const sacredStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
  } as React.CSSProperties,
  divider: {
    height: '20px',
    borderLeft: '2px solid rgba(255, 215, 0, 0.6)',
    filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
  } as React.CSSProperties,
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 16px',
  } as React.CSSProperties,
}

/** A simple vertical divider */
const VerticalDivider: FC<{ sacredtheme?: boolean }> = ({ sacredtheme }) => {
  const styles = sacredtheme ? sacredStyles : premiumStyles
  return <div style={styles.divider} />
}

export interface LeftProps {
  /** Array of button configs to render on the left side */
  buttons?: CustomButtonProps[]
  sacredtheme?: boolean
}

const Left: FC<LeftProps> = ({ buttons, sacredtheme }) => {
  const buttonHeight = '45px'
  const styles = sacredtheme ? sacredStyles : premiumStyles

  return (
    <div style={styles.container}>
      {/* Vertical Divider */}
      <div style={styles.dividerContainer}>
        <VerticalDivider sacredtheme={sacredtheme} />
      </div>

      {/* Buttons */}
      <div style={styles.buttonsContainer}>
        {buttons?.map((btn, i) => {
          const isDisabled = !!btn.disabled
          return (
            <CustomButton
              key={i}
              text={btn.text}
              onClick={btn.onClick}
              disabled={isDisabled}
              disableButton={isDisabled ? 'true' : 'false'}
              fontcolor={sacredtheme ? '#000000' : 'white'}
              backgroundcolor={
                isDisabled
                  ? sacredtheme
                    ? 'rgba(255, 215, 0, 0.3)'
                    : '#9E9E9E'
                  : sacredtheme
                    ? '#FFD700'
                    : 'black'
              }
              height={buttonHeight}
              sacredtheme={sacredtheme}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Left
