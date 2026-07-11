/**
 * @fileoverview Storybook stories for the Typography component.
 * These stories showcase the various text styles, themes, and semantic
 * variations of the Typography component using the new theme system.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect } from 'storybook/test'
import Typography from './index'

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: { control: 'text' },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}

export default meta
type Story = StoryObj<typeof Typography>

// --------------------------------------------------------------------------
// LIGHT THEME STORIES
// --------------------------------------------------------------------------

/**
 * merrih1 is a Merriweather-branded heading. Regression baseline: the merri*
 * branch in resolveVariant pins '"Merriweather", serif', so the 'h1'
 * substring inside the variant name can no longer hijack the font family to
 * Cinzel (standard h1–h6 variants still render Cinzel).
 */
export const LightH1: Story = {
  name: 'Light/Heading 1',
  args: {
    text: 'Heading 1 - Light Theme',
    styles: {
      theme: 'light',
      variant: 'merrih1',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByText('Heading 1 - Light Theme')
    const fontFamily = window.getComputedStyle(heading).fontFamily
    await expect(fontFamily).toContain('Merriweather')
    await expect(fontFamily).not.toContain('Cinzel')
  },
}

export const LightH2: Story = {
  name: 'Light/Heading 2',
  args: {
    text: 'Heading 2 - Light Theme',
    styles: {
      theme: 'light',
      variant: 'merrih2',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * merriparagraph is Merriweather body text. Regression baseline: before the
 * merri* branch existed, the isHeading `.includes('h')` check matched the
 * 'h' in 'paragraph' and forced Cinzel onto this variant.
 */
export const LightParagraph: Story = {
  name: 'Light/Paragraph',
  args: {
    text: 'This is a paragraph in the light theme. It uses Merriweather for excellent readability.',
    styles: {
      theme: 'light',
      variant: 'merriparagraph',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const paragraph = canvas.getByText(
      'This is a paragraph in the light theme. It uses Merriweather for excellent readability.'
    )
    const fontFamily = window.getComputedStyle(paragraph).fontFamily
    await expect(fontFamily).toContain('Merriweather')
    await expect(fontFamily).not.toContain('Cinzel')
  },
}

/**
 * Light-theme helper text on the LIGHT canvas. Regression baseline: the merri
 * helper/footer pin used to be rgba(255,255,255,0.6) for EVERY non-sacred
 * theme — on a light surface that composites to white-on-white (1.0:1,
 * invisible; this story only "passed" because it inherited the sacred
 * near-black canvas). The light theme now pins the AA-tuned muted role token
 * --goobs-light-text-muted (#4b5563 — 7.56:1 on #ffffff).
 */
export const LightHelperText: Story = {
  name: 'Light/Helper Text',
  args: {
    text: 'This is helper text for captions or footers.',
    styles: {
      theme: 'light',
      variant: 'merrihelperfooter',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const helper = canvas.getByText(
      'This is helper text for captions or footers.'
    )
    // --goobs-light-text-muted resolves to #4b5563 = rgb(75, 85, 99).
    await expect(window.getComputedStyle(helper).color).toBe('rgb(75, 85, 99)')
  },
}

/**
 * `outline: true` renders a VISIBLE 1px currentColor outline (the .outlined
 * CSS-module treatment). Regression baseline: the boolean used to be
 * inverted to CSS `outline: none`, silently removing the outline this story
 * claims to add.
 */
export const LightWithOutline: Story = {
  name: 'Light/With Outline',
  args: {
    text: 'Outlined Light Heading',
    styles: {
      theme: 'light',
      variant: 'merrih2',
      outline: true,
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByText('Outlined Light Heading')
    const style = window.getComputedStyle(heading)
    await expect(style.outlineStyle).toBe('solid')
    await expect(style.outlineWidth).toBe('1px')
  },
}

// --------------------------------------------------------------------------
// DARK THEME STORIES
// --------------------------------------------------------------------------

export const DarkH1: Story = {
  name: 'Dark/Heading 1',
  args: {
    text: 'Heading 1 - Dark Theme',
    styles: {
      theme: 'dark',
      variant: 'merrih1',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

export const DarkParagraph: Story = {
  name: 'Dark/Paragraph',
  args: {
    text: 'This is a paragraph in the dark theme with improved contrast.',
    styles: {
      theme: 'dark',
      variant: 'merriparagraph',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * `outline: true` on the dark theme: a visible 1px outline in currentColor,
 * so it tracks the dark theme's light text color.
 */
export const DarkWithOutline: Story = {
  name: 'Dark/With Outline',
  args: {
    text: 'Outlined Dark Heading',
    styles: {
      theme: 'dark',
      variant: 'merrih2',
      outline: true,
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// SACRED THEME STORIES
// --------------------------------------------------------------------------

export const SacredH1: Story = {
  name: 'Sacred/Heading 1',
  args: {
    text: 'Heading 1 - Sacred Theme',
    styles: {
      theme: 'sacred',
      variant: 'merrih1',
    },
  },
  // Sacred design language is gold-on-near-black: pin the sacred canvas
  // (#0e0e0e — gold is 13.76:1 there, WCAG AA pass).
  globals: { backgrounds: { value: 'sacred' } },
}

export const SacredParagraph: Story = {
  name: 'Sacred/Paragraph',
  args: {
    text: 'This is a paragraph in the sacred theme, using Merriweather body text against the gold palette.',
    styles: {
      theme: 'sacred',
      variant: 'merriparagraph',
    },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

/**
 * `outline: true` on the sacred theme: a visible 1px outline in currentColor,
 * so it renders gold to match the sacred text color.
 */
export const SacredWithOutline: Story = {
  name: 'Sacred/With Outline',
  args: {
    text: 'Outlined Sacred Heading',
    styles: {
      theme: 'sacred',
      variant: 'merrih2',
      outline: true,
    },
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// FUNCTIONAL STORIES
// --------------------------------------------------------------------------

export const Centered: Story = {
  name: 'Alignment/Center',
  args: {
    text: 'This text is center-aligned.',
    styles: {
      theme: 'light',
      variant: 'merriparagraph',
      textAlign: 'center',
      width: '300px',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const GutterBottom: Story = {
  name: 'Spacing/Gutter Bottom',
  // Sacred-themed demo content: pin the sacred canvas explicitly rather than
  // relying on it being the default (gold on #0e0e0e is 13.76:1).
  globals: { backgrounds: { value: 'sacred' } },
  render: () => (
    <div>
      <Typography
        text="This paragraph has a bottom margin."
        styles={{
          theme: 'sacred',
          variant: 'cinzelparagraph',
          gutterBottom: true,
        }}
      />
      <Typography
        text="This is the next paragraph to show the spacing."
        styles={{ theme: 'sacred', variant: 'cinzelparagraph' }}
      />
    </div>
  ),
}

export const AsChild: Story = {
  name: 'Composition/As Child',
  args: {
    children: (
      <span>
        This is a <strong style={{ color: 'blue' }}>React node child</strong>{' '}
        inside Typography.
      </span>
    ),
    styles: {
      theme: 'light',
      variant: 'merrih1',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const CustomColor: Story = {
  name: 'Customization/Custom Color',
  args: {
    text: 'Custom colored heading',
    styles: {
      theme: 'light',
      variant: 'merrih2',
      color: '#e11d48',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

export const CustomFontSize: Story = {
  name: 'Customization/Custom Font Size',
  args: {
    text: 'This paragraph has a custom font size.',
    styles: {
      theme: 'light',
      variant: 'merriparagraph',
      fontSize: '1.25rem',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// SEMANTIC ELEMENT STORIES (a11y / SEO — the `component` prop)
// --------------------------------------------------------------------------

/**
 * A heading `variant` only STYLES the text at heading sizes; the semantic
 * element is chosen by `component`. Passing `component="h2"` emits a real
 * `<h2>` so screen-reader heading navigation (rotor / "next heading") and
 * search crawlers see it in the document outline. Regression baseline: without
 * `component`, a `merrih2`/`h2` variant renders a non-semantic `<span>`
 * (WCAG 1.3.1 Info and Relationships, 2.4.6 Headings and Labels).
 */
export const SemanticHeadingElement: Story = {
  name: 'Semantics/Real Heading Element',
  args: {
    text: 'Real H2 Section Heading',
    component: 'h2',
    styles: {
      theme: 'light',
      variant: 'merrih2',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Exposed to AT as a level-2 heading, not just visually large text.
    const heading = canvas.getByRole('heading', { level: 2 })
    await expect(heading).toBeVisible()
    await expect(heading.tagName).toBe('H2')
    await expect(heading).toHaveTextContent('Real H2 Section Heading')
    // The machine-test selector contract rides the polymorphic element.
    await expect(heading).toHaveAttribute('data-component', 'Typography')
    await expect(heading).toHaveAttribute('data-theme', 'light')
  },
}

/**
 * `component="p"` renders a real paragraph element for standalone body copy,
 * so the SSR'd HTML carries semantic paragraph structure instead of a bare
 * styled span.
 */
export const SemanticParagraphElement: Story = {
  name: 'Semantics/Real Paragraph Element',
  args: {
    text: 'A real paragraph element carrying semantic body copy.',
    component: 'p',
    styles: {
      theme: 'light',
      variant: 'merriparagraph',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const para = canvas.getByText(
      'A real paragraph element carrying semantic body copy.'
    )
    await expect(para.tagName).toBe('P')
    await expect(para).toHaveAttribute('data-component', 'Typography')
  },
}

/**
 * Contract lock: with NO `component`, a heading `variant` styles the text but
 * still renders a `<span>` — the phrasing-content / hydration-safe default
 * (Typography must remain valid inside `<button>`/`<a>`/`<h1>`–`<h6>`).
 * Semantic headings are OPT-IN via `component` (see `Semantics/Real Heading
 * Element`); this story guards against a regression that would auto-promote
 * the element and reintroduce the invalid-nesting hydration bug.
 */
export const DefaultSpanElement: Story = {
  name: 'Semantics/Default Span (phrasing content)',
  args: {
    text: 'Heading variant, default element',
    styles: {
      theme: 'light',
      variant: 'merrih1',
    },
  },
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const el = canvas.getByText('Heading variant, default element')
    await expect(el.tagName).toBe('SPAN')
    // A styled heading variant must NOT expose a heading role by default.
    await expect(canvas.queryByRole('heading')).toBeNull()
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
  name: 'Interaction and A11y Test',
  // Sacred-themed typography is gold-on-near-black; the demo surface must be
  // the sacred near-black (#0e0e0e), not a light gray — gold #ffd700 on
  // #f0f0f0 is 1.23:1, on #0e0e0e it is 13.76:1 (WCAG AA pass).
  globals: { backgrounds: { value: 'sacred' } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        background: '#0e0e0e',
      }}
    >
      <Typography styles={{ theme: 'sacred', variant: 'cinzelh1' }}>
        Test Heading 1
      </Typography>
      <Typography styles={{ theme: 'sacred', variant: 'cinzelparagraph' }}>
        This is a test paragraph.
      </Typography>
      <Typography
        styles={{
          theme: 'sacred',
          variant: 'cinzelhelperfooter',
          textAlign: 'right',
        }}
      >
        Footer text
      </Typography>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByText('Test Heading 1')
    const paragraph = canvas.getByText('This is a test paragraph.')
    const footer = canvas.getByText('Footer text')

    await expect(heading).toBeVisible()
    await expect(paragraph).toBeVisible()
    await expect(footer).toBeVisible()

    // Check alignment
    expect(footer).toHaveStyle({ 'text-align': 'right' })
  },
}

// --------------------------------------------------------------------------
// ATTRIBUTE PASS-THROUGH STORIES (a11y — id / htmlFor / aria-* forwarding)
// --------------------------------------------------------------------------

/**
 * A `component`-upgraded heading is now usable as an `aria-labelledby` TARGET:
 * because Typography spreads standard DOM attributes onto the rendered element,
 * a `component="h2" id="region-title"` heading supplies the accessible NAME of a
 * region/dialog that references it. Regression baseline: before the attribute
 * pass-through, `id` was dropped on the floor, the IDREF resolved to nothing,
 * and the region had no accessible name — the standard "heading names a
 * dialog/landmark" pattern was non-functional (WCAG 1.3.1 Info and
 * Relationships, 4.1.2 Name, Role, Value).
 */
export const HeadingAsLabelledbyTarget: Story = {
  name: 'Semantics/Heading Names a Region (aria-labelledby)',
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <section aria-labelledby="region-title">
      <Typography
        component="h2"
        id="region-title"
        text="Account Settings"
        styles={{ theme: 'light', variant: 'merrih2' }}
      />
      <Typography
        component="p"
        text="Region body content."
        styles={{ theme: 'light', variant: 'merriparagraph' }}
      />
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The id rode through to the REAL <h2>, so the section becomes a named
    // region whose accessible name resolves via aria-labelledby to the heading.
    const region = canvas.getByRole('region', { name: 'Account Settings' })
    await expect(region).toBeVisible()
    const heading = canvas.getByRole('heading', { level: 2 })
    await expect(heading).toHaveAttribute('id', 'region-title')
    // The polymorphic element still carries the machine-test selector contract.
    await expect(heading).toHaveAttribute('data-component', 'Typography')
  },
}

/**
 * `component="label"` + `htmlFor` now programmatically associates the label with
 * a form control by the control's id (rendered as the `for` attribute) — the
 * advertised label affordance is functional. Regression baseline: before
 * `htmlFor` was declared + passed through, the `<label>` carried no `for`
 * attribute, so clicking it did not focus the input and screen readers did not
 * announce the label as the control's accessible name (WCAG 1.3.1, 3.3.2 Labels
 * or Instructions, 4.1.2 Name, Role, Value).
 */
export const LabelAssociation: Story = {
  name: 'Semantics/Label Associates With Control (htmlFor)',
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Typography
        component="label"
        htmlFor="email-input"
        text="Email address"
        styles={{ theme: 'light', variant: 'merriparagraph' }}
      />
      <input id="email-input" type="email" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // getByLabelText resolves ONLY when the label's `for` matches the input id.
    const input = canvas.getByLabelText('Email address')
    await expect(input).toBeVisible()
    await expect(input.tagName).toBe('INPUT')
    // The label rendered as a real <label> carrying the association + contract.
    const label = canvas.getByText('Email address')
    await expect(label.tagName).toBe('LABEL')
    await expect(label).toHaveAttribute('for', 'email-input')
    await expect(label).toHaveAttribute('data-component', 'Typography')
  },
}

/**
 * Contract lock for attribute pass-through: a caller `className` is MERGED with
 * the resolved classes (never replaces them), arbitrary DOM attributes (`id`,
 * `aria-describedby`) reach the element, and the machine-test selector contract
 * (`data-component`/`data-theme`) can NEVER be clobbered by pass-through props —
 * `{...rest}` is spread before the contract attributes so the component's own
 * attributes always win. Guards against a regression that would let a caller
 * overwrite `data-component` or drop the resolved root/variant classes.
 */
export const AttributePassThroughPreservesContract: Story = {
  name: 'Semantics/Attribute Pass-Through (contract preserved)',
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <div>
      <Typography
        component="h3"
        id="passthrough-heading"
        className="caller-added-class"
        aria-describedby="passthrough-desc"
        text="Described heading"
        styles={{ theme: 'light', variant: 'merrih3' }}
      />
      <Typography
        component="p"
        id="passthrough-desc"
        text="Supplementary description."
        styles={{ theme: 'light', variant: 'merriparagraph' }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { level: 3 })
    // id + aria-describedby rode through to the real <h3>.
    await expect(heading).toHaveAttribute('id', 'passthrough-heading')
    await expect(heading).toHaveAttribute('aria-describedby', 'passthrough-desc')
    // Caller className is MERGED alongside the resolved classes, not replacing
    // them (root + variant classes remain, so >1 class is present).
    await expect(heading).toHaveClass('caller-added-class')
    await expect(heading.classList.length).toBeGreaterThan(1)
    // Contract attributes are NOT clobbered by the pass-through spread.
    await expect(heading).toHaveAttribute('data-component', 'Typography')
    await expect(heading).toHaveAttribute('data-theme', 'light')
  },
}
