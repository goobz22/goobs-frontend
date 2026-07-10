/**
 * @fileoverview Storybook stories for the Card compound FAMILY — the slot
 * subcomponents that had zero or weak story coverage: CardBanner,
 * CardBigValue, CardConfirmDelete, CardGrid (+ the `empty={CardEmptyState}`
 * integration carrying the list-semantics a11y pattern), CardSection,
 * CardDragHandle, CardSelectionCheckbox, and the header/footer slot chrome.
 * A composed showcase renders Banner / BigValue / Stats / Metrics / Progress
 * together inside one Card across the sacred / light / dark theme trio;
 * interaction stories pin the ConfirmDelete confirm/cancel flow, the
 * DragHandle keyboard-reorder buttons, and the SelectionCheckbox toggle with
 * fn() spies; the AsChild story pins the context-provider fix for
 * `<Card asChild>` compositions. The showcase uses the NAMED barrel exports
 * (CardHeader, CardBanner, ...) while the grid + asChild stories use the
 * compound idiom (Card.Header, ...) — both public access paths are exercised.
 * These stories are the Card compound-family regression spec — goobs has no
 * unit tests.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, fn, userEvent, within } from 'storybook/test'
import Card, {
  CardBanner,
  CardBigValue,
  CardBody,
  CardConfirmDelete,
  CardDescription,
  CardDragHandle,
  CardEmptyState,
  CardFooter,
  CardFooterActions,
  CardFooterMeta,
  CardGrid,
  CardHeader,
  CardHeaderActions,
  CardHeaderBadges,
  CardHeaderIcon,
  CardHeaderMeta,
  CardMetric,
  CardMetrics,
  CardProgress,
  CardSection,
  CardSelectionCheckbox,
  CardStatCell,
  CardStats,
  CardSubtitle,
  CardTitle,
  type CardBannerTone,
  type CardBigValueTone,
  type CardTheme,
} from './index'
import CustomButton from '../Button'

const meta: Meta<typeof Card> = {
  title: 'Components/Card/Family',
  component: Card,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Card>

// --------------------------------------------------------------------------
// COMPOSED SHOWCASE — Banner + BigValue + Stats + Metrics + Progress in one
// Card, parameterized by theme so the trio differs ONLY by `styles.theme`.
// --------------------------------------------------------------------------

// Per-theme severity colors for the composed showcase. The Overdue stat value
// sits on the FLAT card surface, so the canonical --goobs-<theme>-danger-text
// token clears 4.5 on all three skins (light #b91c1c 6.47, dark #f87171 5.29,
// sacred #ef4444 5.45). A Metric value instead tints ITS OWN chip background
// (12% of the same color over the card surface), which drags a light-theme
// -text token just under 4.5 (green-700 #15803d → 4.27) — so the light
// success/warn values step ONE grade darker (green-800 / amber-800) to clear
// 4.5 on the self-tinted chip (#166534 → 5.95, #92400e → 5.88), while
// sacred/dark keep their -text tokens (all ≥6.4). Sacred is unchanged from the
// original raw --goobs-success/-warn/-danger values, so its render is identical.
const severityPalette: Record<
  CardTheme,
  { danger: string; success: string; warn: string }
> = {
  sacred: {
    danger: 'var(--goobs-sacred-danger-text)',
    success: 'var(--goobs-sacred-success-text)',
    warn: 'var(--goobs-sacred-warn-text)',
  },
  light: {
    danger: 'var(--goobs-light-danger-text)',
    success: '#166534',
    warn: '#92400e',
  },
  dark: {
    danger: 'var(--goobs-dark-danger-text)',
    success: 'var(--goobs-dark-success-text)',
    warn: 'var(--goobs-dark-warn-text)',
  },
}

const ComposedShowcase = ({
  theme,
}: {
  theme: CardTheme
}): React.JSX.Element => {
  const severity = severityPalette[theme]
  return (
  <div style={{ width: '420px' }}>
    <Card cardType="revenue-report" cardId="report-2026-q2" styles={{ theme }}>
      <CardHeader>
        <CardHeaderIcon>📈</CardHeaderIcon>
        <CardTitle>Q2 Revenue Report</CardTitle>
        <CardSubtitle>April through June 2026</CardSubtitle>
        <CardHeaderMeta>Updated 2h ago</CardHeaderMeta>
      </CardHeader>

      <CardBody>
        <CardBanner
          tone="warn"
          icon="⚠️"
          title="Pending review"
          message="Two invoices are awaiting approval before quarter close."
        />
        <CardBigValue
          label="Total Q2 Revenue"
          value="$128,400"
          caption="+12% vs Q1"
          tone="success"
          swatch="var(--goobs-success)"
        />
        <CardStats columns={2}>
          <CardStatCell label="Invoices" value="42" caption="8 open" />
          <CardStatCell
            label="Overdue"
            value="$3,210"
            valueColor={severity.danger}
          />
          <CardStatCell label="Largest Account" value="Acme Inc" />
          <CardStatCell label="Net Terms" value="NET-30" mono />
        </CardStats>
        <CardMetrics>
          <CardMetric
            icon="🧾"
            label="Paid"
            value={34}
            color={severity.success}
          />
          <CardMetric
            icon="⏳"
            label="Open"
            value={8}
            color={severity.warn}
          />
        </CardMetrics>
        <CardProgress value={0.7} label="Quarter close" />
      </CardBody>

      <CardFooter split>
        <CardFooterActions side="left">
          <CustomButton text="Export" action="export" styles={{ theme }} />
        </CardFooterActions>
        <CardFooterActions side="right">
          <CustomButton text="Review" action="review" styles={{ theme }} />
        </CardFooterActions>
        <CardFooterMeta>Generated Jun 30, 2026</CardFooterMeta>
      </CardFooter>
    </Card>
  </div>
  )
}

/**
 * Pins the full stacked composition on the sacred (default) surface: the warn
 * banner's amber tint above the large green $128,400 BigValue with its swatch
 * dot, the 2-column Stats grid (red overdue value, monospace NET-30), the two
 * tinted Metric chips, and the 70%-filled Progress bar, with a split footer.
 */
export const ComposedSacred: Story = {
  name: 'Composed/Sacred',
  render: () => <ComposedShowcase theme="sacred" />,
  globals: { backgrounds: { value: 'sacred' } },
}

/**
 * Pins the identical composition re-skinned by `styles={{ theme: 'light' }}`:
 * white card surface, dark text, and the same severity colors (amber banner,
 * green BigValue, red overdue stat) reading against a light canvas.
 */
export const ComposedLight: Story = {
  name: 'Composed/Light',
  render: () => <ComposedShowcase theme="light" />,
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Pins the identical composition re-skinned by `styles={{ theme: 'dark' }}`:
 * slate card surface with light text — distinct from BOTH the sacred gold
 * palette and the light skin, so a dark→light collapse regression fails here.
 */
export const ComposedDark: Story = {
  name: 'Composed/Dark',
  render: () => <ComposedShowcase theme="dark" />,
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// CARD.BANNER — the five tones + the severity → ARIA role mapping
// --------------------------------------------------------------------------

const bannerTones: CardBannerTone[] = [
  'info',
  'success',
  'warn',
  'danger',
  'neutral',
]

const bannerCopy: Record<
  CardBannerTone,
  { icon: string; title: string; message: string }
> = {
  info: {
    icon: 'ℹ️',
    title: 'Heads up',
    message: 'A newer template version is available.',
  },
  success: {
    icon: '✅',
    title: 'Synced',
    message: 'All 42 invoices reconciled with the ledger.',
  },
  warn: {
    icon: '⚠️',
    title: 'Pending review',
    message: 'Two invoices are awaiting approval.',
  },
  danger: {
    icon: '⛔',
    title: 'Export failed',
    message: 'The ledger connection timed out after 3 retries.',
  },
  neutral: {
    icon: '📝',
    title: 'Draft',
    message: 'This report has not been published yet.',
  },
}

/**
 * Pins the five-tone banner matrix stacked in one card body — each tone gets
 * its own tinted background/border/text palette — and the play function pins
 * the severity → ARIA mapping: danger + warn render `role="alert"` while
 * info / success / neutral render `role="status"`.
 */
export const BannerTones: Story = {
  name: 'Banner/Tones',
  render: () => (
    <div style={{ width: '420px' }}>
      <Card
        cardType="banner-demo"
        cardId="banner-tones"
        styles={{ theme: 'sacred' }}
      >
        <CardHeader>
          <CardHeaderIcon>📣</CardHeaderIcon>
          <CardTitle>Banner Tones</CardTitle>
        </CardHeader>
        <CardBody>
          {bannerTones.map(tone => (
            <CardBanner
              key={tone}
              tone={tone}
              icon={bannerCopy[tone].icon}
              title={bannerCopy[tone].title}
              message={bannerCopy[tone].message}
            />
          ))}
        </CardBody>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const banners = canvasElement.querySelectorAll('[data-card-banner="true"]')
    await expect(banners).toHaveLength(5)
    for (const tone of bannerTones) {
      const banner = canvasElement.querySelector(`[data-banner-tone="${tone}"]`)
      await expect(banner).not.toBeNull()
      const expectedRole =
        tone === 'danger' || tone === 'warn' ? 'alert' : 'status'
      await expect(banner).toHaveAttribute('role', expectedRole)
    }
  },
}

// --------------------------------------------------------------------------
// CARD.BIGVALUE — the six-tone stat-tile matrix
// --------------------------------------------------------------------------

const bigValueTones: CardBigValueTone[] = [
  'success',
  'warn',
  'danger',
  'info',
  'neutral',
  'gold',
]

/**
 * Pins all six BigValue tones side by side (success green, warn amber, danger
 * red, info blue, neutral, gold) inside a 3-column CardStats grid, plus the
 * swatch dot + caption anatomy on the first tile — each tile's value carries
 * its `data-tone` attribute so a tone palette regression changes the rendered
 * value color here.
 */
export const BigValueTones: Story = {
  name: 'BigValue/Tones',
  render: () => (
    <div style={{ width: '560px' }}>
      <Card
        cardType="bigvalue-demo"
        cardId="bigvalue-tones"
        styles={{ theme: 'sacred' }}
      >
        <CardHeader>
          <CardHeaderIcon>🔢</CardHeaderIcon>
          <CardTitle>KPI Tiles</CardTitle>
          <CardHeaderMeta>6 tones</CardHeaderMeta>
        </CardHeader>
        <CardBody>
          <CardStats columns={3}>
            {bigValueTones.map((tone, index) => (
              <CardBigValue
                key={tone}
                label={tone}
                value={`$${(index + 1) * 1200}`}
                tone={tone}
                {...(index === 0 && {
                  swatch: 'var(--goobs-success)',
                  caption: '+4% this week',
                })}
              />
            ))}
          </CardStats>
        </CardBody>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const tiles = canvasElement.querySelectorAll('[data-card-big-value="true"]')
    await expect(tiles).toHaveLength(6)
    for (const tone of bigValueTones) {
      const value = canvasElement.querySelector(`[data-tone="${tone}"]`)
      await expect(value).not.toBeNull()
    }
  },
}

// --------------------------------------------------------------------------
// CARD.GRID — list semantics + the empty={CardEmptyState} integration
// --------------------------------------------------------------------------

const gridReports = [
  { id: 'report-q1', title: 'Q1 Revenue', subtitle: 'Jan – Mar' },
  { id: 'report-q2', title: 'Q2 Revenue', subtitle: 'Apr – Jun' },
  { id: 'report-q3', title: 'Q3 Forecast', subtitle: 'Jul – Sep' },
]

/**
 * Pins the list-semantics a11y pattern: the grid renders as `<ul role="list">`
 * and auto-wraps each of the three top-level cards in its own `<li>` (the
 * caller passes bare `<Card>` children with status HeaderBadges) — so a
 * regression that drops the list role or the per-child `<li>` wrapping fails
 * the play assertions.
 */
export const GridOfCards: Story = {
  name: 'Grid/Three Cards',
  render: () => (
    <div style={{ width: '720px' }}>
      <CardGrid minWidth="200px" gap="12px">
        {gridReports.map(report => (
          <Card
            key={report.id}
            cardType="report"
            cardId={report.id}
            variant="compact"
            styles={{ theme: 'sacred' }}
          >
            <Card.Header>
              <Card.HeaderIcon>📄</Card.HeaderIcon>
              <Card.Title as="h4">{report.title}</Card.Title>
              <Card.Subtitle>{report.subtitle}</Card.Subtitle>
              <CardHeaderBadges>
                <span>Ready</span>
              </CardHeaderBadges>
            </Card.Header>
          </Card>
        ))}
      </CardGrid>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector<HTMLUListElement>(
      '[data-card-grid="true"]'
    )
    await expect(grid).not.toBeNull()
    await expect(grid).toHaveAttribute('role', 'list')
    await expect(grid).not.toHaveAttribute('data-card-grid-empty')
    const wrappedItems = grid?.querySelectorAll(':scope > li')
    await expect(wrappedItems?.length).toBe(3)
    const cards = canvasElement.querySelectorAll('[data-card="true"]')
    await expect(cards).toHaveLength(3)
  },
}

const noReports: React.ReactNode[] = []

/**
 * Pins the `empty={<CardEmptyState>}` integration: with zero children the
 * grid stays a `<ul role="list">` but flips on `data-card-grid-empty="true"`,
 * renders NO `<li>` items, and shows the EmptyState placeholder (icon, title,
 * description) directly inside the list container.
 */
export const GridEmptyState: Story = {
  name: 'Grid/Empty State',
  render: () => (
    <div style={{ width: '720px' }}>
      <CardGrid
        minWidth="200px"
        gap="12px"
        empty={
          <CardEmptyState
            icon="🗂️"
            title="No reports yet"
            description="Create your first report to see it here."
            styles={{ theme: 'sacred' }}
          />
        }
      >
        {noReports}
      </CardGrid>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvasElement.querySelector<HTMLUListElement>(
      '[data-card-grid="true"]'
    )
    await expect(grid).not.toBeNull()
    await expect(grid).toHaveAttribute('role', 'list')
    await expect(grid).toHaveAttribute('data-card-grid-empty', 'true')
    const wrappedItems = grid?.querySelectorAll(':scope > li')
    await expect(wrappedItems?.length).toBe(0)
    const placeholder = canvasElement.querySelector(
      '[data-component="EmptyState"]'
    )
    await expect(placeholder).not.toBeNull()
    await expect(canvas.getByText('No reports yet')).toBeVisible()
    await expect(
      canvas.getByText('Create your first report to see it here.')
    ).toBeVisible()
  },
}

// --------------------------------------------------------------------------
// CARD.CONFIRMDELETE — inline confirm flow with fn() spies
// --------------------------------------------------------------------------

/**
 * Pins the inline confirmation pane (`role="alertdialog"`, assertive
 * live-region) rendered beneath the card header, with the default plain
 * confirm/cancel buttons. The play function drives the flow: clicking
 * "Yes, Delete" fires onConfirm exactly once (onCancel untouched), then
 * clicking "Cancel" fires onCancel exactly once.
 */
export const ConfirmDeleteFlow: StoryObj<typeof CardConfirmDelete> = {
  name: 'ConfirmDelete/Confirm And Cancel',
  args: {
    message: 'Delete "Acme Inc"? This cannot be undone.',
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: args => (
    <div style={{ width: '380px' }}>
      <Card cardType="company" cardId="acme-inc" styles={{ theme: 'sacred' }}>
        <CardHeader>
          <CardHeaderIcon>🏢</CardHeaderIcon>
          <CardTitle>Acme Inc</CardTitle>
          <CardSubtitle>12 employees</CardSubtitle>
          <CardHeaderActions>
            <button type="button" aria-label="Delete Acme Inc">
              🗑️
            </button>
          </CardHeaderActions>
        </CardHeader>
        <CardConfirmDelete {...args} />
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const pane = canvasElement.querySelector('[data-card-confirm="delete"]')
    await expect(pane).not.toBeNull()
    await expect(pane).toHaveAttribute('role', 'alertdialog')
    await expect(pane).toHaveAttribute('aria-live', 'assertive')

    await userEvent.click(canvas.getByRole('button', { name: 'Yes, Delete' }))
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
    await expect(args.onCancel).not.toHaveBeenCalled()

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    await expect(args.onCancel).toHaveBeenCalledTimes(1)
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
  },
}

/**
 * Pins the `renderActions` escape hatch: the pane renders the caller's goobs
 * CustomButtons (destructive-red confirm, secondary cancel — matched by their
 * custom labels) INSTEAD of the built-in plain buttons, and the slot's
 * onConfirm/onCancel passthroughs still fire the caller's handlers.
 */
export const ConfirmDeleteCustomActions: StoryObj<typeof CardConfirmDelete> = {
  name: 'ConfirmDelete/Custom Actions',
  args: {
    message: 'Remove the "Q2 Revenue" report?',
    confirmLabel: 'Remove Report',
    cancelLabel: 'Keep It',
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: args => (
    <div style={{ width: '380px' }}>
      <Card cardType="report" cardId="report-q2" styles={{ theme: 'sacred' }}>
        <CardHeader>
          <CardHeaderIcon>📄</CardHeaderIcon>
          <CardTitle>Q2 Revenue</CardTitle>
        </CardHeader>
        <CardConfirmDelete
          {...args}
          renderActions={slot => (
            <>
              <CustomButton
                text={slot.confirmLabel}
                variant="destructive"
                action="delete"
                onClick={slot.onConfirm}
                styles={{ theme: 'sacred' }}
              />
              <CustomButton
                text={slot.cancelLabel}
                variant="secondary"
                action="cancel"
                onClick={slot.onCancel}
                styles={{ theme: 'sacred' }}
              />
            </>
          )}
        />
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // The built-in plain buttons are replaced — the pane contains no
    // [data-card-confirm-yes] default button.
    const builtInConfirm = canvasElement.querySelector(
      '[data-card-confirm-yes="true"]'
    )
    await expect(builtInConfirm).toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Report' }))
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
    await userEvent.click(canvas.getByRole('button', { name: 'Keep It' }))
    await expect(args.onCancel).toHaveBeenCalledTimes(1)
  },
}

// --------------------------------------------------------------------------
// CARD.SECTION — labeled accent region vs muted region
// --------------------------------------------------------------------------

/**
 * Pins the two Section palettes inside one body: the first section renders its
 * uppercase eyebrow label above accent-tinted content, while the `muted`
 * section renders the grey palette — visually distinct backgrounds so a
 * muted-vs-accent regression is caught by the snapshot.
 */
export const SectionRegions: Story = {
  name: 'Section/Labeled And Muted',
  render: () => (
    <div style={{ width: '420px' }}>
      <Card
        cardType="device"
        cardId="core-router-01"
        styles={{ theme: 'sacred' }}
      >
        <CardHeader>
          <CardHeaderIcon>🖧</CardHeaderIcon>
          <CardTitle>Core Router</CardTitle>
          <CardSubtitle>10.0.0.1</CardSubtitle>
        </CardHeader>
        <CardBody>
          <CardSection label="Network Hierarchy">
            <CardMetric label="Site" value="HQ — Building A" />
            <CardMetric label="Rack" value="R12 / U40" />
            <CardMetric label="Subnet" value="10.0.0.0/24" mono />
          </CardSection>
          <CardSection muted label="Notes">
            <CardDescription>
              Firmware upgrade scheduled for the July maintenance window.
            </CardDescription>
          </CardSection>
        </CardBody>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sections = canvasElement.querySelectorAll(
      '[data-card-section="true"]'
    )
    await expect(sections).toHaveLength(2)
    await expect(canvas.getByText('Network Hierarchy')).toBeVisible()
    await expect(canvas.getByText('Notes')).toBeVisible()
  },
}

// --------------------------------------------------------------------------
// CARD.SELECTIONCHECKBOX — controlled selection affordance
// --------------------------------------------------------------------------

/**
 * Pins the top-right selection affordance: a real, AT-labelled checkbox that
 * renders unchecked (controlled — the story passes `checked={false}`). The
 * play function clicks it and asserts onChange fires once with the NEW state
 * `true` plus the native change event as the second argument.
 */
export const SelectionCheckboxToggle: StoryObj<typeof CardSelectionCheckbox> = {
  name: 'SelectionCheckbox/Toggle',
  args: {
    checked: false,
    ariaLabel: 'Select Acme Inc',
    onChange: fn(),
  },
  render: args => (
    <div style={{ width: '380px' }}>
      <Card
        cardType="company"
        cardId="acme-selectable"
        styles={{ theme: 'sacred' }}
      >
        <CardHeader>
          <CardHeaderIcon>🏢</CardHeaderIcon>
          <CardTitle>Acme Inc</CardTitle>
          <CardHeaderActions>
            <CardSelectionCheckbox {...args} />
          </CardHeaderActions>
        </CardHeader>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Select Acme Inc' })
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(args.onChange).toHaveBeenCalledTimes(1)
    await expect(args.onChange).toHaveBeenCalledWith(true, expect.anything())
  },
}

// --------------------------------------------------------------------------
// CARD.DRAGHANDLE — keyboard reorder buttons + boundary disabling
// --------------------------------------------------------------------------

/**
 * Pins the WAI-ARIA reorder pattern: the handle is a labelled `role="group"`
 * exposing real "Move up" / "Move down" buttons alongside the aria-hidden
 * grip glyph. The play function clicks both buttons and asserts each spy
 * fires exactly once.
 */
export const DragHandleReorder: StoryObj<typeof CardDragHandle> = {
  name: 'DragHandle/Reorder Buttons',
  args: {
    ariaLabel: 'Reorder step 2',
    onMoveUp: fn(),
    onMoveDown: fn(),
  },
  render: args => (
    <div style={{ width: '380px' }}>
      <Card
        cardType="automation-step"
        cardId="step-2"
        styles={{ theme: 'sacred' }}
      >
        <CardHeader>
          <CardDragHandle {...args} />
          <CardTitle as="h4">Send follow-up email</CardTitle>
          <CardSubtitle>Step 2 of 4</CardSubtitle>
        </CardHeader>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('group', { name: 'Reorder step 2' })
    await expect(handle).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Move up' }))
    await expect(args.onMoveUp).toHaveBeenCalledTimes(1)
    await expect(args.onMoveDown).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Move down' }))
    await expect(args.onMoveDown).toHaveBeenCalledTimes(1)
  },
}

/**
 * Pins the list-boundary state: when `onMoveUp` is omitted (first item) the
 * "Move up" button renders DISABLED while "Move down" stays enabled — so a
 * regression that enables an unhandled direction (or disables a handled one)
 * fails here.
 */
export const DragHandleBoundary: StoryObj<typeof CardDragHandle> = {
  name: 'DragHandle/First-Item Boundary',
  args: {
    ariaLabel: 'Reorder step 1',
    onMoveDown: fn(),
  },
  render: args => (
    <div style={{ width: '380px' }}>
      <Card
        cardType="automation-step"
        cardId="step-1"
        styles={{ theme: 'sacred' }}
      >
        <CardHeader>
          <CardDragHandle {...args} />
          <CardTitle as="h4">Receive webhook</CardTitle>
          <CardSubtitle>Step 1 of 4</CardSubtitle>
        </CardHeader>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Move up' })).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Move down' })
    ).toBeEnabled()
  },
}

// --------------------------------------------------------------------------
// CARD ROOT asChild — regression pin for the CardContext provider fix
// --------------------------------------------------------------------------

/**
 * Pins the asChild composition contract: the card root IS the caller's `<li>`
 * (no extra `<article>` wrapper) yet still carries `role="article"`, the
 * `data-card-*` attributes, and — the regression this story exists for — a
 * mounted CardContext, so `Card.Header`/`Card.Title` render inside it instead
 * of throwing, and `aria-labelledby` resolves to the rendered title element.
 */
export const AsChildListItem: Story = {
  name: 'Composed/AsChild List Item',
  render: () => (
    <ul
      role="list"
      style={{ listStyle: 'none', margin: 0, padding: 0, width: '380px' }}
    >
      <Card
        asChild
        cardType="course"
        cardId="egyptology-201"
        styles={{ theme: 'sacred' }}
      >
        <li>
          <Card.Header>
            <Card.HeaderIcon>📜</Card.HeaderIcon>
            <Card.Title>Hieroglyphs In Practice</Card.Title>
            <Card.Subtitle>History and Culture</Card.Subtitle>
          </Card.Header>
        </li>
      </Card>
    </ul>
  ),
  globals: { backgrounds: { value: 'sacred' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The card chrome landed on the <li> itself — no <article> wrapper exists.
    const root = canvasElement.querySelector('li[data-card="true"]')
    await expect(root).not.toBeNull()
    await expect(root).toHaveAttribute('role', 'article')
    await expect(root).toHaveAttribute('data-card-id', 'egyptology-201')
    await expect(canvasElement.querySelector('article')).toBeNull()
    // Subcomponents rendered (pre-fix this threw "Card subcomponents must be
    // rendered inside <Card>") and the title labels the root.
    const title = canvas.getByText('Hieroglyphs In Practice')
    await expect(title).toBeVisible()
    const labelledBy = root?.getAttribute('aria-labelledby')
    await expect(labelledBy).toBeTruthy()
    const titleElement = document.getElementById(labelledBy ?? '')
    await expect(titleElement).not.toBeNull()
    await expect(titleElement).toHaveTextContent('Hieroglyphs In Practice')
  },
}
