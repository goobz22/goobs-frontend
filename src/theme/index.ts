// --------------------------------------------------------------------------
// RESIDUAL THEME BARREL
// --------------------------------------------------------------------------
//
// The old JS theme system (per-component `get<X>Styles` / `<x>Themes` modules
// + shared KEYFRAMES/SHADOWS/TRANSITIONS) was removed in the
// css-modules-theme-removal teardown — every component and icon now styles
// itself via a co-located CSS module, and the shared keyframes / shadow /
// transition tokens live as static CSS in `src/styles/global.css`.
//
// The ONLY survivor is the Table theme: `components/Table` has not been
// migrated to a CSS module yet and still calls `getTableStyles()` at runtime.
// This barrel exists solely so that `components/Table/index.tsx` (which imports
// `{ getTableStyles, type TableStyles }` from `../../theme`) keeps resolving.
// Delete `table.ts` and this file once Table is migrated to a CSS module.

export type { TableTheme, TableStyles } from './table'
export { tableThemes, getTableTheme, getTableStyles } from './table'
