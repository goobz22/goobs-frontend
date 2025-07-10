// src/components/CodeCopy/codecopy.stories.tsx

import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import CodeCopy from './index'

const meta: Meta<typeof CodeCopy> = {
  title: 'Components/CodeCopy',
  component: CodeCopy,
  argTypes: {
    language: {
      control: { type: 'select' },
      options: ['javascript', 'typescript', 'css', 'html', 'json'],
    },
    sacredtheme: { control: 'boolean' },
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

export const PremiumTheme: Story = {
  name: 'Premium Theme',
  args: {
    code: jsCode,
    language: 'javascript',
    sacredtheme: false,
  },
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  args: {
    code: tsCode,
    language: 'typescript',
    sacredtheme: true,
  },
}

const InteractiveDemoComponent: React.FC = () => {
  const [sacred, setSacred] = React.useState(false)
  const [lang, setLang] = React.useState('javascript')
  const codeMap: { [key: string]: string } = {
    javascript: jsCode,
    typescript: tsCode,
  }

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 100,
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Controls</h3>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={sacred}
            onChange={e => setSacred(e.target.checked)}
          />
          <span style={{ marginLeft: '0.5rem' }}>Sacred Theme</span>
        </label>
      </div>
      <CodeCopy code={codeMap[lang]} language={lang} sacredtheme={sacred} />
    </div>
  )
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => <InteractiveDemoComponent />,
}
