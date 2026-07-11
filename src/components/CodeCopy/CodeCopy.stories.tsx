/**
 * @fileoverview Storybook stories for the CodeCopy component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, within, waitFor } from 'storybook/test'
import CodeCopy from './index'

const meta: Meta<typeof CodeCopy> = {
  title: 'Components/CodeCopy',
  component: CodeCopy,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    language: {
      control: { type: 'select' },
      options: [
        'javascript',
        'typescript',
        'css',
        'html',
        'json',
        'python',
        'java',
        'sql',
      ],
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof CodeCopy>

const jsCode = `function greet() {
  console.log("Hello, world!");
}`

const tsCode = `interface Person {
  name: string;
  age: number;
}

const user: Person = { 
  name: "Alice", 
  age: 25 
};

function createUser(name: string, age: number): Person {
  return { name, age };
}`

const reactCode = `import React, { useState } from 'react';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};`

const pythonCode = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`

// Deliberately over-wide lines so the <pre> becomes a horizontal-scroll
// container (overflow:auto) — exercises the keyboard-focusable scroll region.
const wideCode = `const config = { alpha: 1, beta: 2, gamma: 3, delta: 4, epsilon: 5, zeta: 6, eta: 7, theta: 8, iota: 9, kappa: 10, lambda: 11, mu: 12, nu: 13 };
export const veryLongFunctionNameThatForcesHorizontalOverflow = (firstArgument: string, secondArgument: number, thirdArgument: boolean, fourthArgument: string[]): void => {};`

const commonArgs = {
  code: reactCode,
  language: 'javascript',
}

export const LightTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>Light Theme:</strong> Clean and professional code display with
        light backgrounds and subtle shadows.
        <br />
        <strong>Features:</strong> Optimized for readability in bright
        environments, syntax highlighting, and copy functionality.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'light',
    },
  },
}

export const DarkTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Dark Theme:</strong> Developer-friendly dark mode with high
        contrast and reduced eye strain.
        <br />
        <strong>Features:</strong> Perfect for low-light environments, modern
        syntax highlighting, and smooth interactions.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'dark',
    },
  },
}

export const SacredTheme: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#FFD700' }}>
        <strong>Sacred Theme:</strong> Mystical and spiritual code display with
        sacred color palettes and ethereal aesthetics.
        <br />
        <strong>Features:</strong> Designed for contemplative coding sessions,
        sacred color schemes, and transcendent user experience.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    ...commonArgs,
    styles: {
      theme: 'sacred',
    },
  },
}

export const TypeScriptExample: Story = {
  name: 'TypeScript Example',
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>TypeScript Code:</strong> Showcasing TypeScript syntax
        highlighting with interfaces and type annotations.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    code: tsCode,
    language: 'typescript',
    styles: {
      theme: 'light',
    },
  },
}

export const PythonExample: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Python Code:</strong> Fibonacci sequence implementation with
        proper indentation and syntax highlighting.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    code: pythonCode,
    language: 'python',
    styles: {
      theme: 'dark',
    },
  },
}

export const WithoutLineNumbers: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#475569' }}>
        <strong>No Line Numbers:</strong> Clean code display without line
        numbers for simpler presentation.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    code: jsCode,
    language: 'javascript',
    styles: {
      theme: 'light',
      showLineNumbers: false,
    },
  },
}

/**
 * Disabled state — `styles.disabled` dims the block (opacity + grayscale),
 * blocks pointer events on the container, and renders the copy `<Button>` in
 * its native `disabled` state so it is programmatically inert for keyboard and
 * assistive-tech users, not merely visually greyed (WCAG 1.4.1: state is
 * conveyed by the disabled attribute, not colour alone).
 */
export const Disabled: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Disabled:</strong> Copy is unavailable — the block is dimmed and
        the copy button is a real disabled control.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    code: jsCode,
    language: 'javascript',
    styles: {
      theme: 'dark',
      disabled: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The copy control is exposed as a disabled button with an accessible name.
    const copyButton = await canvas.findByRole('button', { name: 'Copy code' })
    await expect(copyButton).toBeDisabled()
  },
}

/**
 * Accessibility regression guard. Verifies the pieces that make CodeCopy usable
 * by keyboard + screen-reader users and that have no purely-visual snapshot:
 *   - the icon-only copy button exposes a stable accessible NAME (WCAG 4.1.2);
 *   - a polite `role="status"` live region exists to announce the copy result
 *     (WCAG 4.1.3);
 *   - the decorative line-number column is hidden from assistive tech so it
 *     stays out of the code's reading order (WCAG 1.3.1).
 */
export const AccessibilityChecks: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    code: tsCode,
    language: 'typescript',
    styles: {
      theme: 'dark',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 1) Accessible name — findByRole resolves the button ONLY via its
    //    aria-label, since the visible content is a bare ⧉ glyph.
    const copyButton = await canvas.findByRole('button', { name: 'Copy code' })
    await expect(copyButton).toBeInTheDocument()
    await expect(copyButton).toHaveAttribute('type', 'button')

    // 2) A polite live region is present to announce the copy result.
    const status = canvasElement.querySelector('[role="status"]')
    await expect(status).toBeInTheDocument()
    await expect(status).toHaveAttribute('aria-live', 'polite')

    // 3) Line numbers are hidden from the accessibility tree.
    const container = canvasElement.querySelector('[data-component="CodeCopy"]')
    const hidden = container?.querySelector('[aria-hidden="true"]')
    await expect(hidden).toBeInTheDocument()
    // The digit "1" lives inside the aria-hidden line-number column, not the
    // readable code, so it must not be exposed as visible text to AT queries.
    await expect(hidden).toHaveTextContent('1')

    // 4) The copy button can receive keyboard focus (it renders the
    //    :focus-visible ring defined in CodeCopy.module.css).
    copyButton.focus()
    await expect(copyButton).toHaveFocus()
  },
}

/**
 * Keyboard-accessible scrollable code region (WCAG 2.1.1 Level A; axe
 * `scrollable-region-focusable`). When a code line is wider than the block the
 * `<pre>` becomes a horizontal-scroll container. It must be keyboard-focusable
 * so a keyboard-only user can arrow-scroll to read the clipped code, and it
 * must carry an accessible name (via a naming-capable `role="group"`, not a
 * bare `<pre>` which would make `aria-label` a prohibited attribute).
 */
export const WideScrollableCode: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Wide code:</strong> lines exceed the block width, so the code
        area scrolls horizontally. The scroll region is keyboard-focusable
        (Tab to it, then use arrow keys) and exposes an accessible name.
      </div>
      <div style={{ maxWidth: '480px' }}>
        <CodeCopy {...args} />
      </div>
    </div>
  ),
  args: {
    code: wideCode,
    language: 'typescript',
    styles: {
      theme: 'dark',
    },
  },
  play: async ({ canvasElement }) => {
    const pre = canvasElement.querySelector<HTMLPreElement>('pre')

    // The overflow measurement runs client-side after mount (ResizeObserver),
    // so the focus affordances appear asynchronously — wait for them. The
    // scroll container becomes keyboard-focusable (the axe
    // scrollable-region-focusable fix) and carries a naming-capable role +
    // accessible name so screen-reader users know what the focusable region is.
    await waitFor(() => {
      expect(pre).toHaveAttribute('tabindex', '0')
      expect(pre).toHaveAttribute('role', 'group')
      expect(pre).toHaveAttribute('aria-label', 'typescript code')
    })

    // It actually accepts focus (proves tabindex takes effect at runtime).
    pre?.focus()
    await expect(pre).toHaveFocus()
  },
}

/**
 * Narrow (non-scrolling) code is NOT a keyboard tab stop. The keyboard-focus
 * scroll affordances (tabindex / role="group" / aria-label) are gated to the
 * case where the `<pre>` actually overflows horizontally. A snippet that fits
 * its container keeps OUT of the tab order and is not announced as an empty
 * "group", so narrow code adds no tab-stop or screen-reader noise on the common
 * case (adversarial-review finding — over-application of the scroll-region fix).
 */
export const NarrowCodeNotFocusable: Story = {
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Narrow code:</strong> the lines fit the block, so the code area
        never scrolls. The `&lt;pre&gt;` is therefore not a tab stop and exposes
        no group role — nothing extra for keyboard or screen-reader users.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    code: jsCode,
    language: 'javascript',
    styles: {
      theme: 'dark',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Resolving the copy button proves the client component mounted; the
    // overflow measurement runs in the same lifecycle, so by the time the
    // assertions settle the (non-)scrollable decision has been made.
    await canvas.findByRole('button', { name: 'Copy code' })
    const pre = canvasElement.querySelector<HTMLPreElement>('pre')

    // jsCode fits its container → the scroll region never activates: no tab
    // stop, no group role, no accessible-name label.
    await waitFor(() => {
      expect(pre).not.toHaveAttribute('tabindex')
      expect(pre).not.toHaveAttribute('role')
      expect(pre).not.toHaveAttribute('aria-label')
    })
  },
}

/**
 * Copy-failure status (WCAG 4.1.3 Status Messages — the failure branch). When
 * both the async Clipboard API write AND the execCommand fallback fail, the
 * component must NOT leave the user believing the copy succeeded: it surfaces
 * an error glyph and announces "Copy failed" through the live region, instead
 * of the silent no-op the un-caught promise used to produce.
 */
export const CopyFailure: Story = {
  name: 'Copy Failure Announced',
  render: args => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#94a3b8' }}>
        <strong>Copy failure:</strong> both clipboard paths are stubbed to fail
        in this story, so activating copy reports an error rather than a false
        success.
      </div>
      <CodeCopy {...args} />
    </div>
  ),
  args: {
    code: jsCode,
    language: 'javascript',
    styles: {
      theme: 'dark',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const copyButton = await canvas.findByRole('button', { name: 'Copy code' })
    const status = canvasElement.querySelector('[role="status"]')

    // Force BOTH copy mechanisms to fail: the async write rejects, and the
    // execCommand fallback returns false. The component must then report an
    // error state instead of silently claiming success.
    const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(
      navigator,
      'clipboard'
    )
    const originalExecCommand = document.execCommand
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('blocked')) },
    })
    document.execCommand = () => false

    try {
      copyButton.click()
      // The live region announces the failure (not a false "Copied").
      await waitFor(() => expect(status).toHaveTextContent('Copy failed'))
      // And the visible glyph reflects the error, not the success check.
      await expect(copyButton).toHaveTextContent('✕')
    } finally {
      document.execCommand = originalExecCommand
      if (originalClipboardDescriptor) {
        Object.defineProperty(
          navigator,
          'clipboard',
          originalClipboardDescriptor
        )
      } else {
        delete (navigator as unknown as { clipboard?: unknown }).clipboard
      }
    }
  },
}
