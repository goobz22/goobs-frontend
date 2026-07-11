import type { Meta, StoryObj } from '@storybook/nextjs'
import React, { useState } from 'react'
import Slide from './index'
import CustomButton from '../Button'
import Typography from '../Typography'
import Paper from '../Paper'

const meta: Meta<typeof Slide> = {
  title: 'Components/Slide',
  component: Slide,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    styles: {
      control: { type: 'object' },
      description: 'Styling options for the slide component',
    },
    children: {
      control: { type: 'text' },
      description: 'Content to be wrapped with slide transition',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic slide story with interactive controls
export const Default: Story = {
  args: {
    styles: {
      in: true,
      direction: 'up',
      theme: 'light',
      timeout: 300,
    },
    children: 'This content slides in and out!',
  },
  render: function BasicSlideStory(args) {
    const [isVisible, setIsVisible] = useState(args.styles?.in ?? true)

    return (
      <div
        style={{
          width: '400px',
          height: '300px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CustomButton
          onClick={() => setIsVisible(!isVisible)}
          styles={{ theme: 'light' }}
        >
          Toggle Slide
        </CustomButton>
        <div
          style={{ marginTop: '20px', height: '200px', position: 'relative' }}
        >
          <Slide
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
              <Typography
                styles={{ variant: 'merriparagraph', theme: 'light' }}
              >
                This is a slide transition component that supports different
                directions and themes.
              </Typography>
            </Paper>
          </Slide>
        </div>
      </div>
    )
  },
}

// Story showing all directions
export const AllDirections: Story = {
  render: function AllDirectionsStory() {
    const [activeDirection, setActiveDirection] = useState<
      'up' | 'down' | 'left' | 'right'
    >('up')
    const [isVisible, setIsVisible] = useState(true)

    const directions: Array<'up' | 'down' | 'left' | 'right'> = [
      'up',
      'down',
      'left',
      'right',
    ]

    return (
      <div style={{ width: '600px', height: '400px' }}>
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {directions.map(direction => (
            <CustomButton
              key={direction}
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => {
                  setActiveDirection(direction)
                  setIsVisible(true)
                }, 100)
              }}
              styles={{
                theme: 'light',
                // Active fill darkened blue-500 → blue-600 (#2563eb, the
                // --goobs-light-primary grade) so white label text clears 4.5:1
                // (was #3b82f6 = 3.68). Matching border darkened in lockstep.
                backgroundColor:
                  activeDirection === direction
                    ? 'rgba(37, 99, 235, 1)'
                    : 'rgba(255, 255, 255, 0.95)',
                color:
                  activeDirection === direction ? 'white' : 'rgb(55, 65, 81)',
                borderColor:
                  activeDirection === direction
                    ? 'rgba(37, 99, 235, 1)'
                    : 'rgba(226, 232, 240, 0.8)',
              }}
            >
              Slide {direction}
            </CustomButton>
          ))}
          <CustomButton
            onClick={() => setIsVisible(!isVisible)}
            styles={{ theme: 'dark' }}
          >
            Toggle
          </CustomButton>
        </div>

        <div
          style={{
            height: '300px',
            position: 'relative',
            overflow: 'hidden',
            border: '2px dashed #ccc',
            borderRadius: '8px',
          }}
        >
          <Slide
            styles={{
              in: isVisible,
              direction: activeDirection,
              theme: 'light',
              timeout: 400,
            }}
          >
            <Paper
              styles={{
                theme: 'light',
                padding: '30px',
                margin: '20px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Typography styles={{ variant: 'merrih4', theme: 'light' }}>
                  Sliding {activeDirection}!
                </Typography>
                <Typography
                  styles={{ variant: 'merriparagraph', theme: 'light' }}
                >
                  Current direction: <strong>{activeDirection}</strong>
                </Typography>
                <Typography
                  styles={{ variant: 'merrihelperfooter', theme: 'light' }}
                >
                  Click the direction buttons above to see different slide
                  effects.
                </Typography>
              </div>
            </Paper>
          </Slide>
        </div>
      </div>
    )
  },
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

    return (
      <div style={{ width: '500px', height: '350px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          {themes.map(theme => (
            <CustomButton
              key={theme}
              onClick={() => setCurrentTheme(theme)}
              styles={{
                theme: theme,
                // Active fill darkened blue-500 → blue-600 (#2563eb, the
                // --goobs-light-primary grade) so white label text clears 4.5:1
                // (was #3b82f6 = 3.68). Matching border darkened in lockstep.
                ...(currentTheme === theme
                  ? {
                      backgroundColor: 'rgba(37, 99, 235, 1)',
                      color: 'white',
                      borderColor: 'rgba(37, 99, 235, 1)',
                    }
                  : {}),
              }}
            >
              {theme} theme
            </CustomButton>
          ))}
          <CustomButton
            onClick={() => setIsVisible(!isVisible)}
            styles={{ theme: currentTheme }}
          >
            Toggle
          </CustomButton>
        </div>

        <div
          style={{ height: '250px', position: 'relative', overflow: 'hidden' }}
        >
          <Slide
            styles={{
              in: isVisible,
              direction: 'up',
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
                This slide component adapts to different theme configurations.
              </Typography>
            </Paper>
          </Slide>
        </div>
      </div>
    )
  },
}

/**
 * A11y — HIDDEN CONTENT IS INERT (WCAG 1.3.1 / 2.4.3 / 4.1.2).
 *
 * When `in` is false the content is not merely translated off-screen — the
 * module CSS also applies `visibility: hidden` (delayed by the slide duration so
 * the exit is still animated), which removes the slid-out content from BOTH the
 * accessibility tree and the keyboard tab order. This story wraps a real focusable
 * link inside the Slide: with the panel OUT, pressing Tab must NOT land on the
 * "Focusable link inside the panel" anchor; with it IN, the link is tabbable and
 * announced. A transform-only hide (the old behaviour) would leave that link
 * silently focusable off-screen.
 */
export const HiddenContentIsInert: Story = {
  render: function HiddenContentIsInertStory() {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <div style={{ width: '460px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <CustomButton
            onClick={() => setIsVisible(v => !v)}
            styles={{ theme: 'light' }}
          >
            {isVisible ? 'Slide out (make inert)' : 'Slide in (make reachable)'}
          </CustomButton>
          <a href="https://example.com" style={{ alignSelf: 'center' }}>
            Tab-order marker BEFORE the panel
          </a>
        </div>

        <div
          style={{ height: '160px', position: 'relative', overflow: 'hidden' }}
        >
          <Slide styles={{ in: isVisible, direction: 'up', theme: 'light' }}>
            <Paper styles={{ theme: 'light', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'light' }}>
                Panel content
              </Typography>
              <a href="https://example.com">Focusable link inside the panel</a>
            </Paper>
          </Slide>
        </div>

        <Typography styles={{ variant: 'merrihelperfooter', theme: 'light' }}>
          With the panel slid OUT, Tab skips the inner link (visibility:hidden).
          Slide it IN and the link joins the tab order and is announced.
        </Typography>
      </div>
    )
  },
}

/**
 * A11y — REDUCED MOTION (WCAG 2.3.3 Animation from Interactions).
 *
 * `Slide.module.css` carries an `@media (prefers-reduced-motion: reduce)` block
 * that collapses the transform + visibility transition to `none !important` (the
 * `!important` beats any caller-supplied inline `transition` shorthand). For users
 * with that OS preference the content snaps in/out with no sliding movement while
 * still toggling visibility correctly. Toggle your OS "reduce motion" setting (or
 * Storybook's a11y motion emulation) to observe: the panel below appears instantly
 * instead of sliding.
 */
export const ReducedMotion: Story = {
  render: function ReducedMotionStory() {
    const [isVisible, setIsVisible] = useState(true)

    return (
      <div style={{ width: '460px' }}>
        <CustomButton
          onClick={() => setIsVisible(v => !v)}
          styles={{ theme: 'light' }}
        >
          Toggle Slide
        </CustomButton>

        <div
          style={{
            height: '200px',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '16px',
          }}
        >
          <Slide
            styles={{
              in: isVisible,
              direction: 'right',
              theme: 'light',
              timeout: 600,
            }}
          >
            <Paper styles={{ theme: 'light', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'light' }}>
                Motion-safe slide
              </Typography>
              <Typography styles={{ variant: 'merriparagraph', theme: 'light' }}>
                With OS &ldquo;reduce motion&rdquo; on, this content appears and
                disappears instantly — the 600ms slide is neutralized.
              </Typography>
            </Paper>
          </Slide>
        </div>
      </div>
    )
  },
}

// Story with custom timing
export const CustomTiming: Story = {
  render: function CustomTimingStory() {
    const [isVisible, setIsVisible] = useState(true)
    const [duration, setDuration] = useState(300)

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <CustomButton
            onClick={() => setIsVisible(!isVisible)}
            styles={{ theme: 'light' }}
          >
            Toggle Slide
          </CustomButton>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              // Demo label sits directly on the sacred #0e0e0e canvas — follow
              // the sacred theme (composites to ~#e7e7e7, 15.6:1 contrast).
              color: 'var(--goobs-sacred-text)',
            }}
          >
            Duration:
            <input
              type="range"
              min="100"
              max="2000"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              style={{ width: '100px' }}
            />
            <span>{duration}ms</span>
          </label>
        </div>

        <div
          style={{ height: '200px', position: 'relative', overflow: 'hidden' }}
        >
          <Slide
            styles={{
              in: isVisible,
              direction: 'left',
              theme: 'sacred',
              timeout: duration,
            }}
          >
            <Paper styles={{ theme: 'sacred', padding: '20px' }}>
              <Typography styles={{ variant: 'merrih6', theme: 'sacred' }}>
                Custom Timing: {duration}ms
              </Typography>
              <Typography
                styles={{ variant: 'merriparagraph', theme: 'sacred' }}
              >
                Adjust the slider to change the animation duration.
              </Typography>
            </Paper>
          </Slide>
        </div>
      </div>
    )
  },
}
