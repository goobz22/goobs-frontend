/**
 * @fileoverview Storybook stories for the Accordion component.
 * Demonstrates different states, themes, and compositions.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import Accordion from './index'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  argTypes: {
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
    defaultExpanded: { control: 'boolean' },
    expanded: { control: 'boolean' },
    summary: { control: 'text' },
    details: { control: 'text' },
    onChange: { action: 'changed' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ width: '500px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Accordion>

const sampleDetails = (
  <p style={{ padding: '1rem', margin: 0 }}>
    This is the detailed content of the accordion. It can contain any React
    node.
  </p>
)

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/** A default, collapsed accordion with light theme. */
export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  args: {
    summary: 'Light Theme Accordion',
    details: sampleDetails,
    styles: { theme: 'light' },
  },
}

/** A dark theme accordion. */
export const DarkTheme: Story = {
  args: {
    summary: 'Dark Theme Accordion',
    details: sampleDetails,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

/** An alternative dark theme accordion. */
export const DarkThemeAlt: Story = {
  args: {
    summary: 'Alternative Dark Accordion',
    details: sampleDetails,
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/** An accordion that is expanded by default. */
export const ExpandedByDefault: Story = {
  name: 'State/Expanded by Default',
  args: {
    summary: 'Expanded by Default',
    details: sampleDetails,
    defaultExpanded: true,
    styles: { theme: 'light' },
  },
}

/** A disabled accordion that cannot be interacted with. */
export const DisabledStates: Story = {
  name: 'State/Disabled',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Accordion
        summary="Disabled Light"
        details={sampleDetails}
        styles={{ theme: 'light', disabled: true }}
      />
      <Accordion
        summary="Disabled Dark"
        details={sampleDetails}
        styles={{ theme: 'dark', disabled: true }}
      />
      <Accordion
        summary="Disabled Alternative"
        details={sampleDetails}
        styles={{ theme: 'dark', disabled: true }}
      />
    </div>
  ),
}

/** A dark theme accordion that is also disabled. */
export const DarkDisabled: Story = {
  name: 'State/Dark Disabled',
  args: {
    summary: 'Dark & Disabled',
    details: sampleDetails,
    styles: { theme: 'dark', disabled: true },
  },
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// CUSTOM STYLING STORIES
// --------------------------------------------------------------------------

/** The premium accordion without its default outline. */
export const PremiumNoOutline: Story = {
  name: 'Styling/Premium No Outline',
  args: {
    summary: 'Premium Without Outline',
    details: sampleDetails,
    styles: { theme: 'light', outline: false },
  },
}

/** Custom colors and styling. */
export const CustomColors: Story = {
  name: 'Styling/Custom Colors',
  args: {
    summary: 'Custom Styled Accordion',
    details: sampleDetails,
    styles: {
      theme: 'light',
      backgroundColor: 'rgba(255, 240, 245, 0.95)',
      borderColor: 'rgba(255, 20, 147, 0.4)',
      summaryBackgroundColor: 'rgba(255, 20, 147, 0.1)',
      summaryColor: 'rgba(139, 0, 139, 1)',
    },
  },
}

// --------------------------------------------------------------------------
// COMPOSITION STORIES
// --------------------------------------------------------------------------

/** Multiple accordions can be used together. */
export const Multiple: Story = {
  name: 'Composition/Multiple',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Accordion
        summary="First Item"
        details={sampleDetails}
        styles={{ theme: 'light' }}
      />
      <Accordion
        summary="Second Item"
        details={sampleDetails}
        styles={{ theme: 'light' }}
      />
      <Accordion
        summary="Third Item"
        details={sampleDetails}
        defaultExpanded={true}
        styles={{ theme: 'light' }}
      />
    </div>
  ),
}

/** Accordions can be nested within each other. */
export const Nested: Story = {
  name: 'Composition/Nested',
  args: {
    summary: 'Parent Accordion',
    details: (
      <div style={{ padding: '1rem' }}>
        <p>This is the parent&apos;s content.</p>
        <Accordion
          summary="Nested Accordion"
          details={sampleDetails}
          styles={{ theme: 'light' }}
        />
      </div>
    ),
    styles: { theme: 'light' },
  },
}

// --------------------------------------------------------------------------
// CONTROLLED STORY
// --------------------------------------------------------------------------

const ControlledAccordionExample = () => {
  const [expanded, setExpanded] = React.useState<boolean>(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <button
        onClick={() => setExpanded(prev => !prev)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Toggle Externally (Current: {expanded ? 'Expanded' : 'Collapsed'})
      </button>
      <Accordion
        summary="Controlled Accordion"
        details={sampleDetails}
        expanded={expanded}
        onChange={(_, newExpanded) => setExpanded(newExpanded)}
        styles={{ theme: 'light' }}
      />
    </div>
  )
}

/** An accordion whose state is controlled by an external component. */
export const Controlled: Story = {
  name: 'State/Controlled',
  render: () => <ControlledAccordionExample />,
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            summary="Basic Light"
            details={sampleDetails}
            styles={{ theme: 'light' }}
          />
          <Accordion
            summary="Light Expanded"
            details={sampleDetails}
            defaultExpanded={true}
            styles={{ theme: 'light' }}
          />
          <Accordion
            summary="Light Disabled"
            details={sampleDetails}
            styles={{ theme: 'light', disabled: true }}
          />
        </div>
      </div>

      {/* Dark Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            summary="Basic Dark"
            details={sampleDetails}
            styles={{ theme: 'dark' }}
          />
          <Accordion
            summary="Dark Expanded"
            details={sampleDetails}
            defaultExpanded={true}
            styles={{ theme: 'dark' }}
          />
          <Accordion
            summary="Dark Disabled"
            details={sampleDetails}
            styles={{ theme: 'dark', disabled: true }}
          />
        </div>
      </div>

      {/* Alternative Dark Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>
          Alternative Dark Theme
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            summary="Alternative Basic"
            details={sampleDetails}
            styles={{ theme: 'dark' }}
          />
          <Accordion
            summary="Alternative Expanded"
            details={sampleDetails}
            defaultExpanded={true}
            styles={{ theme: 'dark' }}
          />
          <Accordion
            summary="Alternative Disabled"
            details={sampleDetails}
            styles={{ theme: 'dark', disabled: true }}
          />
        </div>
      </div>

      {/* Custom Styling Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED' }}>
          Custom Styling
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion
            summary="Custom Colors"
            details={sampleDetails}
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              borderColor: 'rgba(147, 51, 234, 0.3)',
              summaryBackgroundColor: 'rgba(147, 51, 234, 0.2)',
              summaryColor: 'rgba(147, 51, 234, 1)',
            }}
          />
          <Accordion
            summary="Rounded Style"
            details={sampleDetails}
            styles={{
              theme: 'light',
              borderRadius: '16px',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
            }}
          />
          <Accordion
            summary="Minimal Style"
            details={sampleDetails}
            styles={{
              theme: 'light',
              outline: false,
              borderRadius: '0px',
              backgroundColor: 'rgba(255, 255, 255, 1)',
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
// INTERACTION TEST
// --------------------------------------------------------------------------
export const InteractionTest: Story = {
  args: {
    summary: 'Test Accordion',
    details: sampleDetails,
    styles: { theme: 'light' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const summary = canvas.getByText('Test Accordion')

    // Check it's initially collapsed
    await expect(
      canvas.queryByText('This is the detailed content', { exact: false })
    ).toBeNull()

    // Click to expand
    await userEvent.click(summary)
    await expect(
      canvas.getByText('This is the detailed content', { exact: false })
    ).toBeVisible()

    // Click to collapse
    await userEvent.click(summary)
    await expect(
      canvas.queryByText('This is the detailed content', { exact: false })
    ).toBeNull()
  },
}

// --------------------------------------------------------------------------
// LEVEL TESTING STORY
// --------------------------------------------------------------------------

/** Story demonstrating the difference between menu items and accordion items */
export const MenuVsAccordion: Story = {
  name: 'Level Testing/Menu vs Accordion',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Menu Items */}
      <div style={{ minWidth: 'fit-content' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Menu Items (Non-expandable)
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Accordion
            type="menu"
            summary="Home"
            href="/"
            isActive={true}
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="Products"
            href="/products"
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="Orders"
            onClick={() => console.log('Orders clicked')}
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="Settings"
            href="/settings"
            styles={{ theme: 'light', level: 0 }}
          />
        </div>
      </div>

      {/* Accordion Items */}
      <div style={{ minWidth: 'fit-content' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Accordion Items (Expandable)
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Accordion
            summary="Dashboard"
            details={
              <div style={{ padding: '1rem' }}>
                Dashboard content and charts
              </div>
            }
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            summary="Analytics"
            details={
              <div style={{ padding: '1rem' }}>
                Analytics reports and metrics
              </div>
            }
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            summary="User Management"
            details={
              <div style={{ padding: '1rem' }}>User roles and permissions</div>
            }
            styles={{ theme: 'light', level: 0 }}
            defaultExpanded={true}
          />
          <Accordion
            summary="System Settings"
            details={
              <div style={{ padding: '1rem' }}>
                System configuration options
              </div>
            }
            styles={{ theme: 'light', level: 0 }}
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

/** Story demonstrating width behavior: fixed vs dynamic */
export const WidthBehaviorComparison: Story = {
  name: 'Level Testing/Width Behavior Comparison',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Fixed Width Container (Text gets cut off) */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#dc2626' }}>
          Fixed Width Container (Text gets cut off)
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'hidden',
          }}
        >
          <Accordion
            type="menu"
            summary="This is a very long navigation item that will be cut off in a fixed width container"
            href="/cut-off"
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="Another extremely long menu item that demonstrates text truncation in fixed containers"
            href="/truncated"
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="Short Item"
            href="/short"
            styles={{ theme: 'light', level: 0 }}
          />
        </div>
      </div>

      {/* Dynamic Width Container (Auto-expands) */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#16a34a' }}>
          Dynamic Width Container (Auto-expands)
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Accordion
            type="menu"
            summary="This is a very long navigation item that will be fully visible in a dynamic width container"
            href="/fully-visible"
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="Another extremely long menu item that demonstrates full text display in dynamic containers"
            href="/full-display"
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="Short Item"
            href="/short"
            styles={{ theme: 'light', level: 0 }}
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

const createLevelContent = (
  level: number,
  theme: 'light' | 'dark'
): React.ReactNode => {
  if (level >= 6) {
    return (
      <div style={{ padding: '0' }}>
        <Accordion
          type="menu"
          summary="Final Menu Item"
          onClick={() => console.log('Menu clicked')}
          styles={{
            theme,
            level: level + 1,
            levelIndentBase: 16,
            levelIndentIncrement: 12,
            outline: false,
          }}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '0' }}>
      <Accordion
        type="menu"
        summary={`Overview ${level + 1}`}
        onClick={() => console.log('Overview clicked')}
        styles={{
          theme,
          level: level + 1,
          levelIndentBase: 16,
          levelIndentIncrement: 12,
          outline: false,
        }}
      />
      <Accordion
        summary={`Dashboard ${level + 1}`}
        details={createLevelContent(level + 1, theme)}
        styles={{
          theme,
          level: level + 1,
          levelIndentBase: 16,
          levelIndentIncrement: 12,
          outline: false,
        }}
      />
      <Accordion
        type="menu"
        summary={`Reports ${level + 1}`}
        href="/reports"
        styles={{
          theme,
          level: level + 1,
          levelIndentBase: 16,
          levelIndentIncrement: 12,
          outline: false,
        }}
      />
      <Accordion
        summary={`Settings ${level + 1}`}
        details={createLevelContent(level + 1, theme)}
        styles={{
          theme,
          level: level + 1,
          levelIndentBase: 16,
          levelIndentIncrement: 12,
          outline: false,
        }}
      />
      <Accordion
        type="menu"
        summary={`Profile ${level + 1}`}
        onClick={() => console.log('Profile clicked')}
        isActive={level === 0}
        styles={{
          theme,
          level: level + 1,
          levelIndentBase: 16,
          levelIndentIncrement: 12,
          outline: false,
        }}
      />
    </div>
  )
}

/** Test story demonstrating 6 levels of nested navigation accordions to validate level prop functionality. */
export const SixLevelNavigationTest: Story = {
  name: 'Level Testing/Six Level Navigation',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Light Theme Navigation */}
      <div style={{ minWidth: 'fit-content' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Light Theme Navigation
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Accordion
            type="menu"
            summary="Home"
            href="/"
            isActive={true}
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
          />
          <Accordion
            summary="Dashboard"
            details={createLevelContent(0, 'light')}
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
            defaultExpanded={true}
          />
          <Accordion
            summary="Analytics"
            details={createLevelContent(0, 'light')}
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
          />
          <Accordion
            type="menu"
            summary="Help"
            href="/help"
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
          />
          <Accordion
            summary="Settings"
            details={createLevelContent(0, 'light')}
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
          />
        </div>
      </div>

      {/* Dark Theme Navigation */}
      <div style={{ minWidth: 'fit-content' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>
          Dark Theme Navigation
        </h3>
        <div
          style={{
            width: '300px',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Accordion
            type="menu"
            summary="Home"
            href="/"
            isActive={true}
            styles={{
              theme: 'dark',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
          />
          <Accordion
            summary="Dashboard"
            details={createLevelContent(0, 'dark')}
            styles={{
              theme: 'dark',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
            defaultExpanded={true}
          />
          <Accordion
            summary="Analytics"
            details={createLevelContent(0, 'dark')}
            styles={{
              theme: 'dark',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
          />
          <Accordion
            type="menu"
            summary="Help"
            href="/help"
            styles={{
              theme: 'dark',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
            }}
          />
          <Accordion
            summary="Settings"
            details={createLevelContent(0, 'dark')}
            styles={{
              theme: 'dark',
              level: 0,
              levelIndentBase: 16,
              levelIndentIncrement: 12,
              outline: false,
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

/** Alternative test showing different indentation configurations. */
export const IndentationVariations: Story = {
  name: 'Level Testing/Indentation Variations',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Dynamic Width Expansion Test */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Dynamic Width Expansion (Auto-expands beyond 300px)
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Accordion
            type="menu"
            summary="Short Item"
            href="/"
            isActive={true}
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="This is a very long navigation item that should expand the container width automatically"
            href="/long-item"
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            summary="Expandable Section with Really Long Title That Should Not Be Cut Off"
            details={
              <div style={{ padding: '0' }}>
                <Accordion
                  type="menu"
                  summary="This is an even longer nested menu item that should expand the container significantly beyond 300px"
                  href="/very-long-nested"
                  styles={{ theme: 'light', level: 1 }}
                />
                <Accordion
                  type="menu"
                  summary="Medium length nested item"
                  href="/medium"
                  styles={{ theme: 'light', level: 1 }}
                />
              </div>
            }
            styles={{ theme: 'light', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="Normal Item"
            href="/normal"
            styles={{ theme: 'light', level: 0 }}
          />
        </div>
      </div>

      {/* Sacred Theme Dynamic Width */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>
          Sacred Theme - Dynamic Width Expansion
        </h3>
        <div
          style={{
            width: '300px',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '8px',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Accordion
            type="menu"
            summary="Sacred Home"
            href="/"
            isActive={true}
            styles={{ theme: 'sacred', level: 0 }}
          />
          <Accordion
            type="menu"
            summary="This is a very long sacred navigation item that should expand the container width automatically"
            href="/long-sacred"
            styles={{ theme: 'sacred', level: 0 }}
          />
          <Accordion
            summary="Sacred Expandable Section with Really Long Title"
            details={
              <div style={{ padding: '0' }}>
                <Accordion
                  type="menu"
                  summary="This is an extremely long nested sacred menu item that should expand the container significantly"
                  href="/very-long-sacred-nested"
                  styles={{ theme: 'sacred', level: 1 }}
                />
              </div>
            }
            styles={{ theme: 'sacred', level: 0 }}
          />
        </div>
      </div>

      {/* Mixed Navigation Types */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Mixed Navigation (Accordion + Menu Items)
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Accordion
            type="menu"
            summary="Home"
            href="/"
            isActive={true}
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 0,
              levelIndentIncrement: 6,
            }}
          />
          <Accordion
            summary="Products"
            details={
              <div style={{ padding: '0' }}>
                <Accordion
                  type="menu"
                  summary="All Products"
                  href="/products"
                  styles={{
                    theme: 'light',
                    level: 1,
                    levelIndentBase: 0,
                    levelIndentIncrement: 6,
                  }}
                />
                <Accordion
                  type="menu"
                  summary="Categories"
                  href="/categories"
                  styles={{
                    theme: 'light',
                    level: 1,
                    levelIndentBase: 0,
                    levelIndentIncrement: 6,
                  }}
                />
                <Accordion
                  type="menu"
                  summary="Inventory"
                  href="/inventory"
                  styles={{
                    theme: 'light',
                    level: 1,
                    levelIndentBase: 0,
                    levelIndentIncrement: 6,
                  }}
                />
              </div>
            }
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 0,
              levelIndentIncrement: 6,
            }}
          />
          <Accordion
            type="menu"
            summary="Orders"
            href="/orders"
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 0,
              levelIndentIncrement: 6,
            }}
          />
          <Accordion
            summary="Settings"
            details={
              <div style={{ padding: '0' }}>
                <Accordion
                  type="menu"
                  summary="General"
                  href="/settings/general"
                  styles={{
                    theme: 'light',
                    level: 1,
                    levelIndentBase: 0,
                    levelIndentIncrement: 6,
                  }}
                />
                <Accordion
                  summary="Advanced"
                  details={
                    <div style={{ padding: '0' }}>
                      <Accordion
                        type="menu"
                        summary="API Keys"
                        href="/settings/api"
                        styles={{
                          theme: 'light',
                          level: 2,
                          levelIndentBase: 0,
                          levelIndentIncrement: 6,
                        }}
                      />
                      <Accordion
                        type="menu"
                        summary="Security"
                        href="/settings/security"
                        styles={{
                          theme: 'light',
                          level: 2,
                          levelIndentBase: 0,
                          levelIndentIncrement: 6,
                        }}
                      />
                    </div>
                  }
                  styles={{
                    theme: 'light',
                    level: 1,
                    levelIndentBase: 0,
                    levelIndentIncrement: 6,
                  }}
                />
              </div>
            }
            styles={{
              theme: 'light',
              level: 0,
              levelIndentBase: 0,
              levelIndentIncrement: 6,
            }}
          />
        </div>
      </div>

      {/* Standard Indentation */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Standard Indentation (6px per level)
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          {[0, 1, 2, 3, 4, 5].map(level => (
            <Accordion
              key={level}
              type="menu"
              summary={`Level ${level} Navigation`}
              onClick={() => console.log(`Level ${level} clicked`)}
              styles={{
                theme: 'light',
                level,
                levelIndentBase: 0,
                levelIndentIncrement: 6,
              }}
            />
          ))}
        </div>
      </div>

      {/* Wide Indentation */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Wide Indentation (20px per level)
        </h3>
        <div
          style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fff',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          {[0, 1, 2, 3, 4, 5].map(level => (
            <Accordion
              key={level}
              type="menu"
              summary={`Level ${level} Navigation`}
              onClick={() => console.log(`Level ${level} clicked`)}
              styles={{
                theme: 'light',
                level,
                levelIndentBase: 0,
                levelIndentIncrement: 20,
              }}
            />
          ))}
        </div>
      </div>

      {/* With Base Indentation */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>
          Sacred Theme with Base Indentation (30px base + 15px per level)
        </h3>
        <div
          style={{
            width: '300px',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '8px',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          {[0, 1, 2, 3, 4, 5].map(level => (
            <Accordion
              key={level}
              type="menu"
              summary={`Level ${level} Navigation`}
              onClick={() => console.log(`Level ${level} clicked`)}
              isActive={level === 2}
              styles={{
                theme: 'sacred',
                level,
                levelIndentBase: 30,
                levelIndentIncrement: 15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'light' } },
}
