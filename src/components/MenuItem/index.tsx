'use client'

import React from 'react'
import type { FormFieldStyles } from '../../theme'
import cssStyles from './MenuItem.module.css'

export interface MenuItemStyles extends FormFieldStyles {
  dense?: boolean
  divider?: boolean
  selected?: boolean
}

export interface MenuItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children?: React.ReactNode
  styles?: MenuItemStyles
  dense?: boolean
  divider?: boolean
  disabled?: boolean
  selected?: boolean
}

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  styles,
  dense = false,
  divider = false,
  disabled = false,
  selected = false,
  style = {},
  className,
  ...props
}) => {
  const theme = styles?.theme || 'sacred'

  // Caller-supplied color/font overrides flow through CSS custom properties
  // so getFormFieldTheme's per-style override behaviour is preserved without
  // a JS theme computation. Only set a var when the caller actually provided
  // a value, so the theme default in the CSS module otherwise wins.
  const dynamicStyle: React.CSSProperties = {
    ...style,
    ...(styles?.backgroundColor && {
      ['--menuitem-bg' as string]: styles.backgroundColor,
    }),
    ...(styles?.textColor && {
      ['--menuitem-text' as string]: styles.textColor,
    }),
    ...(styles?.fontFamily && {
      ['--menuitem-font-family' as string]: styles.fontFamily,
    }),
  }

  return (
    <option
      className={mergeClassNames(cssStyles.root, className)}
      data-theme={theme}
      data-dense={dense ? 'true' : undefined}
      data-divider={divider ? 'true' : undefined}
      data-selected={selected ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      style={dynamicStyle}
      disabled={disabled}
      {...props}
    >
      {children}
    </option>
  )
}

export default MenuItem
