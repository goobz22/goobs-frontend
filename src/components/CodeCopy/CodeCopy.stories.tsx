/**
 * @fileoverview Storybook stories for the CodeCopy component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, within } from 'storybook/test'
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
