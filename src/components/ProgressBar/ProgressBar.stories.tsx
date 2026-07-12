import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState, useEffect } from 'react'
import { within, expect } from 'storybook/test'
import ProgressBar from './index'

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile progress bar component that supports both determinate (with specific progress value) and indeterminate (loading) modes across light, dark, and sacred themes. Features enhanced animations, stripes, pulse effects, and modern styling.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value from 0-100 for determinate mode',
    },
    variant: {
      control: { type: 'select' },
      options: ['determinate', 'indeterminate'],
      description: 'Variant of the progress bar',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Show progress label/percentage',
    },
    label: {
      control: { type: 'text' },
      description: 'Custom label text (overrides default percentage)',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'ARIA label for accessibility',
    },
    styles: {
      control: { type: 'object' },
      description:
        'Comprehensive styling options including striped, animated, and pulse effects',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={65}
        variant="determinate"
        showLabel
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        variant="indeterminate"
        showLabel
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

export const StripedAnimated: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={75}
        variant="determinate"
        showLabel
        styles={{ theme: 'light', striped: true, animated: true }}
      />
    </div>
  ),
}

export const PulseEffect: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={60}
        variant="determinate"
        showLabel
        styles={{ theme: 'light', pulse: true }}
      />
    </div>
  ),
}

export const LightTheme: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={45}
        variant="determinate"
        showLabel
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

export const DarkTheme: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#1f2937',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={45}
        variant="determinate"
        showLabel
        styles={{ theme: 'dark' }}
      />
    </div>
  ),
}

export const SacredTheme: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={45}
        variant="determinate"
        showLabel
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

export const SacredIndeterminate: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        variant="indeterminate"
        showLabel
        styles={{ theme: 'sacred' }}
      />
    </div>
  ),
}

export const CustomLabel: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={80}
        variant="determinate"
        showLabel
        label="Processing files..."
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

export const CustomSize: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={70}
        variant="determinate"
        showLabel
        styles={{ theme: 'light', width: '400px', height: '24px' }}
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      <ProgressBar
        value={50}
        variant="determinate"
        showLabel
        styles={{ theme: 'light', disabled: true }}
      />
    </div>
  ),
}

export const EnhancedFeatures: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
      }}
    >
      <div>
        <h4>Standard Progress</h4>
        <ProgressBar value={65} showLabel styles={{ theme: 'light' }} />
      </div>
      <div>
        <h4>Striped Progress</h4>
        <ProgressBar
          value={75}
          showLabel
          styles={{ theme: 'light', striped: true }}
        />
      </div>
      <div>
        <h4>Animated Stripes</h4>
        <ProgressBar
          value={85}
          showLabel
          styles={{ theme: 'light', striped: true, animated: true }}
        />
      </div>
      <div>
        <h4>Pulse Effect</h4>
        <ProgressBar
          value={60}
          showLabel
          styles={{ theme: 'light', pulse: true }}
        />
      </div>
      <div>
        <h4>All Effects Combined</h4>
        <ProgressBar
          value={70}
          showLabel
          styles={{
            theme: 'light',
            striped: true,
            animated: true,
            pulse: true,
          }}
        />
      </div>
    </div>
  ),
  // Every section renders theme:'light' content with no wrapper surface —
  // pin the light canvas so h4s/labels aren't judged against the sacred
  // #0e0e0e default. (h4 #000 on #fff = 21.0; label #374151 on #fff = 10.31)
  globals: { backgrounds: { value: 'light' } },
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of enhanced visual features including stripes, animations, and pulse effects.',
      },
    },
  },
}

const LoadingSimulationComponent = () => {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [stage, setStage] = useState('Initializing...')

  useEffect(() => {
    const stages = [
      { label: 'Initializing...', duration: 800 },
      { label: 'Loading configuration...', duration: 1200 },
      { label: 'Connecting to server...', duration: 1500 },
      { label: 'Fetching data...', duration: 2000 },
      { label: 'Processing results...', duration: 1000 },
      { label: 'Finalizing...', duration: 600 },
    ]

    let currentStage = 0
    let currentProgress = 0

    const updateProgress = () => {
      if (currentStage < stages.length) {
        const stageProgress = 100 / stages.length
        const targetProgress = (currentStage + 1) * stageProgress

        // Current stage is within bounds due to the guard; assert non-null for TS
        setStage(stages[currentStage]!.label)

        const interval = setInterval(() => {
          currentProgress += 2
          setProgress(currentProgress)

          if (currentProgress >= targetProgress) {
            clearInterval(interval)
            currentStage++

            if (currentStage < stages.length) {
              setTimeout(updateProgress, 200)
            } else {
              setIsLoading(false)
              setStage('Complete!')
            }
          }
        }, 50)
      }
    }

    const timer = setTimeout(updateProgress, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleRestart = () => {
    setProgress(0)
    setIsLoading(true)
    setStage('Initializing...')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
      }}
    >
      <h3 style={{ margin: 0, color: '#374151' }}>Loading Simulation</h3>

      <div>
        <div
          style={{ marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}
        >
          {stage}
        </div>
        <ProgressBar
          value={progress}
          variant={isLoading ? 'determinate' : 'determinate'}
          showLabel
          styles={{
            theme: 'light',
            striped: true,
            animated: isLoading,
            pulse: progress > 0 && progress < 100,
          }}
        />
      </div>

      {!isLoading && (
        <button
          onClick={handleRestart}
          style={{
            padding: '8px 16px',
            // blue-600 (#2563eb): white text = 5.17 (blue-500 #3b82f6 = 3.68, fails)
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Restart Simulation
        </button>
      )}
    </div>
  )
}

export const LoadingSimulation: Story = {
  render: () => <LoadingSimulationComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive loading simulation that demonstrates real-world usage with multiple stages and dynamic progress updates.',
      },
    },
  },
}

const FileUploadSimulationComponent = () => {
  const [uploads, setUploads] = useState([
    { id: 1, name: 'document.pdf', progress: 0, status: 'waiting' },
    { id: 2, name: 'image.jpg', progress: 0, status: 'waiting' },
    { id: 3, name: 'video.mp4', progress: 0, status: 'waiting' },
  ])

  useEffect(() => {
    const uploadFile = (fileIndex: number) => {
      const interval = setInterval(() => {
        setUploads(prev => {
          const newUploads = [...prev]
          const file = newUploads[fileIndex]

          // Guard against out-of-bounds index per noUncheckedIndexedAccess
          if (!file) return newUploads

          if (file.status === 'waiting') {
            file.status = 'uploading'
          }

          if (file.status === 'uploading') {
            file.progress += Math.random() * 8 + 2

            if (file.progress >= 100) {
              file.progress = 100
              file.status = 'completed'
              clearInterval(interval)

              // Start next file
              if (fileIndex + 1 < newUploads.length) {
                setTimeout(() => uploadFile(fileIndex + 1), 500)
              }
            }
          }

          return newUploads
        })
      }, 100)
    }

    const timer = setTimeout(() => uploadFile(0), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleRestart = () => {
    setUploads([
      { id: 1, name: 'document.pdf', progress: 0, status: 'waiting' },
      { id: 2, name: 'image.jpg', progress: 0, status: 'waiting' },
      { id: 3, name: 'video.mp4', progress: 0, status: 'waiting' },
    ])
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '400px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
      }}
    >
      <h3 style={{ margin: 0, color: '#374151' }}>File Upload Progress</h3>

      {uploads.map(file => (
        <div
          key={file.id}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '14px', color: '#374151' }}>
              {file.name}
            </span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {file.status}
            </span>
          </div>
          <ProgressBar
            value={file.progress}
            variant={
              file.status === 'uploading' ? 'determinate' : 'determinate'
            }
            showLabel={file.status === 'uploading'}
            styles={{
              theme: 'light',
              striped: file.status === 'uploading',
              animated: file.status === 'uploading',
            }}
          />
        </div>
      ))}

      <button
        onClick={handleRestart}
        style={{
          padding: '8px 16px',
          // blue-600 (#2563eb): white text = 5.17 (blue-500 #3b82f6 = 3.68, fails)
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          marginTop: '10px',
        }}
      >
        Restart Upload
      </button>
    </div>
  )
}

export const FileUploadSimulation: Story = {
  render: () => <FileUploadSimulationComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'File upload simulation showing multiple progress bars with different states and sequential processing.',
      },
    },
  },
}

/**
 * Accessibility showcase — anchors the a11y contract as a regression test.
 *
 * Determinate exposes role="progressbar" with aria-valuemin/max/now and an
 * aria-valuetext ("65 percent"); indeterminate OMITS aria-valuenow/min/max
 * (the correct ARIA signal for an unknown value) and sets
 * aria-valuetext="Loading". The visible label is aria-hidden because it only
 * duplicates aria-valuetext (prevents a double screen-reader announcement).
 *
 * The DOM/ARIA half of that contract cannot be observed by a Chromatic visual
 * snapshot (pixels can't see attributes), so the `play` function below is what
 * gates it: it asserts role="progressbar", the determinate aria-valuenow/min/max
 * + aria-valuetext, the indeterminate OMISSION of aria-valuenow/min/max, and the
 * aria-hidden="true" on every visible label (Issue 2). Removing aria-hidden or
 * breaking aria-valuenow fails this story under the Storybook test-runner
 * (`bun test-storybook`). Chromatic still gates the *visual* default-motion
 * rendering of the same states.
 *
 * This story captures the DEFAULT-motion baseline. Every looping/moving effect
 * here (the indeterminate sweep, stripe scroll, and pulse rings) is neutralized
 * under `@media (prefers-reduced-motion: reduce)`; that reduced-motion rendering
 * is anchored as its OWN Chromatic baseline by the sibling
 * `AccessibilityReducedMotion` story (which forces the media feature via
 * `chromatic.prefersReducedMotion` — Chromatic only pauses animations and does
 * NOT emulate reduced motion by default, so it needs a dedicated snapshot). The
 * indeterminate bar keeps a gentle opacity pulse there so a loading state is
 * still conveyed without vestibular motion.
 */
export const AccessibilityShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
      }}
    >
      <div>
        <h4>Determinate — value announced via aria-valuenow + aria-valuetext</h4>
        <ProgressBar
          value={65}
          variant="determinate"
          showLabel
          aria-label="Upload progress"
          styles={{ theme: 'light' }}
        />
      </div>
      <div>
        <h4>Indeterminate — aria-valuenow omitted, aria-valuetext is Loading</h4>
        <ProgressBar
          variant="indeterminate"
          showLabel
          aria-label="Loading data"
          styles={{ theme: 'light' }}
        />
      </div>
      <div>
        <h4>Pulse + striped — motion neutralized under prefers-reduced-motion</h4>
        <ProgressBar
          value={60}
          variant="determinate"
          showLabel
          styles={{ theme: 'light', striped: true, animated: true, pulse: true }}
        />
      </div>
    </div>
  ),
  // theme:'light' content with no wrapper surface — pin the light canvas so the
  // h4s aren't judged against the sacred #0e0e0e default (h4 #000 on #fff = 21.0).
  globals: { backgrounds: { value: 'light' } },
  // Regression-gate the DOM/ARIA contract that a Chromatic pixel snapshot cannot
  // see. Runs under the Storybook test-runner (`bun test-storybook`): removing
  // the aria-hidden label (Issue 2) or breaking the determinate aria-valuenow /
  // the indeterminate omission fails here, so the contract can't silently rot.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Determinate bar: role="progressbar" carrying the full numeric value
    // contract — aria-valuenow/min/max + a human-readable aria-valuetext.
    const determinate = canvas.getByRole('progressbar', {
      name: 'Upload progress',
    })
    await expect(determinate).toHaveAttribute('aria-valuenow', '65')
    await expect(determinate).toHaveAttribute('aria-valuemin', '0')
    await expect(determinate).toHaveAttribute('aria-valuemax', '100')
    await expect(determinate).toHaveAttribute('aria-valuetext', '65 percent')

    // Indeterminate bar: aria-valuenow AND aria-valuemin/max are OMITTED (the
    // ARIA-defined signal for an unknown value), with aria-valuetext="Loading"
    // carrying the state instead.
    const indeterminate = canvas.getByRole('progressbar', {
      name: 'Loading data',
    })
    await expect(indeterminate).not.toHaveAttribute('aria-valuenow')
    await expect(indeterminate).not.toHaveAttribute('aria-valuemin')
    await expect(indeterminate).not.toHaveAttribute('aria-valuemax')
    await expect(indeterminate).toHaveAttribute('aria-valuetext', 'Loading')

    // Every visible label only duplicates aria-valuetext, so it is aria-hidden
    // and does NOT re-announce the value (Issue 2). The node stays in the DOM
    // (data-testid preserved) for sighted users and the test-selector contract.
    const labels = canvas.getAllByTestId('progress-bar-label')
    await expect(labels).toHaveLength(3)
    for (const label of labels) {
      await expect(label).toHaveAttribute('aria-hidden', 'true')
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'Screen-reader ARIA contract and reduced-motion behavior of the ProgressBar: correct progressbar roles/values for determinate vs indeterminate, an aria-hidden visible label, and prefers-reduced-motion neutralizing the looping animations. A play function asserts the role/aria-valuenow/aria-valuetext and aria-hidden-label contract under the Storybook test-runner.',
      },
    },
  },
}

/**
 * Reduced-motion Chromatic baseline — captures the actual
 * `@media (prefers-reduced-motion: reduce)` rendering.
 *
 * `parameters.chromatic.prefersReducedMotion: 'reduce'` makes Chromatic emulate
 * the OS "Reduce motion" setting for this snapshot (media-feature emulation, see
 * the `@chromatic-com/storybook` `prefersReducedMotion` parameter). Without it,
 * Chromatic only pauses animations and NEVER activates `prefers-reduced-motion`,
 * so the reduced-motion CSS block would ship with zero automated guard — this
 * story is what turns it into a real regression baseline (goobs' only regression
 * net is the Chromatic story).
 *
 * Each bar exercises a distinct selector in the reduced-motion block: the
 * determinate fill transition is dropped (the fill jumps to value), the
 * striped+animated and pulse determinate loops are turned off, and the
 * indeterminate horizontal sweep + stripe scroll are replaced by the motion-free
 * `progressReducedMotionPulse` opacity fade so a loading state stays perceivable
 * without vestibular motion. A break in the neutralization (e.g. the sweep
 * returning) shifts these pixels and fails the baseline.
 */
export const AccessibilityReducedMotion: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '400px',
      }}
    >
      <div>
        <h4>Indeterminate — sweep replaced by a motion-free opacity pulse</h4>
        <ProgressBar
          variant="indeterminate"
          showLabel
          aria-label="Loading data"
          styles={{ theme: 'light' }}
        />
      </div>
      <div>
        <h4>Striped indeterminate — stripe scroll + sweep neutralized</h4>
        <ProgressBar
          variant="indeterminate"
          showLabel
          aria-label="Loading data"
          styles={{ theme: 'light', striped: true }}
        />
      </div>
      <div>
        <h4>Striped + animated determinate — stripe scroll off, fill jumps</h4>
        <ProgressBar
          value={60}
          variant="determinate"
          showLabel
          styles={{ theme: 'light', striped: true, animated: true }}
        />
      </div>
      <div>
        <h4>Pulse determinate — pulse rings off</h4>
        <ProgressBar
          value={60}
          variant="determinate"
          showLabel
          styles={{ theme: 'light', pulse: true }}
        />
      </div>
      <div>
        <h4>Pulse + striped + animated — all determinate loops off</h4>
        <ProgressBar
          value={60}
          variant="determinate"
          showLabel
          styles={{ theme: 'light', striped: true, animated: true, pulse: true }}
        />
      </div>
    </div>
  ),
  // theme:'light' content with no wrapper surface — pin the light canvas so the
  // h4s aren't judged against the sacred #0e0e0e default (h4 #000 on #fff = 21.0).
  globals: { backgrounds: { value: 'light' } },
  parameters: {
    // Force the prefers-reduced-motion media feature ONLY for this snapshot so
    // Chromatic captures the reduced-motion CSS path (default snapshots stay
    // full-motion). This is the automated guard for the @media block.
    chromatic: { prefersReducedMotion: 'reduce' },
    docs: {
      description: {
        story:
          'Reduced-motion rendering of the ProgressBar, captured as a Chromatic baseline via `chromatic.prefersReducedMotion: "reduce"`: the determinate fill transition and the striped/pulse loops are neutralized, and the indeterminate sweep is replaced by a motion-free opacity pulse. Anchors the `@media (prefers-reduced-motion: reduce)` CSS so a regression in the neutralization is caught by the visual baseline.',
      },
    },
  },
}

export const ThemeComparison: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '400px',
      }}
    >
      {/* Mixed-theme story: each block carries its own themed surface, so the
          light block gets a light wrapper instead of sitting on the sacred
          canvas. (h4 #1f2937 on #f8f9fa = 13.93; label #374151 = 9.78) */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ color: '#1f2937', margin: '0 0 10px 0' }}>Light Theme</h4>
        <ProgressBar
          value={60}
          showLabel
          styles={{ theme: 'light', striped: true, animated: true }}
        />
      </div>
      <div
        style={{
          padding: '20px',
          backgroundColor: '#1f2937',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>Dark Theme</h4>
        <ProgressBar
          value={60}
          showLabel
          styles={{ theme: 'dark', striped: true, animated: true }}
        />
      </div>
      <div
        style={{
          padding: '20px',
          backgroundColor: '#0a0a0a',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ color: '#FFD700', margin: '0 0 10px 0' }}>Sacred Theme</h4>
        <ProgressBar
          value={60}
          showLabel
          styles={{ theme: 'sacred', striped: true, animated: true }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of all three themes with enhanced striped and animated effects.',
      },
    },
  },
}
