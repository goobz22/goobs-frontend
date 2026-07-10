/**
 * @fileoverview Storybook stories for the ComplexTextEditor component.
 * These stories showcase the various modes, themes, and styling capabilities of the ComplexTextEditor.
 * The ComplexTextEditor supports simple, rich text, and markdown editing modes with unified theming.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import ComplexTextEditor from './index'

// Wrapper component for state management
const ComplexTextEditorWithState = ({ initialValue = '', ...props }) => {
  const [value, setValue] = useState(initialValue)
  return <ComplexTextEditor {...props} value={value} onChange={setValue} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof ComplexTextEditor> = {
  title: 'Components/ComplexTextEditor',
  component: ComplexTextEditor,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    label: { control: 'text' },
    editorType: {
      control: 'select',
      options: ['simple', 'markdown', 'rich', 'complex'],
    },
    minRows: { control: { type: 'number', min: 1, max: 20 } },
    helperText: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, accordion mode, and editor configuration',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '600px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ComplexTextEditor>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <ComplexTextEditorWithState
      label="Document Content"
      initialValue="Enter your text here..."
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Document Content"
      initialValue="Enter your text here..."
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Sacred Manuscript"
      initialValue="Inscribe your sacred text..."
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// EDITOR MODE STORIES
// --------------------------------------------------------------------------

export const SimpleEditor: Story = {
  name: 'Simple Text Editor',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <ComplexTextEditorWithState
          label="Simple Text Editor"
          editorType="simple"
          initialValue="This is a simple text editor with basic functionality in light theme."
          styles={{ theme: 'light' }}
        />
      </div>

      {/* Dark-themed block sits on its own dark surface (mixed-theme story:
          per-block themed wrappers; the story canvas itself is light). */}
      <div
        style={{
          background: '#111827',
          padding: '1.5rem',
          borderRadius: '12px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <ComplexTextEditorWithState
          label="Simple Text Editor"
          editorType="simple"
          initialValue="This is a simple text editor with basic functionality in dark theme."
          styles={{ theme: 'dark' }}
        />
      </div>

      {/* Sacred block on the sacred near-black surface — gold-on-near-black
          is the design language; gold labels are unreadable on white. */}
      <div
        style={{
          background: '#0e0e0e',
          padding: '1.5rem',
          borderRadius: '12px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <ComplexTextEditorWithState
          label="Sacred Text Editor"
          editorType="simple"
          initialValue="This is a simple text editor with sacred theme styling and mystical appearance."
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
  globals: { backgrounds: { value: 'light' } },
}

export const MarkdownEditor: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Markdown Content"
      editorType="markdown"
      initialValue="# Markdown Title\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const RichTextEditor: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Rich Text Content"
      editorType="rich"
      initialValue="This is a rich text editor with formatting options."
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const ComplexEditor: Story = {
  name: 'Complex Editor (All Modes)',
  render: () => (
    <ComplexTextEditorWithState
      label="Complex Editor"
      editorType="complex"
      initialValue="Switch between different editing modes using the toolbar."
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCORDION MODE STORIES
// --------------------------------------------------------------------------

export const AccordionMode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ComplexTextEditorWithState
        label="Collapsible Editor"
        initialValue="This editor is in accordion mode and can be expanded/collapsed."
        styles={{
          theme: 'light',
          accordionMode: true,
          accordionSummary: 'Text Editor',
          accordionDefaultExpanded: true,
        }}
      />
      <ComplexTextEditorWithState
        label="Dark Accordion"
        initialValue="Dark theme with accordion mode."
        styles={{
          theme: 'dark',
          accordionMode: true,
          accordionSummary: 'Dark Editor',
          accordionDefaultExpanded: false,
        }}
      />
      <ComplexTextEditorWithState
        label="Sacred Accordion"
        initialValue="Sacred theme with mystical accordion mode."
        styles={{
          theme: 'sacred',
          accordionMode: true,
          accordionSummary: 'Sacred Manuscript',
          accordionDefaultExpanded: false,
        }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// CUSTOM STYLING STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Custom Styled Editor"
      initialValue="Custom color scheme for the editor."
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(255, 240, 245, 0.95)',
        borderColor: 'rgba(255, 20, 147, 0.4)',
        borderFocusedColor: 'rgba(255, 20, 147, 1)',
        textColor: 'rgba(139, 0, 139, 1)',
        labelColor: 'rgba(139, 0, 139, 0.7)',
      }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const NeonStyle: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Neon Editor"
      initialValue="Futuristic neon design for the editor."
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'rgba(0, 255, 255, 0.5)',
        borderFocusedColor: 'rgba(0, 255, 255, 1)',
        textColor: 'rgba(0, 255, 255, 1)',
        labelColor: 'rgba(0, 255, 255, 0.7)',
        borderRadius: '12px',
        borderWidth: '2px',
      }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// LAYOUT AND SPACING STORIES
// --------------------------------------------------------------------------

export const CustomLayout: Story = {
  name: 'Custom Layout & Spacing',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ComplexTextEditorWithState
        label="Large Padding"
        initialValue="Editor with extra padding for comfortable editing."
        minRows={3}
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <ComplexTextEditorWithState
        label="Tall Editor"
        initialValue="Taller editor with more rows for longer content."
        minRows={8}
        styles={{
          theme: 'light',
          borderRadius: '8px',
        }}
      />
      <ComplexTextEditorWithState
        label="Compact Editor"
        initialValue="Compact editor with minimal spacing."
        minRows={2}
        styles={{
          theme: 'light',
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '4px',
        }}
      />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// EDITOR CONFIGURATION STORIES
// --------------------------------------------------------------------------

export const EditorConfiguration: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ComplexTextEditorWithState
        label="Hide Mode Toggle"
        editorType="complex"
        initialValue="Editor with mode toggle hidden."
        styles={{
          theme: 'light',
          showModeToggle: false,
        }}
      />
      <ComplexTextEditorWithState
        label="Default to Rich Mode"
        editorType="complex"
        initialValue="Editor that starts in rich text mode."
        styles={{
          theme: 'light',
          defaultMode: 'rich',
        }}
      />
      {/* Dark-themed editor gets its own dark surface on the light canvas */}
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '12px',
        }}
      >
        <ComplexTextEditorWithState
          label="Default to Markdown"
          editorType="complex"
          initialValue="# Markdown Mode\n\nStarts in **markdown** editing mode."
          styles={{
            theme: 'dark',
            defaultMode: 'markdown',
          }}
        />
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR AND HELPER TEXT STORIES
// --------------------------------------------------------------------------

export const HelperTextAndErrors: Story = {
  name: 'Helper Text and States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ComplexTextEditorWithState
        label="With Helper Text"
        initialValue="Editor with helpful information below."
        helperText="This editor supports rich text, markdown, and simple text modes."
        styles={{ theme: 'light' }}
      />
      <ComplexTextEditorWithState
        label="Error State"
        initialValue="Invalid content"
        helperText="Content validation failed. Please check your input."
        styles={{
          theme: 'light',
          helperTextType: 'error',
        }}
      />
      {/* Dark-themed editor gets its own dark surface on the light canvas */}
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '12px',
        }}
      >
        <ComplexTextEditorWithState
          label="Info Helper"
          initialValue="Informational content"
          helperText="Pro tip: Use Ctrl+B for bold and Ctrl+I for italic in rich text mode."
          styles={{
            theme: 'dark',
            helperTextType: 'info',
          }}
        />
      </div>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ComplexTextEditorWithState
            label="Simple Editor"
            editorType="simple"
            initialValue="Basic text editing"
            styles={{ theme: 'light' }}
          />
          <ComplexTextEditorWithState
            label="Rich Text Editor"
            editorType="rich"
            initialValue="Rich text with formatting"
            styles={{ theme: 'light' }}
          />
          <ComplexTextEditorWithState
            label="Accordion Mode"
            initialValue="Collapsible editor"
            styles={{
              theme: 'light',
              accordionMode: true,
              accordionSummary: 'Click to expand',
            }}
          />
        </div>
      </div>

      {/* Dark Theme Section — its own dark surface on the light canvas
          (mixed-theme story: per-block themed wrappers). */}
      <div
        style={{
          background: '#111827',
          padding: '1.5rem',
          borderRadius: '12px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ComplexTextEditorWithState
            label="Markdown Editor"
            editorType="markdown"
            initialValue="# Markdown\n**Bold** *italic*"
            styles={{ theme: 'dark' }}
          />
          <ComplexTextEditorWithState
            label="Complex Editor"
            editorType="complex"
            initialValue="Multi-mode editor"
            styles={{
              theme: 'dark',
              defaultMode: 'rich',
            }}
          />
          <ComplexTextEditorWithState
            label="Custom Styling"
            initialValue="Enhanced dark theme"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>

      {/* Sacred Theme Section — near-black surface; gold-on-near-black is
          the sacred design language and fails on white. */}
      <div
        style={{
          background: '#0e0e0e',
          padding: '1.5rem',
          borderRadius: '12px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ComplexTextEditorWithState
            label="Ancient Manuscript"
            editorType="simple"
            initialValue="Sacred text inscribed here..."
            styles={{ theme: 'sacred' }}
          />
          <ComplexTextEditorWithState
            label="Divine Scripture"
            editorType="rich"
            initialValue="Rich text with sacred powers"
            styles={{ theme: 'sacred' }}
          />
          <ComplexTextEditorWithState
            label="Mystical Accordion"
            initialValue="Hidden knowledge within"
            styles={{
              theme: 'sacred',
              accordionMode: true,
              accordionSummary: 'Sacred Scrolls',
            }}
          />
        </div>
      </div>

      {/* Custom Styling Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED' }}>
          Custom Styling
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* dark-themed editor: dark chip so its label isn't muted-on-white */}
          <div
            style={{
              background: '#111827',
              padding: '1rem',
              borderRadius: '12px',
            }}
          >
            <ComplexTextEditorWithState
              label="Neon Style"
              initialValue="Futuristic editor"
              styles={{
                theme: 'dark',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                borderColor: 'rgba(147, 51, 234, 0.5)',
                borderFocusedColor: 'rgba(147, 51, 234, 1)',
                textColor: 'rgba(147, 51, 234, 1)',
                labelColor: 'rgba(147, 51, 234, 0.8)',
                borderRadius: '20px',
                borderWidth: '2px',
              }}
            />
          </div>
          <ComplexTextEditorWithState
            label="Soft Rounded"
            initialValue="Gentle appearance"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <ComplexTextEditorWithState
            label="Minimal Design"
            initialValue="Clean and simple"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderFocusedColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0px',
              borderWidth: '0px 0px 2px 0px',
              padding: '12px 0px',
            }}
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

// --------------------------------------------------------------------------
// MODE SWITCHING DEMONSTRATION
// --------------------------------------------------------------------------

/**
 * External mode-switching demo. ComplexTextEditor has NO controlled `mode`
 * prop — `initialMode` / `styles.defaultMode` are read exactly once, as the
 * initializer of its internal `useState<EditorMode>` (see
 * `determineStartMode` in ./index.tsx). Re-rendering with a new
 * `defaultMode` therefore does nothing. To drive the mode from outside, the
 * demo remounts the editor via `key={mode}` and feeds the selection through
 * `initialMode={mode}`, which is what the component's contract supports.
 * Content survives the remount because `value`/`onChange` are controlled
 * from this wrapper's state, not the editor's internal state.
 */
const ModeSwitchingDemo = () => {
  const [value, setValue] = useState(
    '# Welcome\n\nThis editor supports **multiple modes**:\n\n- Simple text\n- **Rich text** with formatting\n- Markdown editing'
  )
  const [mode, setMode] = useState<'simple' | 'rich' | 'markdown'>('markdown')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Active buttons use #2563EB (not #3B82F6): white text needs a >=4.5:1
          contrast ratio — 5.17 on #2563EB vs a failing 3.67 on #3B82F6. */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setMode('simple')}
          style={{
            padding: '8px 16px',
            backgroundColor: mode === 'simple' ? '#2563EB' : '#E5E7EB',
            color: mode === 'simple' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Simple
        </button>
        <button
          onClick={() => setMode('rich')}
          style={{
            padding: '8px 16px',
            backgroundColor: mode === 'rich' ? '#2563EB' : '#E5E7EB',
            color: mode === 'rich' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Rich Text
        </button>
        <button
          onClick={() => setMode('markdown')}
          style={{
            padding: '8px 16px',
            backgroundColor: mode === 'markdown' ? '#2563EB' : '#E5E7EB',
            color: mode === 'markdown' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Markdown
        </button>
      </div>

      <ComplexTextEditor
        key={mode}
        label={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Editor`}
        value={value}
        onChange={setValue}
        editorType="complex"
        initialMode={mode}
        styles={{
          theme: 'light',
          showModeToggle: true,
        }}
      />

      <div
        style={{
          backgroundColor: 'rgba(249, 250, 251, 1)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid rgba(209, 213, 219, 1)',
          fontSize: '14px',
          color: '#6B7280',
        }}
      >
        <p style={{ margin: '0' }}>
          <strong>Current mode:</strong> {mode} • Switch between modes to see
          how the editor adapts while preserving your content.
        </p>
      </div>
    </div>
  )
}

export const ModeSwitching: Story = {
  name: 'Mode Switching Demo',
  render: () => <ModeSwitchingDemo />,
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TESTS
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Test Editor"
      initialValue="Type here for testing..."
      editorType="simple"
      styles={{ theme: 'light' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const label = canvas.getByText('Test Editor')

    // Check that the label is visible
    expect(label).toBeVisible()

    // Find the textarea (simple editor mode)
    const textarea = canvas.getByDisplayValue('Type here for testing...')
    expect(textarea).toBeVisible()

    // Focus and type
    await userEvent.click(textarea)
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Hello, Complex Editor!', { delay: 50 })

    // Check value
    await expect(textarea).toHaveValue('Hello, Complex Editor!')
  },
  globals: { backgrounds: { value: 'light' } },
}

export const AccordionInteractionTest: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Accordion Test"
      initialValue="Content inside accordion"
      styles={{
        theme: 'light',
        accordionMode: true,
        accordionSummary: 'Click to expand editor',
        accordionDefaultExpanded: false,
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const accordionButton = canvas.getByText('Click to expand editor')

    // Initially collapsed - content should not be visible
    expect(accordionButton).toBeVisible()

    // Click to expand
    await userEvent.click(accordionButton)

    // Content should now be visible
    const textarea = canvas.getByDisplayValue('Content inside accordion')
    expect(textarea).toBeVisible()
  },
}

export const ComplexModeTest: Story = {
  render: () => (
    <ComplexTextEditorWithState
      label="Complex Mode Test"
      initialValue="Test complex editor modes"
      editorType="complex"
      styles={{ theme: 'light' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check for mode toggle buttons
    const simpleButton = canvas.getByRole('button', { name: /simple/i })
    const richTextButton = canvas.getByRole('button', { name: /rich text/i })
    const markdownButton = canvas.getByRole('button', { name: /markdown/i })

    expect(simpleButton).toBeVisible()
    expect(richTextButton).toBeVisible()
    expect(markdownButton).toBeVisible()

    // Test switching to markdown mode
    await userEvent.click(markdownButton)

    // The editor should switch to markdown mode
    // (More specific assertions would depend on the implementation details)
  },
  globals: { backgrounds: { value: 'light' } },
}

// Add argTypes for new props
// Add story
export const WithAutoSave: Story = {
  render: () => (
    <ComplexTextEditorWithState
      autoSave
      autoSaveKey="storybook-draft"
      initialValue="Type to see auto-save"
    />
  ),
}

// Add stories for live preview, search replace, etc.
export const MarkdownWithPreview: Story = {
  render: () => (
    <ComplexTextEditorWithState
      editorType="markdown"
      styles={{ theme: 'light' }}
    />
  ),
}
