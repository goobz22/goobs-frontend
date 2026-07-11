'use client'

import React from 'react'
import type { FormFieldStyles } from '../Field/Shell/types'
import cssStyles from './MenuItem.module.css'
import { emitDiag } from '../../utils/diag'

/**
 * Styling contract for the `styles` prop. dense / divider / selected live as
 * TOP-LEVEL MenuItemProps (wired to data-attributes in the render);
 * MenuItemStyles carries only the FormFieldStyles theming surface.
 */
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
  /**
   * Forwarded ref to the rendered `<option>` element (React 19 ref-as-prop) so
   * consumers can scroll it into view or measure it within its parent
   * `<Select>`. The `<option>` IS the leaf this component renders.
   */
  ref?: React.Ref<HTMLOptionElement>
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
  ref,
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
      ref={ref}
      className={mergeClassNames(cssStyles.root, className)}
      data-component="MenuItem"
      data-theme={theme}
      data-action={action}
      data-subject={subject}
      data-dense={dense ? 'true' : undefined}
      data-divider={divider ? 'true' : undefined}
      data-selected={selected ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      // NO author `aria-selected` here — deliberate (WCAG 4.1.2 / 1.4.1, "first
      // rule of ARIA"). This `<option>` is always rendered inside the parent
      // Select's native `<select value>` (Select/index.tsx). The browser maps
      // that native `value` selection to the accessibility tree and announces
      // the truly-selected option to assistive tech WITHOUT any author ARIA —
      // native selection is the single source of the programmatic selected
      // state, so re-declaring it would be redundant. Crucially, the `selected`
      // PROP is only a VISUAL highlight (drives `data-selected` + the tinted
      // CSS) and is NOT guaranteed to equal the select's real `value`: MenuItem
      // cannot see the parent value, so it cannot know whether `selected` is
      // actually the selected option. Emitting `aria-selected="true"` off the
      // decoupled prop would therefore FALSELY announce a second "selected"
      // option whenever `selected` diverges from `value` (double/conflicting
      // announcement) — a defect worse than the color-only gap it aimed to fix.
      // A caller who owns the value↔selected alignment can still pass their own
      // `aria-selected` via {...props}.
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
