## SSR styling for goobs-frontend (no-flicker first paint)

This document explains what the MUI + Next.js SSR integration solves, how our current library differs, and a minimal, custom approach to render styles correctly on the server so the first paint is already styled (no FOUC), while keeping our current API and theming model.

### What MUI’s integration actually solves (in brief)
- **Critical CSS inlined on the server** so the page renders styled immediately.
- **Per-request style cache/registry** to keep server/client class order consistent.
- **Cleanup after hydration** to remove server-inserted style tags.

This improves perceived performance (no flicker) and avoids hydration warnings; it does not make component logic faster at runtime.

## Our current state
- Components use inline `React.CSSProperties` computed at render.
- Keyframes and global animations are injected on the client (`utils/keyframes.ts`).
- Many components are marked `'use client'`, so style application often happens after hydration.

Implication: Inline styles SSR fine by default, but anything that depends on client-only effects (e.g., dynamic keyframes, syntax highlighting) may flicker on first paint.

## Goals
- Keep our API and theme system.
- Avoid flicker by ensuring any needed CSS (keyframes, global rules) is present in the initial HTML from the server.
- Keep hydration consistent and dedupe client styles against server styles.

## Proposed approach: a tiny SSR style registry
We introduce a small, framework-agnostic registry that works on both server and client:

- **On the server**: collect keyframes/global CSS requested during the render pass; inline them into `<style>` via Next’s `useServerInsertedHTML`.
- **On the client**: register the same CSS requests; dedupe against what the server already inlined, and avoid reinjecting duplicates.
- **Deterministic IDs**: keyframe names and global rule identifiers are consistent across server and client.

### Minimal API surface
```ts
// src/ssr/StyleRegistry.tsx
import React, { createContext, useContext, useRef } from 'react'

type StyleChunk = { id: string; cssText: string }

type StyleRegistryValue = {
  insert: (chunk: StyleChunk) => void
  getChunks: () => StyleChunk[]
  has: (id: string) => boolean
}

const StyleRegistryContext = createContext<StyleRegistryValue | null>(null)

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const chunksRef = useRef<Map<string, string>>(new Map())

  const value: StyleRegistryValue = {
    insert: ({ id, cssText }) => {
      if (!chunksRef.current.has(id)) chunksRef.current.set(id, cssText)
    },
    getChunks: () =>
      Array.from(chunksRef.current.entries()).map(([id, cssText]) => ({ id, cssText })),
    has: id => chunksRef.current.has(id),
  }

  return (
    <StyleRegistryContext.Provider value={value}>
      {children}
    </StyleRegistryContext.Provider>
  )
}

export const useStyleRegistry = () => {
  const ctx = useContext(StyleRegistryContext)
  if (!ctx) throw new Error('useStyleRegistry must be used within StyleProvider')
  return ctx
}
```

```ts
// src/ssr/useServerStyles.tsx (App Router)
import { useServerInsertedHTML } from 'next/navigation'
import { useStyleRegistry } from './StyleRegistry'

export function useServerStyles() {
  const registry = useStyleRegistry()
  useServerInsertedHTML(() => {
    const styles = registry.getChunks()
    if (styles.length === 0) return null
    return (
      <style data-goobs-ssr="true" dangerouslySetInnerHTML={{
        __html: styles.map(s => `/* ${s.id} */\n${s.cssText}`).join('\n'),
      }} />
    )
  })
}
```

### Deterministic keyframe IDs
Replace random names in `utils/keyframes.ts` with a content hash (or caller-provided id). On the server, call `registry.insert({ id, cssText })` instead of directly touching `document`. On the client, only inject if not already present.

```ts
// src/utils/keyframes.ts (concept)
import { useStyleRegistry } from '../ssr/StyleRegistry'
import { stableHash } from './stableHash' // simple djb2 or murmurhash

export const useKeyframes = (nameOrSource: string, animation?: string) => {
  const registry = useStyleRegistry()
  const id = animation ? `${nameOrSource}-${stableHash(animation)}` : nameOrSource
  const cssText = `@keyframes ${id} { ${animation ?? ''} }`
  if (!registry.has(id)) registry.insert({ id, cssText })
  return id
}
```

### Integrate in `app/layout.tsx` (Next 13+ App Router)
Wrap the tree with `StyleProvider` and call `useServerStyles()` once at the top level so collected CSS inlines during SSR.

```tsx
// src/app/layout.tsx
import React from 'react'
import { StyleProvider } from '../ssr/StyleRegistry'
import { useServerStyles } from '../ssr/useServerStyles'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useServerStyles()
  return (
    <html lang="en">
      <body>
        <StyleProvider>{children}</StyleProvider>
      </body>
    </html>
  )
}
```

### Using it in components
- Where we currently call `keyframes/css`, switch to `useKeyframes` to register keyframes during render.
- Inline styles keep working as-is. The only change is how we generate animation names and ensure their CSS exists server-side.

```tsx
// example inside a component
import { useKeyframes } from '../../utils/keyframes'

const pulse = useKeyframes('pulse', `
  0% { opacity: 0.6 }
  50% { opacity: 1 }
  100% { opacity: 0.6 }
`)

<div style={{ animation: `${pulse} 2s ease-in-out infinite` }} />
```

## Optional improvements
- **Syntax highlighting (CodeCopy)**: pre-highlight on the server (e.g., using a lightweight highlighter in a server component) and hydrate on the client to avoid a flicker.
- **Global styles**: add a `GlobalStyles` helper that registers resets/font-face rules via the same registry.
- **Client cleanup**: if desired, remove the `data-goobs-ssr` style tag after hydration. It’s harmless to keep if rules match.

## File structure proposal
- `src/ssr/StyleRegistry.tsx` – context and registry.
- `src/ssr/useServerStyles.tsx` – `useServerInsertedHTML` bridge.
- `src/utils/stableHash.ts` – deterministic hash for rule IDs.
- `src/utils/keyframes.ts` – switch to registry-backed API.
- `src/app/layout.tsx` – wrap with `StyleProvider` and call `useServerStyles()`.

## Theme and style utilities audit
Most theme files return plain style objects and are SSR-safe. A few utilities directly touch `document` and should be routed through the SSR registry:

- Needs update
  - `src/theme/shared.ts`: keyframe injection uses `document`. Replace with registry-backed insertion and deterministic names.
  - `src/theme/icon.ts`: uses `document.styleSheets[0]`. Generate CSS text and insert via registry; avoid relying on a specific stylesheet.
  - `src/theme/formField.ts`: creates `<style>` elements. Route through registry and dedupe per request.
  - `src/theme/complextexteditor.ts`: injects styles via `document`. Route through registry.
  - `src/utils/keyframes.ts`: current client-only injection; migrate to registry API (`useKeyframes`) so animations exist on first paint.

- Likely OK (pure style computation)
  - `src/theme/index.ts` and the component-specific theme files (e.g., `button.ts`, `alert.ts`, `accordion.ts`, etc.) appear to compute plain objects without accessing browser globals.

Guidelines for updating the above:
- Generate deterministic IDs (hash of CSS content) for all inserted rules.
- Use the registry’s `insert({ id, cssText })`; avoid direct DOM access.
- Keep client runtime able to no-op if the rule already exists (dedupe against SSR-inlined styles).

## FAQ
- **Does this make components render faster?** No. It improves perceived performance by eliminating style flicker and ensuring hydration consistency.
- **Do we need to convert inline styles to classes?** No. We only need SSR for rule-based CSS (keyframes/global). Inline styles already SSR fine.
- **Do we have to change component props?** No. We can keep the current `styles` prop model; components only change how they acquire animation names.

## Rollout plan (safe and incremental)
1. Add the registry files and wrap `app/layout.tsx`.
2. Replace random keyframe names with `useKeyframes` in a few high-visibility components (`Button`, `CodeCopy`, `DataGrid`).
3. Verify no FOUC on first paint; compare before/after.
4. Optionally add `GlobalStyles` and server pre-highlighting for `CodeCopy`.

This gets us the main UX benefit of MUI’s SSR integration—immediate styled paint and consistent hydration—without adopting a heavyweight CSS-in-JS runtime.

### Component migration checklist

Use this to track which components have been updated to the SSR style-registry approach (keyframes/global rules registered on server, deterministic IDs, zero-FLICKer). Check items as you complete them.

- Legend: [ ] not started, [~] in progress, [x] done

#### Core UI
- [ ] `src/components/AppBar/index.tsx`
- [ ] `src/components/Avatar/index.tsx`
- [ ] `src/components/Badge/index.tsx`
- [ ] `src/components/Breadcrumb/index.tsx`
- [ ] `src/components/Button/index.tsx`
- [ ] `src/components/Card/index.tsx`
- [ ] `src/components/Checkbox/index.tsx`
- [ ] `src/components/Chip/index.tsx`
- [ ] `src/components/Container/index.tsx`
- [ ] `src/components/Content/index.tsx`
- [ ] `src/components/Dialog/index.tsx`
- [ ] `src/components/Divider/index.tsx`
- [ ] `src/components/Drawer/index.tsx`
- [ ] `src/components/Fade/index.tsx`
- [ ] `src/components/IconButton/index.tsx`
- [ ] `src/components/InputLabel/index.tsx`
- [ ] `src/components/List/index.tsx`
- [ ] `src/components/MenuItem/index.tsx`
- [ ] `src/components/Pagination/index.tsx`
- [ ] `src/components/Paper/index.tsx`
- [ ] `src/components/Popover/index.tsx`
- [ ] `src/components/PricingTable/index.tsx`
- [ ] `src/components/ProgressBar/index.tsx`
- [ ] `src/components/QRCode/index.tsx`
- [ ] `src/components/RadioGroup/index.tsx`
- [ ] `src/components/Select/index.tsx`
- [ ] `src/components/Slide/index.tsx`
- [ ] `src/components/Snackbar/index.tsx`
- [ ] `src/components/Stack/index.tsx`
- [ ] `src/components/Switch/index.tsx`
- [ ] `src/components/Table/index.tsx`
- [ ] `src/components/Tabs/index.tsx`
- [ ] `src/components/ToggleButton/index.tsx`
- [ ] `src/components/Toolbar/index.tsx`
- [ ] `src/components/Toolbar/left/index.tsx`
- [ ] `src/components/Toolbar/leftCenter/index.tsx`
- [ ] `src/components/Toolbar/right/index.tsx`
- [ ] `src/components/Toolbar/rightCenter/index.tsx`
- [ ] `src/components/Tooltip/index.tsx`
- [ ] `src/components/TreeView/index.tsx`
- [ ] `src/components/Typography/index.tsx`
- [ ] `src/components/Zoom/index.tsx`

#### Feedback
- [ ] `src/components/Alert/index.tsx`

#### Disclosure & Navigation
- [ ] `src/components/Accordion/index.tsx`
- [ ] `src/components/Breadcrumb/index.tsx`

#### Editors & Content Blocks
- [ ] `src/components/CodeCopy/index.tsx`
- [ ] `src/components/ComplexTextEditor/index.tsx`
- [ ] `src/components/ComplexTextEditor/MarkdownEditor/index.tsx`
- [ ] `src/components/ComplexTextEditor/RichEditor/index.tsx`
- [ ] `src/components/ComplexTextEditor/SimpleEditor/index.tsx`
- [ ] `src/components/ComplexTextEditor/Toolbars/Complex/index.tsx`
- [ ] `src/components/ComplexTextEditor/Toolbars/Editor/index.tsx`

#### Calendar & Scheduling
- [ ] `src/components/BigCalendar/index.tsx`
- [ ] `src/components/Stepper/index.tsx`

#### Forms (containers)
- [ ] `src/components/Form/Dialog/index.tsx`
- [ ] `src/components/Form/Popup/index.tsx`
- [ ] `src/components/Form/DataGrid/index.tsx`
- [ ] `src/components/Form/ProjectBoard/index.tsx`

#### Fields
- [ ] `src/components/ConfirmationCodeInput/index.tsx`
- [ ] `src/components/Field/Date/DateField/index.tsx`
- [ ] `src/components/Field/Date/DateRange/index.tsx`
- [ ] `src/components/Field/Dropdown/MultiSelect/index.tsx`
- [ ] `src/components/Field/Dropdown/Regular/index.tsx`
- [ ] `src/components/Field/Dropdown/SearchableHistory/index.tsx`
- [ ] `src/components/Field/Dropdown/SearchableSimple/index.tsx`
- [ ] `src/components/Field/IPAM/Address/index.tsx`
- [ ] `src/components/Field/IPAM/CIDR/index.tsx`
- [ ] `src/components/Field/IPAM/MACAddress/index.tsx`
- [ ] `src/components/Field/IPAM/Subnet/index.tsx`
- [ ] `src/components/Field/IPAM/Supernet/index.tsx`
- [ ] `src/components/Field/IPAM/VLAN/index.tsx`
- [ ] `src/components/Field/Number/AccountNumber/index.tsx`
- [ ] `src/components/Field/Number/CVV/index.tsx`
- [ ] `src/components/Field/Number/CreditCardNumber/index.tsx`
- [ ] `src/components/Field/Number/ExternalIncrement/index.tsx`
- [ ] `src/components/Field/Number/InternalIncrement/index.tsx`
- [ ] `src/components/Field/Number/RoutingNumber/index.tsx`
- [ ] `src/components/Field/Password/index.tsx`
- [ ] `src/components/Field/Percentage/index.tsx`
- [ ] `src/components/Field/PhoneNumber/index.tsx`
- [ ] `src/components/Field/Search/index.tsx`
- [ ] `src/components/Field/Slider/index.tsx`
- [ ] `src/components/Field/Text/index.tsx`
- [ ] `src/components/Field/Time/TimeRange/index.tsx`
- [ ] `src/components/Field/USD/index.tsx`
- [ ] `src/components/FormControl/index.tsx`
- [ ] `src/components/FormControlLabel/index.tsx`
- [ ] `src/components/InputLabel/index.tsx`

#### DataGrid (and subcomponents)
- [ ] `src/components/DataGrid/index.tsx`
- [ ] `src/components/DataGrid/Toolbar/index.tsx`
- [ ] `src/components/DataGrid/Footer/index.tsx`
- [ ] `src/components/DataGrid/FilterSection/index.tsx`
- [ ] `src/components/DataGrid/ManageColumnsSimple/index.tsx`
- [ ] `src/components/DataGrid/ManageRow/index.tsx`
- [ ] `src/components/DataGrid/MetricCard/index.tsx`
- [ ] `src/components/DataGrid/MetricSection/index.tsx`
- [ ] `src/components/DataGrid/Table/index.tsx`
- [ ] `src/components/DataGrid/Table/ColumnHeaderRow/index.tsx`
- [ ] `src/components/DataGrid/Table/CreationRow/index.tsx`
- [ ] `src/components/DataGrid/Table/Rows/index.tsx`
- [ ] `src/components/DataGrid/VerticalDivider/index.tsx`

#### ProjectBoard
- [ ] `src/components/ProjectBoard/index.tsx`
- [ ] `src/components/ProjectBoard/board/index.tsx`
- [ ] `src/components/ProjectBoard/forms/AddTask/administrator/companyDropdown/index.tsx`
- [ ] `src/components/ProjectBoard/forms/AddTask/administrator/companyProvided/index.tsx`
- [ ] `src/components/ProjectBoard/forms/AddTask/company/customerDropdown/index.tsx`
- [ ] `src/components/ProjectBoard/forms/AddTask/company/customerProvided/index.tsx`
- [ ] `src/components/ProjectBoard/forms/AddTask/customer/index.tsx`
- [ ] `src/components/ProjectBoard/forms/AddTask/noUser/index.tsx`
- [ ] `src/components/ProjectBoard/types/index.tsx`

#### Icons
- [ ] `src/components/Icons/*` (all icons; 272 files)

Note: The above checklist is generated from current `index.tsx` entries and known component paths. If any component is missing, add it under the appropriate heading. For the Icons set, track progress as a group, or split into alphabetical chunks if you plan to touch their styling.


