// src/components/Toolbar/Left/index.tsx

'use client'

import React from 'react'
import type { FC } from 'react'
import CustomButton, { ButtonProps } from '../../Button'
import type { ToolbarStyles } from '../../../theme'

const getStyles = (styles?: ToolbarStyles) => {
  const isSacredTheme = styles?.theme === 'sacred'
  const isDarkTheme = styles?.theme === 'dark'

  return {
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
      borderLeft: isSacredTheme
        ? '2px solid rgba(255, 215, 0, 0.6)'
        : isDarkTheme
          ? '2px solid rgba(156, 163, 175, 0.6)'
          : '2px solid rgba(0, 0, 0, 0.6)',
      ...(isSacredTheme && {
        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
      }),
    } as React.CSSProperties,
    buttonsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '0 16px',
    } as React.CSSProperties,
  }
}

/** A simple vertical divider */
const VerticalDivider: FC<{ styles?: ToolbarStyles }> = ({ styles }) => {
  const computedStyles = getStyles(styles)
  return <div style={computedStyles.divider} />
}

export interface LeftProps {
  /** Array of button configs to render on the left side */
  buttons?: ButtonProps[]
  styles?: ToolbarStyles
}

const Left: FC<LeftProps> = ({ buttons, styles }) => {
  const computedStyles = getStyles(styles)

  return (
    <div style={computedStyles.container}>
      {/* Vertical Divider */}
      <div style={computedStyles.dividerContainer}>
        <VerticalDivider {...(styles ? { styles } : {})} />
      </div>

      {/* Buttons */}
      <div style={computedStyles.buttonsContainer}>
        {buttons?.map((btn, i) => {
          const isDisabled = !!btn.disabled
          return (
            <CustomButton
              key={i}
              {...(btn.text ? { text: btn.text } : {})}
              onClick={btn.onClick}
              disabled={isDisabled}
              {...(styles?.theme ? { styles: { theme: styles.theme } } : {})}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Left
