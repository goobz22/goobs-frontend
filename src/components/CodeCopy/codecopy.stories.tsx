/**
 * @fileoverview Storybook stories for the CodeCopy component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs'
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
