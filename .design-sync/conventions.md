## Building with goobs-frontend

goobs-frontend is a self-themed React component library. Components carry their own styling — you
do **not** write CSS classes for them and there is **no theme `<Provider>` to wrap**. You style a
component through its **`styles` prop**, and you write your own layout glue with the design tokens
below.

### Theming — the `styles.theme` prop (not a className, not a context)

Every visual component accepts a `styles` object whose `theme` key selects one of three themes:

- `'sacred'` — the **default**: dark, gold-accented, mystical (Cinzel display type on dark glass surfaces).
- `'light'` — light surfaces, dark text.
- `'dark'` — dark-slate surfaces, light text.

```jsx
const { CustomButton, Alert } = window.GoobsFrontend;
<CustomButton text="Save" styles={{ theme: 'light' }} />
<Alert severity="success" message="Saved" styles={{ theme: 'dark' }} />
```

Dark and sacred components are designed for **dark backgrounds** — render them on a dark surface (or
they look low-contrast on white). Per-component `styles` objects also accept scalar overrides
(colors, sizes) that the component forwards as CSS variables — see each component's `.d.ts` for its
exact `*Styles` shape. Do not invent CSS class names; they won't resolve.

### Tokens — `var(--goobs-*)` for YOUR layout glue

The library ships 737 CSS custom properties (declared in `_ds_bundle.css`, reachable via `styles.css`).
Use them for spacing/color/type in the wrapper markup you write around components, so your layout
matches the system:

- **space**: `var(--goobs-space-2xs|xs|sm|md|lg|xl|2xl)`
- **radius**: `var(--goobs-radius-sm|md|lg)`
- **type**: `var(--goobs-font-sacred)` (Cinzel), `var(--goobs-font-standard)` (Inter), `var(--goobs-font-mono)`
- **color/role**: `var(--goobs-gold)`, the `--goobs-gold-a02…` alpha ladder, and per-theme role palettes
- **shadow**: `var(--goobs-shadow-sacred-rest|sm|md)`

### Icons live under the `Icons` namespace

Icons are NOT top-level exports — they are members of `window.GoobsFrontend.Icons`:

```jsx
const { Icons } = window.GoobsFrontend;
<Icons.AddIcon /> <Icons.AccountIcon />
```

### Forms

Form fields (TextField, Dropdown, Checkbox, Switch, the Number/IPAM fields, …) auto-bind their value
by their `name` prop when rendered inside `<Form schema={zodSchema}>` (goobs's zod-native engine);
used standalone they are controlled inputs. `Form.AutoFields` scaffolds one field per schema key.

### Where the truth lives

- `styles.css` → `@import`s the tokens, fonts, and all component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage + variants; `<Name>.d.ts` — the exact props/`*Styles` types.

### Minimal example

```jsx
const { CustomButton, TextField, Icons } = window.GoobsFrontend;
function SaveRow() {
  return (
    <div style={{ display: 'flex', gap: 'var(--goobs-space-sm)', alignItems: 'center' }}>
      <TextField name="email" label="Email" styles={{ theme: 'light' }} />
      <CustomButton text="Save" icon={<Icons.SaveIcon />} styles={{ theme: 'light' }} />
    </div>
  );
}
```
