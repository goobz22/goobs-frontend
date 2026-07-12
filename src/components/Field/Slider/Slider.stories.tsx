/**
 * @fileoverview Storybook stories for the Slider component.
 * These stories showcase the various themes, ranges, steps, and states of the
 * range-input-backed Slider, which composes the shared FieldShell.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import Slider from './index'

// Wrapper component for state management. Slider is controlled — onChange
// forwards the numeric value.
const SliderWithState = ({
  initialValue,
  ...props
}: React.ComponentProps<typeof Slider> & { initialValue?: number }) => {
  const [value, setValue] = useState<number>(initialValue ?? props.min ?? 0)
  return <Slider {...props} value={value} onChange={setValue} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof Slider> = {
  title: 'Components/Field/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    styles: {
      control: 'object',
      description: 'Per-instance style overrides including theme/disabled/required',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Slider>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  render: () => (
    <SliderWithState
      label="Volume"
      min={0}
      max={100}
      step={1}
      initialValue={50}
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Base APG slider semantics. The native range exposes the implicit `slider`
    // role with value/min/max in the a11y tree. These attributes are non-visual
    // (a Chromatic snapshot can't see them), so pin them here. With no
    // `formatValueText`, `aria-valuetext` stays UNSET so AT falls back to the
    // numeric `aria-valuenow` — the documented back-compat branch.
    // (WCAG 4.1.2 Name, Role, Value.)
    const slider = canvas.getByRole('slider', { name: 'Volume' })
    await expect(slider).toHaveAttribute('aria-valuemin', '0')
    await expect(slider).toHaveAttribute('aria-valuemax', '100')
    await expect(slider).toHaveAttribute('aria-valuenow', '50')
    await expect(slider).not.toHaveAttribute('aria-valuetext')
  },
}

export const DarkTheme: Story = {
  render: () => (
    <SliderWithState
      label="Brightness"
      min={0}
      max={100}
      step={1}
      initialValue={50}
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <SliderWithState
      label="Resonance"
      min={0}
      max={100}
      step={1}
      initialValue={50}
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// RANGES AND STEPS
// --------------------------------------------------------------------------

export const CustomRange: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <SliderWithState
        label="Temperature (°C)"
        min={-20}
        max={40}
        step={1}
        initialValue={20}
        helperText="Range from -20 to 40"
        styles={{ theme: 'light' }}
      />
      <SliderWithState
        label="Percentage"
        min={0}
        max={1}
        step={0.05}
        initialValue={0.5}
        helperText="Fine-grained 0.05 steps"
        styles={{ theme: 'light' }}
      />
      <SliderWithState
        label="Rating"
        min={1}
        max={5}
        step={1}
        initialValue={3}
        helperText="Discrete 1-5 steps"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// WITH HELPER TEXT
// --------------------------------------------------------------------------

export const WithHelperText: Story = {
  render: () => (
    <SliderWithState
      label="Opacity"
      min={0}
      max={100}
      step={5}
      initialValue={75}
      helperText="Drag to adjust the layer opacity"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATE
// --------------------------------------------------------------------------

export const WithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Light-themed error surface: light-danger token (#b91c1c) needs a
          white backing to reach 4.5:1 (2.98 on the sacred canvas). */}
      <div
        style={{
          background: '#ffffff',
          padding: '1.5rem',
          borderRadius: '8px',
        }}
      >
        <SliderWithState
          label="Threshold"
          min={0}
          max={100}
          initialValue={10}
          error="Value must be at least 25"
          styles={{ theme: 'light' }}
        />
      </div>
      {/* Dark-themed error surface: dark-danger token (#f87171) on #111827. */}
      <div
        style={{
          background: '#111827',
          padding: '1.5rem',
          borderRadius: '8px',
        }}
      >
        <SliderWithState
          label="Threshold"
          min={0}
          max={100}
          initialValue={10}
          error="Value must be at least 25"
          styles={{ theme: 'dark' }}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The programmatic error association is INVISIBLE: Chromatic captures the
    // red error text, but not `aria-invalid` nor the `aria-describedby` link to
    // the role="alert" region. Pin the wiring so a regression that stops
    // spreading `{...inputAriaProps}` on the input, or drops the error linkage,
    // fails the story. (WCAG 3.3.1 Error Identification / 4.1.2 Name, Role,
    // Value / 1.4.1 Use of Color — error is not conveyed by color alone.)
    const sliders = canvas.getAllByRole('slider', { name: 'Threshold' })
    expect(sliders).toHaveLength(2)
    for (const slider of sliders) {
      await expect(slider).toHaveAttribute('aria-invalid', 'true')
      const describedById = slider.getAttribute('aria-describedby')
      expect(describedById).toBeTruthy()
      const region = canvasElement.querySelector(
        `#${CSS.escape(describedById as string)}`
      )
      await expect(region).toHaveAttribute('role', 'alert')
      await expect(region).toHaveTextContent('Value must be at least 25')
    }
  },
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <SliderWithState
        label="Disabled Light"
        min={0}
        max={100}
        initialValue={40}
        styles={{ theme: 'light', disabled: true }}
      />
      <SliderWithState
        label="Disabled Dark"
        min={0}
        max={100}
        initialValue={40}
        styles={{ theme: 'dark', disabled: true }}
      />
      <SliderWithState
        label="Disabled Sacred"
        min={0}
        max={100}
        initialValue={40}
        styles={{ theme: 'sacred', disabled: true }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Disabled must be conveyed by the native `disabled` attribute (removed
    // from tab order + not operable), not by dimming/color alone. `disabled` is
    // programmatic, not visual — pin it. (WCAG 1.4.1 Use of Color / 4.1.2.)
    const sliders = canvas.getAllByRole('slider')
    expect(sliders).toHaveLength(3)
    for (const slider of sliders) {
      await expect(slider).toBeDisabled()
    }
  },
}

// --------------------------------------------------------------------------
// REQUIRED STATE
// --------------------------------------------------------------------------

export const Required: Story = {
  render: () => (
    <SliderWithState
      label="Confidence Level"
      min={0}
      max={100}
      initialValue={60}
      styles={{ theme: 'light', required: true }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Required is conveyed programmatically via `aria-required`, not by the
    // visual asterisk indicator alone. `aria-required` is non-visual — pin it
    // so a regression that stops forwarding required into the input's ARIA bag
    // fails the story. (WCAG 3.3.2 Labels or Instructions / 1.4.1 / 4.1.2.)
    const slider = canvas.getByRole('slider', { name: 'Confidence Level' })
    await expect(slider).toHaveAttribute('aria-required', 'true')
  },
}

// --------------------------------------------------------------------------
// ACCESSIBLE VALUE TEXT (aria-valuetext)
// --------------------------------------------------------------------------

/**
 * When the raw number is not the clearest spoken representation, pass
 * `formatValueText` to control what screen readers announce via
 * `aria-valuetext` — units, a bounded scale, or a percentage. Inspect the
 * range input in the a11y panel: the announced value is the formatted string,
 * not the bare number. (WCAG 1.3.1 / 4.1.2; APG slider pattern.)
 */
export const WithValueText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <SliderWithState
        label="Temperature"
        min={-20}
        max={40}
        step={1}
        initialValue={20}
        helperText="Announced as e.g. “20 degrees Celsius”, not “20”"
        formatValueText={v => `${v} degrees Celsius`}
        styles={{ theme: 'light' }}
      />
      <SliderWithState
        label="Rating"
        min={1}
        max={5}
        step={1}
        initialValue={3}
        helperText="Announced as “3 of 5”, not “3”"
        formatValueText={v => `${v} of 5`}
        styles={{ theme: 'light' }}
      />
      <SliderWithState
        label="Opacity"
        min={0}
        max={1}
        step={0.05}
        initialValue={0.5}
        helperText="Announced as “50 percent”, not “0.5”"
        formatValueText={v => `${Math.round(v * 100)} percent`}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // `aria-valuetext` is the ONE value-semantics attribute a native range
    // cannot derive on its own — and it is INVISIBLE, so a Chromatic snapshot
    // cannot guard it (removing `aria-valuetext={valueText}` would render an
    // identical picture). These assertions pin the formatter → attribute path
    // so a regression fails the story. (WCAG 1.3.1 / 4.1.2; APG slider.)
    const temp = canvas.getByRole('slider', { name: 'Temperature' })
    await expect(temp).toHaveAttribute('aria-valuetext', '20 degrees Celsius')
    await expect(temp).toHaveAttribute('aria-valuenow', '20')
    const rating = canvas.getByRole('slider', { name: 'Rating' })
    await expect(rating).toHaveAttribute('aria-valuetext', '3 of 5')
    const opacity = canvas.getByRole('slider', { name: 'Opacity' })
    await expect(opacity).toHaveAttribute('aria-valuetext', '50 percent')
    await expect(opacity).toHaveAttribute('aria-valuenow', '0.5')
  },
}

// --------------------------------------------------------------------------
// LABEL-LESS ACCESSIBLE NAME (aria-label fallback)
// --------------------------------------------------------------------------

/**
 * A slider with no visible `label` still needs an accessible name. Pass
 * `ariaLabel` and it is applied as `aria-label` on the range input, so screen
 * readers announce a name even for a bare control (a slider in a data-table
 * row or a compact toolbar). When a visible `label` IS present it always wins
 * and `aria-label` is intentionally NOT set, so the visible name can never be
 * silently overridden. (WCAG 4.1.2 Name, Role, Value / 2.5.3 Label in Name.)
 */
export const LabelLessAccessibleName: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* No visible label — `ariaLabel` is the ONLY accessible name. */}
      <SliderWithState
        ariaLabel="Zoom level"
        min={0}
        max={100}
        step={1}
        initialValue={40}
        helperText="No visible label — named only via ariaLabel"
        styles={{ theme: 'light' }}
      />
      {/* Visible label present: it wins; `ariaLabel` is ignored (not applied). */}
      <SliderWithState
        label="Volume"
        ariaLabel="Should be ignored"
        min={0}
        max={100}
        step={1}
        initialValue={60}
        helperText="Visible label wins; aria-label is not set"
        styles={{ theme: 'light' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The accessible name is INVISIBLE to a Chromatic snapshot: a label-less
    // slider with NO accessible name is a WCAG 4.1.2 failure a picture cannot
    // catch. Pin the name here so dropping the `aria-label` passthrough (or the
    // `ariaLabel` prop) fails the story. Resolving by role+name proves the
    // slider is discoverable to AT by its `ariaLabel`.
    const named = canvas.getByRole('slider', { name: 'Zoom level' })
    await expect(named).toHaveAttribute('aria-label', 'Zoom level')

    // When a visible <label> exists it is the accessible name and `aria-label`
    // is deliberately absent, so the `ariaLabel` prop can never override the
    // visible text (WCAG 2.5.3 Label in Name). The slider resolves by its
    // visible label and carries no `aria-label`.
    const labelled = canvas.getByRole('slider', { name: 'Volume' })
    await expect(labelled).not.toHaveAttribute('aria-label')
  },
}

// --------------------------------------------------------------------------
// KEYBOARD FOCUS RING (:focus-visible)
// --------------------------------------------------------------------------

/**
 * Tab to the slider: a 2px themed focus ring appears (`:focus-visible`, so it
 * only shows for keyboard focus, never a pointer drag). The native range input
 * is fully keyboard-operable out of the box — Arrow Left/Right/Up/Down adjust
 * by `step`, Home/End jump to min/max, PageUp/PageDown take larger steps.
 * (WCAG 2.1.1 Keyboard / 2.4.7 Focus Visible / 2.4.11 Focus Appearance.)
 *
 * The `play` fn moves real keyboard focus (Tab) onto the first (light) slider so
 * the `:focus-visible` ring actually paints and Chromatic captures it in the
 * baseline. Without this the ring never renders in the snapshot — deleting the
 * `.input:focus-visible` rule would change no baseline and pass silently. The
 * sacred slider's gold ring is snapshot-gated by `KeyboardFocusRingSacred`,
 * since only one element can hold focus per snapshot.
 */
export const KeyboardFocusRing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <SliderWithState
        label="Light (Tab to focus)"
        min={0}
        max={100}
        step={1}
        initialValue={50}
        helperText="Arrows adjust · Home/End jump to min/max"
        styles={{ theme: 'light' }}
      />
      <div
        style={{ background: '#0e0e0e', padding: '1.5rem', borderRadius: '8px' }}
      >
        <SliderWithState
          label="Sacred (Tab to focus)"
          min={0}
          max={100}
          step={1}
          initialValue={50}
          helperText="Gold focus ring on the sacred canvas"
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Both range inputs expose the implicit `slider` role.
    const sliders = canvas.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
    // Keyboard navigation (Tab), not a pointer click, is what activates
    // `:focus-visible`. Tabbing from the body lands focus on the first (light)
    // slider, driving its ring for the snapshot.
    await userEvent.tab()
    const light = canvas.getByRole('slider', { name: 'Light (Tab to focus)' })
    await expect(light).toHaveFocus()
    // The sacred slider is keyboard-reachable too (a native, enabled range
    // input); its gold ring is gated by KeyboardFocusRingSacred below.
    const sacred = canvas.getByRole('slider', { name: 'Sacred (Tab to focus)' })
    await expect(sacred).toBeEnabled()
  },
}

/**
 * The sacred-theme focus ring in isolation. A single focusable sacred slider is
 * tabbed to so its gold `:focus-visible` outline paints and is captured by
 * Chromatic — this specifically gates the sacred value of the inherited
 * `--field-border-focus` token (gold, not blue) that the `.input:focus-visible`
 * rule resolves. Because only one element can hold focus per snapshot, the base
 * `KeyboardFocusRing` story cannot also baseline this variant.
 * (WCAG 2.4.7 Focus Visible / 2.4.11 Focus Appearance.)
 */
export const KeyboardFocusRingSacred: Story = {
  render: () => (
    <div style={{ background: '#0e0e0e', padding: '1.5rem', borderRadius: '8px' }}>
      <SliderWithState
        label="Sacred (Tab to focus)"
        min={0}
        max={100}
        step={1}
        initialValue={50}
        helperText="Gold focus ring on the sacred canvas"
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const sacred = canvas.getByRole('slider', { name: 'Sacred (Tab to focus)' })
    await expect(sacred).toHaveFocus()
  },
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SliderWithState
            label="Basic"
            min={0}
            max={100}
            initialValue={50}
            styles={{ theme: 'light' }}
          />
          <SliderWithState
            label="With Error"
            min={0}
            max={100}
            initialValue={5}
            error="Too low"
            styles={{ theme: 'light' }}
          />
          <SliderWithState
            label="Required"
            min={0}
            max={100}
            initialValue={70}
            styles={{ theme: 'light', required: true }}
          />
        </div>
      </div>

      <div
        style={{
          background: '#111827',
          padding: '1.5rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SliderWithState
            label="Basic"
            min={0}
            max={100}
            initialValue={50}
            styles={{ theme: 'dark' }}
          />
          <SliderWithState
            label="Disabled"
            min={0}
            max={100}
            initialValue={30}
            styles={{ theme: 'dark', disabled: true }}
          />
          <SliderWithState
            label="Custom Range"
            min={0}
            max={10}
            step={0.5}
            initialValue={5}
            styles={{ theme: 'dark' }}
          />
        </div>
      </div>

      <div
        style={{
          background: '#0e0e0e',
          padding: '1.5rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SliderWithState
            label="Basic"
            min={0}
            max={100}
            initialValue={50}
            styles={{ theme: 'sacred' }}
          />
          <SliderWithState
            label="With Helper"
            min={0}
            max={100}
            initialValue={88}
            helperText="Sacred resonance level"
            styles={{ theme: 'sacred' }}
          />
          <SliderWithState
            label="Disabled"
            min={0}
            max={100}
            initialValue={40}
            styles={{ theme: 'sacred', disabled: true }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'light' } },
}
