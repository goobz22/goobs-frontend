import type { Meta, StoryObj } from '@storybook/nextjs'
import React, { useState } from 'react'
import { userEvent, within, expect, waitFor } from 'storybook/test'
import Zoom from './index'
import CustomButton from '../Button'
import Typography from '../Typography'
import Paper from '../Paper'

const meta: Meta<typeof Zoom> = {
  title: 'Components/Zoom',
  component: Zoom,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    styles: {
      control: { type: 'object' },
      description: 'Styling options for the zoom component',
    },
    children: {
      control: { type: 'text' },
      description: 'Content to be wrapped with zoom transition',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic zoom story with interactive controls
export const Default: Story = {
  args: {
    styles: {
      in: true,
      theme: 'light',
      timeout: 300,
    },
    children: 'This content zooms in and out!',
  },
  render: function BasicZoomStory(args) {
    const [isVisible, setIsVisible] = useState(args.styles?.in ?? true)

    return (
      <div
        style={{
          width: '400px',
          height: '300px',
          position: 'relative',
        }}
      >
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'light' }}
        >
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Zoom
            {...args}
            styles={{
              ...args.styles,
              in: isVisible,
            }}
          >
            <Paper styles={{ theme: 'light', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'light' }}>
                {args.children}
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'light' }}>
                This is a zoom transition component that animates scale across
                themes.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

// Story showing different themes
export const Themes: Story = {
  render: function ThemesStory() {
    const [currentTheme, setCurrentTheme] = useState<
      'light' | 'dark' | 'sacred'
    >('light')
    const [isVisible, setIsVisible] = useState(true)

    const themes: Array<'light' | 'dark' | 'sacred'> = [
      'light',
      'dark',
      'sacred',
    ]

    // The theme switches at runtime, so a single static canvas pin can't match
    // all three states — give the demo block its own background that tracks the
    // active theme (light #ffffff / dark #111827 / sacred #0e0e0e) instead.
    const canvasBg =
      currentTheme === 'light'
        ? '#ffffff'
        : currentTheme === 'dark'
          ? '#111827'
          : '#0e0e0e'

    return (
      <div
        style={{
          width: '500px',
          height: '350px',
          background: canvasBg,
          padding: '20px',
          borderRadius: '8px',
          transition: 'background 200ms ease',
        }}
      >
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          {themes.map(theme => {
            const isActive = currentTheme === theme
            return (
              <CustomButton
                key={theme}
                onClick={() => setCurrentTheme(theme)}
                // Render EVERY picker button in the active canvas theme, not in
                // its own label theme. A sacred-themed button carries a
                // translucent control-bg (rgba(0,0,0,0.4)); on the white canvas
                // that composites to #999999 and its #f5f5f5 sacred text read
                // 2.61. Matching the canvas keeps each button opaque against its
                // own surface. The selected button uses the blue-600 primary
                // (#2563eb) — white text clears 4.5 at 5.17; the old blue-500
                // (#3b82f6) was only 3.67.
                styles={{
                  theme: currentTheme,
                  ...(isActive
                    ? {
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        borderColor: '#2563eb',
                      }
                    : {}),
                }}
              >
                {theme} theme
              </CustomButton>
            )
          })}
          <CustomButton
            onClick={() => setIsVisible(!isVisible)}
            styles={{ theme: currentTheme }}
          >
            Toggle
          </CustomButton>
        </div>

        <div style={{ height: '250px' }}>
          <Zoom
            styles={{
              in: isVisible,
              theme: currentTheme,
              timeout: 500,
            }}
          >
            <Paper styles={{ theme: currentTheme, padding: '25px' }}>
              <Typography styles={{ variant: 'merrih5', theme: currentTheme }}>
                {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}{' '}
                Theme
              </Typography>
              <Typography
                styles={{ variant: 'merriparagraph', theme: currentTheme }}
              >
                This zoom component adapts to different theme configurations.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
}

// Dark theme — visible state
export const DarkTheme: Story = {
  render: function DarkZoomStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'dark' }}
        >
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Zoom styles={{ in: isVisible, theme: 'dark', timeout: 400 }}>
            <Paper styles={{ theme: 'dark', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'dark' }}>
                Dark Theme Zoom
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'dark' }}>
                Scale transition on a dark surface.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
  globals: { backgrounds: { value: 'dark' } },
}

// Sacred theme — visible state
export const SacredTheme: Story = {
  render: function SacredZoomStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'sacred' }}
        >
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Zoom styles={{ in: isVisible, theme: 'sacred', timeout: 500 }}>
            <Paper styles={{ theme: 'sacred', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'sacred' }}>
                Sacred Theme Zoom
              </Typography>
              <Typography
                styles={{ variant: 'merriparagraph', theme: 'sacred' }}
              >
                Scale transition on a sacred surface.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
  globals: { backgrounds: { value: 'sacred' } },
}

// Story with a custom scale + transform origin
export const CustomScale: Story = {
  render: function CustomScaleStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'light' }}
        >
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '20px', height: '200px' }}>
          <Zoom
            styles={{
              in: isVisible,
              theme: 'light',
              timeout: 500,
              scaleEnter: 1,
              scaleExit: 0.4,
              transformOrigin: 'top left',
            }}
          >
            <Paper styles={{ theme: 'light', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'light' }}>
                Custom Scale
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'light' }}>
                Zooms from a 0.4 hidden scale anchored at the top-left.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
  globals: { backgrounds: { value: 'light' } },
}

// A11y regression — focus + screen-reader safety of the hidden state.
// When zoomed OUT (`in: false`) the wrapper flips to `visibility: hidden` once
// the zoom completes, so any interactive content inside is removed from BOTH the
// tab order and the screen-reader accessibility tree (opacity:0 + a scale alone
// leaves it focusable + announced — WCAG 1.3.1 / 2.4.3 / 4.1.2). Tab through the
// row: with the Zoom hidden, focus jumps straight from "Before" to "After",
// skipping the button inside the Zoom.
export const FocusAndScreenReaderSafety: Story = {
  render: function FocusSafetyStory() {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <div style={{ width: '480px' }}>
        <CustomButton
          onClick={() => setIsVisible(v => !v)}
          styles={{ theme: 'light' }}
        >
          {isVisible ? 'Zoom out' : 'Zoom in'}
        </CustomButton>
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <button type="button">Before</button>
          <Zoom styles={{ in: isVisible, theme: 'light', timeout: 300 }}>
            <button type="button" data-testid="zoom-inner-button">
              Inside Zoom
            </button>
          </Zoom>
          <button type="button">After</button>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Typography styles={{ variant: 'merriparagraph', theme: 'light' }}>
            While zoomed out, the middle button is not tabbable and not announced
            by screen readers — Tab moves from &ldquo;Before&rdquo; straight to
            &ldquo;After&rdquo;.
          </Typography>
        </div>
      </div>
    )
  },
  // Behavioral regression gate (runs in @storybook/test-runner, a real browser):
  // proves the hidden state removes the inner control from BOTH the a11y tree and
  // the tab order — the property a Chromatic pixel-diff cannot see, because
  // `visibility: hidden` and the old `opacity: 0` are pixel-identical. This FAILS
  // against an opacity:0-only Zoom (the button would stay accessible + focusable),
  // so it truly protects the hidden-state a11y fix.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const zoom = canvasElement.querySelector(
      '[data-component="Zoom"]'
    ) as HTMLElement
    const insideButton = canvasElement.querySelector(
      '[data-testid="zoom-inner-button"]'
    ) as HTMLButtonElement
    const beforeButton = canvas.getByRole('button', { name: 'Before' })

    // Starts zoomed OUT (in:false). No mount transition, so visibility is already
    // hidden: the inner button is out of the accessibility tree (queryByRole
    // walks that tree) and cannot receive focus (visibility:hidden is unfocusable).
    await waitFor(() => expect(getComputedStyle(zoom).visibility).toBe('hidden'))
    expect(canvas.queryByRole('button', { name: 'Inside Zoom' })).toBeNull()
    beforeButton.focus()
    insideButton.focus()
    expect(insideButton).not.toHaveFocus()
    expect(beforeButton).toHaveFocus()

    // Zoom IN: the inner button re-enters the a11y tree and becomes focusable.
    await userEvent.click(canvas.getByRole('button', { name: /Zoom (in|out)/ }))
    await waitFor(() =>
      expect(getComputedStyle(zoom).visibility).toBe('visible')
    )
    expect(
      canvas.getByRole('button', { name: 'Inside Zoom' })
    ).toBeInTheDocument()
    insideButton.focus()
    expect(insideButton).toHaveFocus()

    // Zoom OUT again: the deferred DISCRETE visibility swap holds the node
    // present for the whole zoom-out, then drops it once fully hidden.
    await userEvent.click(canvas.getByRole('button', { name: /Zoom (in|out)/ }))
    await waitFor(() => expect(getComputedStyle(zoom).visibility).toBe('hidden'))
    expect(canvas.queryByRole('button', { name: 'Inside Zoom' })).toBeNull()
    beforeButton.focus()
    insideButton.focus()
    expect(insideButton).not.toHaveFocus()
  },
  globals: { backgrounds: { value: 'light' } },
}

// A11y regression — reduced-motion awareness (WCAG 2.3.3). A Zoom is nothing but
// a transition, so under `prefers-reduced-motion: reduce` the animation is
// dropped and scale/opacity/visibility switch instantly. Turn on "Reduce motion"
// in your OS/browser and the deliberately slow 1500ms toggle below snaps instead
// of zooming.
export const ReducedMotion: Story = {
  render: function ReducedMotionStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '460px' }}>
        <CustomButton
          onClick={() => setIsVisible(v => !v)}
          styles={{ theme: 'light' }}
        >
          Toggle Zoom
        </CustomButton>
        <div style={{ marginTop: '16px', height: '150px' }}>
          <Zoom styles={{ in: isVisible, theme: 'light', timeout: 1500 }}>
            <Paper styles={{ theme: 'light', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'light' }}>
                Reduced-motion aware
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'light' }}>
                With &ldquo;Reduce motion&rdquo; enabled, this snaps in and out
                with no 1.5s zoom.
              </Typography>
            </Paper>
          </Zoom>
        </div>
      </div>
    )
  },
  // Regression gate for the reduced-motion fix. Chromatic cannot emulate
  // `prefers-reduced-motion` and a visible reduced-motion Zoom is pixel-identical
  // to a normal one, so a visual diff can't protect this. Instead assert the
  // guard RULE structurally in the CSSOM (it fails if the
  // `@media (prefers-reduced-motion: reduce)` block that zeroes the transition is
  // ever removed), plus a real behavioral check when the runner DOES request
  // reduced motion.
  play: async ({ canvasElement }) => {
    const zoom = canvasElement.querySelector(
      '[data-component="Zoom"]'
    ) as HTMLElement
    expect(zoom).toBeInTheDocument()

    // Structural presence gate: some stylesheet must carry a
    // `@media (prefers-reduced-motion: reduce)` rule that sets `transition: none`
    // on this component's container class. getComputedStyle can't read a
    // non-matching media query's value, so walk the CSSOM directly.
    const containerClass = zoom.classList[0]
    if (!containerClass) throw new Error('zoom container has no class')
    let hasReducedMotionGuard = false
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try {
        rules = sheet.cssRules
      } catch {
        continue // cross-origin sheet — not readable, skip
      }
      for (const rule of Array.from(rules)) {
        if (
          rule instanceof CSSMediaRule &&
          rule.media.mediaText.includes('prefers-reduced-motion') &&
          rule.media.mediaText.includes('reduce')
        ) {
          for (const inner of Array.from(rule.cssRules)) {
            if (
              inner instanceof CSSStyleRule &&
              inner.selectorText.includes(containerClass) &&
              /transition:\s*none/i.test(inner.cssText)
            ) {
              hasReducedMotionGuard = true
            }
          }
        }
      }
    }
    expect(hasReducedMotionGuard).toBe(true)

    // Behavioral gate when the environment actually requests reduced motion
    // (e.g. a runner configured to emulate it): the transition must be off.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      expect(getComputedStyle(zoom).transitionProperty).toBe('none')
    }
  },
  globals: { backgrounds: { value: 'light' } },
}
