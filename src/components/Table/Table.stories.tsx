import type { Meta, StoryObj } from '@storybook/nextjs'
import { userEvent, within, expect } from 'storybook/test'
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from './index'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof Table>

const sampleData = [
  {
    id: 1,
    name: 'Sacred Temple Report',
    category: 'Financial',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Divine Balance Sheet',
    category: 'Management',
    status: 'Draft',
  },
  {
    id: 3,
    name: 'Holy Income Statement',
    category: 'Compliance',
    status: 'Archived',
  },
]

/**
 * Light theme threaded only to the container + table (NOT to every leaf) —
 * pins the two cascade pathways: the head resolves the light raised surface
 * with dark text, and unthemed cells resolve `--goobs-light-text` on light
 * borders instead of falling back to the sacred gold palette.
 */
export const Light: Story = {
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <TableContainer styles={{ theme: 'light' }}>
      <Table styles={{ theme: 'light' }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * Sacred theme threaded explicitly to EVERY element (container, table, rows,
 * cells) — pins the per-element `data-theme` pathway: gold uppercase header
 * on the gold-a10 surface, gold-a90 serif cell text, gold-a20 cell borders.
 */
export const Sacred: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  render: () => (
    <TableContainer styles={{ theme: 'sacred' }}>
      <Table styles={{ theme: 'sacred' }}>
        <TableHead>
          <TableRow styles={{ theme: 'sacred' }}>
            <TableCell styles={{ theme: 'sacred' }}>ID</TableCell>
            <TableCell styles={{ theme: 'sacred' }}>Sacred Name</TableCell>
            <TableCell styles={{ theme: 'sacred' }}>Divine Category</TableCell>
            <TableCell styles={{ theme: 'sacred' }}>Holy Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover styles={{ theme: 'sacred' }}>
              <TableCell styles={{ theme: 'sacred' }}>{row.id}</TableCell>
              <TableCell styles={{ theme: 'sacred' }}>{row.name}</TableCell>
              <TableCell styles={{ theme: 'sacred' }}>{row.category}</TableCell>
              <TableCell styles={{ theme: 'sacred' }}>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * Dark theme on every element — pins the dark raised-surface header, dark
 * text cells, dark borders, and the white-alpha row hover.
 */
export const Dark: Story = {
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <TableContainer styles={{ theme: 'dark' }}>
      <Table styles={{ theme: 'dark' }}>
        <TableHead>
          <TableRow styles={{ theme: 'dark' }}>
            <TableCell styles={{ theme: 'dark' }}>ID</TableCell>
            <TableCell styles={{ theme: 'dark' }}>Name</TableCell>
            <TableCell styles={{ theme: 'dark' }}>Category</TableCell>
            <TableCell styles={{ theme: 'dark' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover styles={{ theme: 'dark' }}>
              <TableCell styles={{ theme: 'dark' }}>{row.id}</TableCell>
              <TableCell styles={{ theme: 'dark' }}>{row.name}</TableCell>
              <TableCell styles={{ theme: 'dark' }}>{row.category}</TableCell>
              <TableCell styles={{ theme: 'dark' }}>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * Scalar CSS-variable overrides — pins the inheritance pathway AND the
 * closest-wins rule. The Table sets the `<table>` surface (`--table-bg`,
 * midnight navy), the teal header bg (`--table-header-bg`), and white header
 * text (`--table-header-color`); the container sets lavender cell text
 * (`--table-cell-color`), monospace font, and coral cell borders — all
 * inheriting down. The header-row cells sit inside `TableHead`, so each
 * resolves to a real `<th scope="col">` and takes its colour from
 * `--table-header-color` (white) on the teal `--table-header-bg` → white-on-teal
 * 5.47:1 (no per-cell override needed). The body cells keep the container's
 * lavender on the navy surface (9.52:1).
 */
export const StyleOverrides: Story = {
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <TableContainer
      styles={{
        theme: 'dark',
        color: '#c4b5fd',
        cellBorderColor: '#fb7185',
        fontFamily: 'Consolas, monospace',
      }}
    >
      <Table
        styles={{
          theme: 'dark',
          backgroundColor: '#101830',
          headerBackgroundColor: '#0f766e',
          headerColor: '#ffffff',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * A bare themed Table WITHOUT a TableContainer — pins the new
 * `.table[data-theme='light']` cascade: the head and unthemed cells resolve
 * the light palette from the `<table>`'s own `data-theme` attribute, which
 * previously required a themed container ancestor (the styles prop on Table
 * was a no-op before the CSS-module implementation).
 */
export const BareTableThemed: Story = {
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <Table styles={{ theme: 'light' }}>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sampleData.map(row => (
          <TableRow key={row.id} hover>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.category}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/**
 * Full accessible data-table semantics (WCAG 1.3.1 / 4.1.2 / 2.4.6). Pins:
 *  - `caption` renders a real `<caption>` — the table's accessible name.
 *  - `ariaLabel` on the container promotes the scrollable region to a labelled
 *    `role="region"` landmark; the region is keyboard-focusable so keyboard
 *    users can scroll it (visible via the `:focus-visible` ring).
 *  - cells inside `TableHead` auto-render `<th scope="col">` — no prop needed.
 *  - the leading body cell of each row is a `<th scope="row">` via
 *    `component="th" scope="row"`, so screen readers announce the row's name
 *    with every value cell.
 */
export const SemanticDataTable: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  render: () => (
    <TableContainer
      ariaLabel="Sacred reports"
      styles={{ theme: 'sacred' }}
    >
      <Table caption="Sacred reports by category" styles={{ theme: 'sacred' }}>
        <TableHead>
          <TableRow>
            <TableCell>Report</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * Legacy raw-`<th>`-child pattern — pins that `<TableCell><th>…</th></TableCell>`
 * now renders a single valid `<th>` (the child `<th>` is unwrapped to the header
 * cell's content) instead of the previously-invalid `<td><th>` nesting. Rendered
 * as the leading cell of a body row (outside a `TableHead`) so the unwrap path is
 * what produces the header cell — and, being a body-row header, it resolves to
 * the section-correct `<th scope="row">` (associating across the row), not
 * `scope="col"`.
 */
export const LegacyHeaderChild: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  render: () => (
    <TableContainer styles={{ theme: 'sacred' }}>
      <Table styles={{ theme: 'sacred' }}>
        <TableBody>
          <TableRow>
            <TableCell>
              <th>Raw th header</th>
            </TableCell>
            <TableCell>Body value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * `component="td"` escape hatch inside a `TableHead` (WCAG 1.3.1) — pins that an
 * explicit `component` prop is authoritative in BOTH directions. A cross-tab
 * layout's leading corner cell is NOT a column header, so `component="td"` keeps
 * it a plain `<td>` (no `data-header-cell`, no spurious `scope="col"`) even
 * though it sits in the `<thead>`; the remaining head cells still auto-resolve to
 * `<th scope="col">`, and each row's leading cell is a `<th scope="row">`. Before
 * the fix `section === 'head'` short-circuited the resolver, so the corner cell
 * rendered a spurious empty header `<th scope="col">` and the escape hatch
 * documented on the `component` prop was inert — this story fails that baseline.
 */
export const CrossTabCornerCell: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  render: () => (
    <TableContainer
      ariaLabel="Quarterly totals by region"
      styles={{ theme: 'sacred' }}
    >
      <Table caption="Quarterly totals by region" styles={{ theme: 'sacred' }}>
        <TableHead>
          <TableRow>
            {/* Non-header corner cell — the escape hatch forces a plain <td>. */}
            <TableCell component="td">{' '}</TableCell>
            <TableCell>Q1</TableCell>
            <TableCell>Q2</TableCell>
            <TableCell>Q3</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            { region: 'North', q1: 120, q2: 138, q3: 151 },
            { region: 'South', q1: 98, q2: 104, q3: 119 },
          ].map(row => (
            <TableRow key={row.region} hover>
              <TableCell component="th" scope="row">
                {row.region}
              </TableCell>
              <TableCell>{row.q1}</TableCell>
              <TableCell>{row.q2}</TableCell>
              <TableCell>{row.q3}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * Section-derived `scope` defaults (WCAG 1.3.1) — pins that a header cell's
 * default `scope` follows its SECTION, not merely its header-ness. A cell inside
 * `TableHead` defaults to `scope="col"` (column header). A body-row header cell
 * written `component="th"` WITHOUT an explicit scope defaults to `scope="row"`
 * (row header, associating across its row) — NOT `scope="col"`, which would make
 * a screen reader associate it down a phantom column. The `play` assertions fail
 * the pre-fix baseline, where the default was gated on header-ness and stamped
 * `scope="col"` on the body `<th>`.
 */
export const HeaderScopeDefaults: Story = {
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <TableContainer styles={{ theme: 'light' }}>
      <Table styles={{ theme: 'light' }}>
        <TableHead>
          <TableRow>
            <TableCell>Report</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow hover>
            {/* Body-row header, no explicit scope → must default to scope="row". */}
            <TableCell component="th">Sacred Temple Report</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Column header inside the <thead> → <th scope="col">.
    const colHeader = canvas.getByText('Report')
    await expect(colHeader.tagName).toBe('TH')
    await expect(colHeader).toHaveAttribute('scope', 'col')

    // Body-row header (component="th", NO explicit scope) → <th scope="row">,
    // and it lives in the <tbody> — the section-derived default, not "col".
    const rowHeader = canvas.getByText('Sacred Temple Report')
    await expect(rowHeader.tagName).toBe('TH')
    await expect(rowHeader).toHaveAttribute('scope', 'row')
    await expect(rowHeader.closest('tbody')).not.toBeNull()
  },
}

/**
 * Legacy raw-`<th>`-child attribute preservation (WCAG 1.3.1 / 4.1.1) — pins
 * that unwrapping a raw `<th>` child is LOSSLESS: its `colSpan`, `id`, `scope`,
 * `className`, and inline `style` are all carried onto the real `<th>` we
 * render, not silently dropped (the pre-fix unwrap hoisted only `.props.children`).
 * The raw `<th>` sets an explicit `scope="col"` while sitting in a body row —
 * whose section-derived default would be `scope="row"` — so the assertion also
 * proves the caller's explicit scope wins over the default.
 */
export const LegacyHeaderChildAttributes: Story = {
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <TableContainer styles={{ theme: 'light' }}>
      <Table styles={{ theme: 'light' }}>
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <th
                colSpan={2}
                id="raw-th-id"
                className="raw-th-extra"
                scope="col"
                style={{ textAlign: 'center' }}
              >
                Spanning raw header (attributes preserved)
              </th>
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell>Uptime</TableCell>
            <TableCell>99.9%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ),
  play: async ({ canvasElement }) => {
    const raw = canvasElement.querySelector('#raw-th-id')
    await expect(raw).not.toBeNull()
    await expect(raw?.tagName).toBe('TH')
    // colSpan forwarded (the text-only unwrap dropped it).
    await expect(raw).toHaveAttribute('colspan', '2')
    // Consumer className MERGED with the cell class, not replaced.
    await expect(raw).toHaveClass('raw-th-extra')
    // Inline style forwarded.
    await expect(raw).toHaveStyle({ textAlign: 'center' })
    // The raw <th>'s explicit scope="col" wins over the body-row default "row".
    await expect(raw).toHaveAttribute('scope', 'col')
    // And it is still flagged/styled as a header cell.
    await expect(raw).toHaveAttribute('data-header-cell', 'true')
  },
}

/**
 * Keyboard-scrollable region + reduced-motion guard — pins the two a11y CSS
 * states that a static snapshot alone can't verify, via a `play` regression
 * assertion (goobs' "the story IS the test" model):
 *  - (Issue 3, WCAG 2.1.1/2.4.7) The overflow-x scroll region is keyboard-
 *    reachable: `role="region"` (from `ariaLabel`), a tab stop (`tabIndex=0`),
 *    and it takes focus on Tab — which also triggers the `:focus-visible` ring
 *    the snapshot captures. Removing `tabIndex`/the region role fails this.
 *  - (Issue 5, WCAG 2.3.3) The row hover transition is disabled under
 *    `prefers-reduced-motion: reduce`. A play fn can't force the media feature,
 *    so it asserts the guard RULE exists in the stylesheet (the hashed `.row`
 *    class gets `transition: none` inside a `prefers-reduced-motion` block).
 *    Deleting the guard fails this.
 */
export const KeyboardScrollAndReducedMotion: Story = {
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <div style={{ maxWidth: '320px' }}>
      <TableContainer
        ariaLabel="Wide metrics (keyboard-scrollable)"
        styles={{ theme: 'dark' }}
      >
        <Table styles={{ theme: 'dark' }}>
          <TableHead>
            <TableRow>
              {['Region', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'].map(head => (
                <TableCell key={head}>
                  <span style={{ whiteSpace: 'nowrap' }}>{head} revenue</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { region: 'North', vals: [120, 138, 151, 162, 571] },
              { region: 'South', vals: [98, 104, 119, 130, 451] },
            ].map(row => (
              <TableRow key={row.region} hover>
                <TableCell component="th" scope="row">
                  <span style={{ whiteSpace: 'nowrap' }}>{row.region}</span>
                </TableCell>
                {row.vals.map((value, index) => (
                  <TableCell key={index}>
                    <span style={{ whiteSpace: 'nowrap' }}>${value}k</span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // (Issue 3) Keyboard-reachable scroll region.
    const region = canvas.getByRole('region', {
      name: 'Wide metrics (keyboard-scrollable)',
    })
    await expect(region).toHaveAttribute('tabindex', '0')
    await userEvent.tab()
    await expect(region).toHaveFocus()

    // (Issue 5) The reduced-motion guard exists in the stylesheet. Derive the
    // hashed `.row` class from a live row, then confirm a prefers-reduced-motion
    // media block zeroes its transition.
    const rowEl = canvasElement.querySelector('tbody tr')
    await expect(rowEl).not.toBeNull()
    const rowClass = rowEl?.classList[0] ?? ''
    await expect(rowClass).not.toBe('')

    const readRules = (sheet: CSSStyleSheet): CSSRule[] => {
      try {
        return Array.from(sheet.cssRules)
      } catch {
        return []
      }
    }

    let guarded = false
    for (const sheet of Array.from(document.styleSheets)) {
      for (const rule of readRules(sheet)) {
        if (
          rule instanceof CSSMediaRule &&
          `${rule.conditionText} ${rule.media?.mediaText ?? ''}`.includes(
            'prefers-reduced-motion'
          )
        ) {
          for (const inner of Array.from(rule.cssRules)) {
            if (
              inner instanceof CSSStyleRule &&
              inner.selectorText.includes(rowClass) &&
              inner.style.getPropertyValue('transition') === 'none'
            ) {
              guarded = true
            }
          }
        }
      }
    }
    await expect(guarded).toBe(true)
  },
}
