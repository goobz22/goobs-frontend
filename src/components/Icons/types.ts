// Public styling contract shared by every goobs Icon component. Relocated from
// the old src/theme/icon.ts (removed in the css-modules-theme-removal teardown).
// The icons are fully driven by icon.module.css now; the runtime theme helpers
// (getIconTheme / getIconStyles / injectSacredKeyframes) were dropped during the
// CSS-module migration. Only this caller-facing override type survives, with its
// shape preserved verbatim so existing callers keep compiling.
export interface IconStyles {
  /** Theme selection: light, dark, or sacred */
  theme?: 'light' | 'dark' | 'sacred'
  /** Whether the icon is disabled */
  disabled?: boolean
  /** Custom icon size */
  size?: number
  /** Custom icon color */
  color?: string
  /** Custom background color */
  backgroundColor?: string
  /** Custom hover background color */
  hoverBackgroundColor?: string
  /** Custom border radius */
  borderRadius?: string
  /** Custom padding */
  padding?: string
  /** Custom margin */
  margin?: string
  /** Custom filter effects */
  filter?: string
  /** Custom transform effects */
  transform?: string
  /** Custom hover transform effects */
  hoverTransform?: string
  /** Custom transition duration */
  transitionDuration?: string
  /** Custom box shadow */
  boxShadow?: string
  /** Custom hover box shadow */
  hoverBoxShadow?: string
}
