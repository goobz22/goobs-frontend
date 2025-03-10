// src/components/CodeCopy/codecopy.stories.tsx

// Remove `import React from 'react'` because it's unused
import { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import CodeCopy from './index'

/**
 * Rename the default export to avoid 'meta' naming conflicts
 */
const metaConfig: Meta<typeof CodeCopy> = {
  title: 'Components/CodeCopy',
  component: CodeCopy,
  argTypes: {
    language: {
      control: { type: 'select' },
      options: [
        'javascript',
        'typescript',
        'css',
        'html',
        'json',
        // Add or remove languages based on your highlight.js usage
      ],
    },
  },
}
export default metaConfig

/**
 * Create a type for our stories
 */
type Story = StoryObj<typeof CodeCopy>

/**
 * 1) Basic example with JavaScript code
 *    - We do `await userEvent.click()`, so keep `async`.
 */
export const BasicCode: Story = {
  args: {
    code: `function greet() {
  console.log("Hello, world!");
}`,
    language: 'javascript',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Fix: Check for individual parts that may be split by syntax highlighting
    expect(canvas.getByText('function')).toBeInTheDocument()
    expect(canvas.getByText('greet')).toBeInTheDocument()

    // Fix: Check for "console" and "log" separately since they're split by syntax highlighting
    expect(canvas.getByText('console')).toBeInTheDocument()
    expect(canvas.getByText('log')).toBeInTheDocument()

    expect(canvas.getByText('"Hello, world!"')).toBeInTheDocument()

    // Try copying
    const copyButton = canvas.getByRole('button', { name: /copy code/i })
    await userEvent.click(copyButton)
    // (Optional) Confirm "Code copied" message or other side effects
  },
}

/**
 * 2) TypeScript code sample
 *    - No `await`, so remove `async`.
 */
export const TypeScriptExample: Story = {
  args: {
    code: `interface Person {
  name: string;
  age: number;
}
const user: Person = { name: "Alice", age: 25 };`,
    language: 'typescript',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Fix: Check for individual parts of the TypeScript code
    // These are separate elements due to syntax highlighting
    expect(canvas.getByText('interface')).toBeInTheDocument()

    // Use getAllByText for "Person" since it appears multiple times
    const personElements = canvas.getAllByText('Person')
    expect(personElements.length).toBe(2) // Verify we found both occurrences

    // Check for some type definitions
    expect(canvas.getByText('string')).toBeInTheDocument()
    expect(canvas.getByText('number')).toBeInTheDocument()

    // Check for the variable assignment
    expect(canvas.getByText('const')).toBeInTheDocument()
    expect(canvas.getByText('user')).toBeInTheDocument()
    expect(canvas.getByText('"Alice"')).toBeInTheDocument()
    expect(canvas.getByText('25')).toBeInTheDocument()
  },
}

/**
 * 3) JSON code sample
 *    - No `await`, so remove `async`.
 */
export const JSONExample: Story = {
  args: {
    code: `{
  "name": "example",
  "version": "1.0.0",
  "dependencies": {}
}`,
    language: 'json',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Fix: Use a more flexible approach to find elements when they're syntax highlighted
    // Look for the attribute name "name" and string value "example" separately
    expect(canvas.getByText('"name"')).toBeInTheDocument()
    expect(canvas.getByText('"example"')).toBeInTheDocument()

    // Also verify version exists
    expect(canvas.getByText('"version"')).toBeInTheDocument()
    expect(canvas.getByText('"1.0.0"')).toBeInTheDocument()
  },
}

/**
 * 4) Large Code Block
 *    - No `await`, so remove `async`.
 */
export const LargeCodeBlock: Story = {
  args: {
    code: `// A large sample of code
function example() {
  // This is a multi-line sample
  const items = [1, 2, 3, 4, 5];
  items.forEach(item => {
    console.log(item);
  });
}
// Some more lines
class Test {
  constructor() {
    this.value = 42;
  }
  getValue() {
    return this.value;
  }
}`,
    language: 'javascript',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Check for comments which should be single elements
    expect(canvas.getByText('// A large sample of code')).toBeInTheDocument()

    // Add more checks for other code parts that might be split
    expect(canvas.getByText('function')).toBeInTheDocument()
    expect(canvas.getByText('example')).toBeInTheDocument()
    expect(canvas.getByText('class')).toBeInTheDocument()
    expect(canvas.getByText('Test')).toBeInTheDocument()
    expect(canvas.getByText('42')).toBeInTheDocument()
  },
}
