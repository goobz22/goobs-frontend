'use client'

import React from 'react'
import type { FormFieldStyles } from '../Field/Shell/types'
import cssStyles from './MenuItem.module.css'
import { emitDiag } from '../../utils/diag'

// dense / divider / selected live as TOP-LEVEL MenuItemProps (wired to
// data-attributes in the render); MenuItemStyles carries only the
// FormFieldStyles theming surface.
export type MenuItemStyles = FormFieldStyles

export interface MenuItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children?: React.ReactNode
  styles?: MenuItemStyles
  dense?: boolean
  divider?: boolean
  disabled?: boolean
  selected?: boolean
  /**
   * Action verb — emitted as `data-action="<verb>"` on the rendered
   * `<option>`. Defaults to `"select"` since activating a menu item is a
   * selection. Tests target via `[data-component="MenuItem"][data-action="select"]`.
   */
  action?: string
  /**
   * Entity / option noun the selection targets. Emitted as
   * `data-subject="<value>"` so multiple menus on one page disambiguate.
   */
  subject?: string
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
  action = 'select',
  subject,
  onClick,
  ...props
}) => {
  const theme = styles?.theme || 'sacred'

  // Additive diagnostics: emit on activation while still firing the
  // caller's own onClick. Selection of a menu item is an `action.invoke`.
  const handleClick = (event: React.MouseEvent<HTMLOptionElement>) => {
    if (!disabled) {
      emitDiag({
        type: 'action.invoke',
        action,
        ...(subject !== undefined && { subject }),
      })
    }
    if (onClick) {
      onClick(event)
    }
  }

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
      data-component="MenuItem"
      data-theme={theme}
      data-action={action}
      data-subject={subject}
      data-dense={dense ? 'true' : undefined}
      data-divider={divider ? 'true' : undefined}
      data-selected={selected ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      style={dynamicStyle}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </option>
  )
}

export default MenuItem
