// src/components/Tabs/tabs.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, userEvent, within, fn } from 'storybook/test'
import Tabs, { TabsItem, TabPanel, tabPanelId } from './index'

const basicTabs: TabsItem[] = [
  { title: 'Home', route: '/home', trigger: 'route' },
  { title: 'About', route: '/about', trigger: 'route' },
  { title: 'Contact', route: '/contact', trigger: 'route' },
]

const withBordersTabs: TabsItem[] = [
  { title: 'Tab One', route: '/one', trigger: 'route' },
  { title: 'Tab Two', route: '/two', trigger: 'route' },
  { title: 'Tab Three', route: '/three', trigger: 'route' },
]

const mixedTriggerTabs: TabsItem[] = [
  { title: 'Profile', route: '/profile', trigger: 'route' },
  {
    title: 'Settings',
    onClick: fn(),
    trigger: 'onClick',
  },
  { title: 'Logout', onClick: fn(), trigger: 'onClick' },
]

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  argTypes: {
    alignment: {
      control: 'radio',
      options: ['left', 'center', 'right', 'justify'],
    },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, borders, and layout',
    },
  },
  parameters: {
    // Fullscreen so the tablist spans the canvas edge-to-edge like it does
    // in a real page header. (The component itself does NOT stick on
    // scroll — it renders a static tab strip; position it via the host.)
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof Tabs>

/**
 * 1) Light Theme
 */
export const LightTheme: Story = {
  render: args => (
    // Light-theme tabs are designed for light surfaces (#374151 labels,
    // #1d4ed8 active over a translucent blue wash) — the wrapper and canvas
    // must be light or every label fails contrast. Verified: #374151 on
    // #ffffff = 10.31, #1d4ed8 on the blue-a15 wash over #ffffff (#e2ecfe)
    // = 5.64, #1f2937 on #ffffff = 14.68 (all >= 4.5).
    <div style={{ background: '#ffffff' }}>
      <Tabs {...args} />
      <div style={{ padding: '32px', color: '#1f2937' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Page Content</h1>
        <p>A static light-theme tab strip rendered above page content.</p>
      </div>
    </div>
  ),
  args: {
    items: basicTabs,
    alignment: 'left',
    styles: {
      theme: 'light',
      height: '60px',
    },
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * 2) Sacred Theme
 */
export const SacredTheme: Story = {
  render: args => (
    <div style={{ background: '#000000' }}>
      <Tabs {...args} />
      <div style={{ padding: '32px', color: '#ffe680' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: "'Cinzel', Georgia, serif",
          }}
        >
          Ancient Archives
        </h1>
        <p style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
          A static sacred-gold tab strip with per-tab borders.
        </p>
      </div>
    </div>
  ),
  args: {
    ...LightTheme.args,
    items: withBordersTabs,
    alignment: 'center',
    styles: {
      theme: 'sacred',
      height: '60px',
      tabLeftBorder: true,
      tabRightBorder: true,
    },
  },
}

/**
 * 2b) Dark Theme — `styles.theme: 'dark'` on the dark canvas. The tab strip
 * takes the `[data-theme='dark']` module overrides: slate label text
 * (`--goobs-dark-text`), a `--goobs-dark-border` bottom rule, and blue
 * (`--goobs-dark-primary`) hover/active accents with a light-blue active
 * wash — no gold, no Cinzel.
 */
export const DarkTheme: Story = {
  render: args => (
    <div>
      <Tabs {...args} />
      <div style={{ padding: '32px', color: 'var(--goobs-dark-text)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Page Content</h1>
        <p>A static dark-theme tab strip rendered above page content.</p>
      </div>
    </div>
  ),
  args: {
    items: basicTabs,
    alignment: 'left',
    styles: {
      theme: 'dark',
      height: '60px',
    },
  },
  globals: { backgrounds: { value: 'dark' } },
}

const InteractiveDemoRenderer = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'sacred'>('light')
  const [alignment, setAlignment] = React.useState<
    'left' | 'center' | 'right' | 'justify'
  >('left')
  // <Tabs> is a CONTROLLED component — `activeTab` (default 0) never moves on
  // its own; clicks only fire onChange/tab.onClick (see index.tsx
  // handleTabClick). Without this state the play assertion that clicking
  // "Settings" flips aria-selected can never pass. Same wiring as
  // WithPanelsRenderer / ChipAppearanceRenderer below.
  const [activeTab, setActiveTab] = React.useState(0)

  const wrapperBackground =
    theme === 'sacred' ? '#000000' : theme === 'dark' ? '#1f2937' : '#f3f4f6'
  const contentColor =
    theme === 'sacred' ? '#ffe680' : theme === 'dark' ? '#ffffff' : '#1f2937'

  return (
    <div style={{ height: '200vh', background: wrapperBackground }}>
      <div
        style={{
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          position: 'fixed',
          top: '96px',
          right: '16px',
          zIndex: 50,
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          Controls
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'sacred')
              }
              style={{
                padding: '4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
              }}
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="sacred">Sacred Theme</option>
            </select>
          </label>
          <select
            value={alignment}
            onChange={e =>
              setAlignment(
                e.target.value as 'left' | 'center' | 'right' | 'justify'
              )
            }
            style={{
              padding: '4px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
            }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      </div>

      <Tabs
        items={mixedTriggerTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        alignment={alignment}
        styles={{
          theme,
          height: '60px',
        }}
      />

      <div style={{ padding: '32px', color: contentColor }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            ...(theme === 'sacred'
              ? { fontFamily: "'Cinzel', Georgia, serif" }
              : {}),
          }}
        >
          Interactive Content
        </h1>
        <p>Use the controls to change the tabs.</p>
      </div>
    </div>
  )
}

/**
 * 3) Interactive Demo
 */
export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Clicking an onClick-trigger tab must activate it (aria-selected).
    const settingsTab = await canvas.findByRole('tab', { name: 'Settings' })
    await userEvent.click(settingsTab)
    await expect(settingsTab).toHaveAttribute('aria-selected', 'true')
  },
}

const panelPairingTabs: TabsItem[] = [
  { title: 'Overview', id: 'overview', trigger: 'onClick', onClick: fn() },
  { title: 'Activity', id: 'activity', trigger: 'onClick', onClick: fn() },
]

const WithPanelsRenderer = () => {
  const [activeTab, setActiveTab] = React.useState(0)
  return (
    <div style={{ padding: '16px' }}>
      <Tabs
        items={panelPairingTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel="Panel pairing demo"
        styles={{ theme: 'light' }}
      />
      <TabPanel tabId="overview" isActive={activeTab === 0}>
        <p style={{ padding: '16px' }}>Overview content</p>
      </TabPanel>
      <TabPanel tabId="activity" isActive={activeTab === 1}>
        <p style={{ padding: '16px' }}>Activity content</p>
      </TabPanel>
    </div>
  )
}

/**
 * 4) With Panels — ARIA pairing (regression)
 *
 * Renders `<Tabs>` alongside its `<TabPanel>` companions and asserts the
 * documented contract: each tab button's `aria-controls` equals the `id`
 * of the `<TabPanel>` rendered for the same tab id, both produced by the
 * shared `tabPanelId` helper. Pins the fix for the bug where `<Tabs>`
 * scoped `aria-controls` with an internal `useId()` value that
 * `<TabPanel>` never had, leaving every tab's `aria-controls` dangling.
 */
export const WithPanelsAriaPairing: Story = {
  render: () => <WithPanelsRenderer />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const overviewTab = canvas.getByRole('tab', { name: 'Overview' })
    const overviewPanel = canvas.getByRole('tabpanel', { name: 'Overview' })
    const activityTab = canvas.getByRole('tab', { name: 'Activity' })
    const activityPanel = canvas.getByRole('tabpanel', { name: 'Activity' })

    // The panel id comes from the exported helper…
    await expect(overviewPanel).toHaveAttribute('id', tabPanelId('overview'))
    await expect(activityPanel).toHaveAttribute('id', tabPanelId('activity'))

    // …and each tab's aria-controls points at exactly that id (the old
    // code emitted `tabpanel-<useId>-overview` here, which matched no
    // element in the document).
    await expect(overviewTab).toHaveAttribute('aria-controls', overviewPanel.id)
    await expect(activityTab).toHaveAttribute('aria-controls', activityPanel.id)

    // Activating another tab keeps the pairing and flips the active state.
    await userEvent.click(activityTab)
    await expect(activityTab).toHaveAttribute('aria-selected', 'true')
    await expect(activityPanel).toHaveAttribute('data-tab-active', 'true')
    await expect(overviewPanel).toHaveAttribute('data-tab-active', 'false')
    await expect(activityTab).toHaveAttribute('aria-controls', activityPanel.id)
  },
}

const chipNavTabs: TabsItem[] = [
  { title: 'Statements', id: 'statements', count: 12, trigger: 'onClick', onClick: fn() },
  { title: 'Ledger', id: 'ledger', count: 3, trigger: 'onClick', onClick: fn() },
  { title: 'Billing', id: 'billing', count: 0, trigger: 'onClick', onClick: fn() },
  { title: 'Drafts', id: 'drafts', trigger: 'onClick', onClick: fn() },
]

const ChipAppearanceRenderer = () => {
  const [activeTab, setActiveTab] = React.useState(0)
  return (
    <div style={{ background: '#000000', padding: '24px' }}>
      <Tabs
        items={chipNavTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        appearance="chips"
        alignment="left"
        ariaLabel="Chip appearance demo"
        styles={{ theme: 'sacred' }}
      />
      <div style={{ padding: '16px', color: '#ffe680' }}>
        <p>Chip-appearance tab strip — rounded pills instead of an underline row.</p>
      </div>
    </div>
  )
}

/**
 * 5) Chip Appearance (regression)
 *
 * `appearance="chips"` renders each tab as a rounded pill and drops the
 * tablist's bottom border. It is PURELY cosmetic: this play test pins the
 * contract that the markup is otherwise identical — the strip is still
 * `role="tablist"`, each tab is still `role="tab"` with `aria-selected`,
 * activation still flips `data-tab-active`, and the count badge still renders —
 * so switching to chips can never silently regress the a11y / generated-spec
 * contract (which locates section nav by `role="tab"` and `data-tab-id`).
 */
export const ChipAppearance: Story = {
  render: () => <ChipAppearanceRenderer />,
  globals: { backgrounds: { value: 'dark' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const tablist = canvas.getByRole('tablist', {
      name: 'Chip appearance demo',
    })
    await expect(tablist).toHaveAttribute('data-tabs-appearance', 'chips')

    // role="tab" + count badge survive the chip appearance.
    const ledgerTab = canvas.getByRole('tab', { name: /Ledger/ })
    await expect(ledgerTab).toHaveTextContent('3')

    // Activation still flips aria-selected + data-tab-active (unchanged).
    await userEvent.click(ledgerTab)
    await expect(ledgerTab).toHaveAttribute('aria-selected', 'true')
    await expect(ledgerTab).toHaveAttribute('data-tab-active', 'true')
  },
}
