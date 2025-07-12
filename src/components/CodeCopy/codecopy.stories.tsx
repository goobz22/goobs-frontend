/**
 * @fileoverview Storybook stories for the CodeCopy component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import CodeCopy from './index'

const meta: Meta<typeof CodeCopy> = {
  title: 'Components/CodeCopy',
  component: CodeCopy,
  argTypes: {
    language: {
      control: { type: 'select' },
      options: ['javascript', 'typescript', 'css', 'html', 'json'],
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
const user: Person = { name: "Alice", age: 25 };`

/** A premium-themed code block with JavaScript code. */
export const PremiumTheme: Story = {
  name: 'Premium Theme',
  args: {
    code: jsCode,
    language: 'javascript',
    styles: {
      theme: 'light',
    },
  },
}

/** A sacred-themed code block with TypeScript code. */
export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    code: tsCode,
    language: 'typescript',
    styles: {
      theme: 'sacred',
    },
  },
}
