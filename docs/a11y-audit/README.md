# goobs-frontend a11y audit — report index

One-page index of the accessibility retrofit (hearing / reading-screen-reader / SEO-semantic +
class-first lint gating). Live status, scoreboard, and the remaining/owner-gated list live in
**[CAMPAIGN_STATUS.md](./CAMPAIGN_STATUS.md)**. Per-component detail is in the sibling reports below.

**Coverage:** all 58 non-Field top-level dirs in `src/components/` + all 14 `Field/*` subdirs have a
report (matrix COMPLETE as of 2026-07-12). `src/app` (trivial `<html lang="en">` layout) and
`src/utils` (pure helpers, no rendered output) carry no component surface. Class-lint gate modules
live in `scripts/a11y-lints/` (contract: `scripts/a11y-lints/README.md`), run via `bun run lint:a11y`.

Legend: ✅ FIXED · 🟡 PARTIAL (in-directory fixed; a cross-file/owner item remains) · ⚪ CLEAN (no defects found)

## Components (top-level `src/components/*`)

| Report | Status | Note |
|---|---|---|
| [Accordion](./Accordion.md) | ✅ | |
| [Alert](./Alert.md) | ✅ | |
| [AppBar](./AppBar.md) | ✅ | |
| [Avatar](./Avatar.md) | ✅ | |
| [Badge](./Badge.md) | ✅ | + 3 adversarial-review follow-ups |
| [BigCalendar](./BigCalendar.md) | ✅ | |
| [Breadcrumb](./Breadcrumb.md) | ✅ | |
| [Button](./Button.md) | ✅ | default `type="button"`; polymorphic `as`/`href` for crawlable-link CTAs is owner-gated |
| [Card](./Card.md) | ✅ | |
| [Checkbox](./Checkbox.md) | ✅ | |
| [Chip](./Chip.md) | ✅ | + 2 review rounds |
| [CodeCopy](./CodeCopy.md) | ✅ | |
| [ComplexTextEditor](./ComplexTextEditor.md) | ✅ | |
| [ConfirmationCodeInput](./ConfirmationCodeInput.md) | ✅ | source of a `form-error-not-associated` finding (no gate module yet) |
| [Content](./Content.md) | ✅ | |
| [DataGrid](./DataGrid.md) | 🟡 | `ipAddress`/`supernet` editors unnamed until IPAM Address/Supernet gain `ariaLabel` |
| [DetailField](./DetailField.md) | ✅ | |
| [Dialog](./Dialog.md) | ✅ | |
| [Divider](./Divider.md) | ✅ | |
| [Drawer](./Drawer.md) | ✅ | |
| [EmptyState](./EmptyState.md) | ✅ | |
| [Fade](./Fade.md) | ✅ | |
| [FieldGrid](./FieldGrid.md) | ⚪ | |
| [FileDropzone](./FileDropzone.md) | ✅ | |
| [Filter](./Filter.md) | ✅ | |
| [Form](./Form.md) | ✅ | |
| [IconButton](./IconButton.md) | ✅ | |
| [Icons](./Icons.md) | ✅ | pattern-level (aria-hidden default) |
| [List](./List.md) | ✅ | |
| [ListItemCard](./ListItemCard.md) | ✅ | composition restructure is owner-gated (Chromatic) |
| [Markdown](./Markdown.md) | ✅ | + 2 review passes |
| [MenuItem](./MenuItem.md) | ✅ | |
| [Metric](./Metric.md) | ✅ | |
| [Pagination](./Pagination.md) | ✅ | |
| [Panel](./Panel.md) | ✅ | + description-association pass |
| [Paper](./Paper.md) | ✅ | |
| [Popover](./Popover.md) | ✅ | |
| [PricingTable](./PricingTable.md) | 🟡 | CTA crawlable-link (Button `as`/`href`) owner-gated; Tooltip-trigger item is STALE (already fixed) |
| [ProgressBar](./ProgressBar.md) | ✅ | |
| [ProjectBoard](./ProjectBoard.md) | 🟡 | keyboard drag-alternative + occluded breadcrumb are design/owner calls |
| [QRCode](./QRCode.md) | ✅ | |
| [RadioGroup](./RadioGroup.md) | ✅ | |
| [SacredGlyphFrame](./SacredGlyphFrame.md) | ✅ | |
| [Select](./Select.md) | ✅ | |
| [Slide](./Slide.md) | ✅ | |
| [Snackbar](./Snackbar.md) | ✅ | |
| [Stepper](./Stepper.md) | ✅ | |
| [Switch](./Switch.md) | ✅ | |
| [Table](./Table.md) | ✅ | |
| [Tabs](./Tabs.md) | ✅ | route-tab (`<a href>` vs button-tab) semantics owner-gated |
| [ToggleButton](./ToggleButton.md) | ✅ | |
| [Toolbar](./Toolbar.md) | ✅ | |
| [Tooltip](./Tooltip.md) | ✅ | trigger self-heals to focusable `role="button"` |
| [TransferList](./TransferList.md) | ✅ | |
| [TreeView](./TreeView.md) | ✅ | focus-on-collapse (`preserveFocusOnCollapse`) landed |
| [Typography](./Typography.md) | ✅ | |
| [WorkspaceFilterShell](./WorkspaceFilterShell.md) | ✅ | |
| [Zoom](./Zoom.md) | ✅ | |

## Field family (`src/components/Field/*`)

| Report | Status | Note |
|---|---|---|
| [Field-Shell](./Field-Shell.md) | ✅ | shared wrapper (label/error/required/`ariaLabel`/`id`/diag); serial pass `96486d1c` |
| [Field-Date](./Field-Date.md) | ✅ | |
| [Field-Dropdown](./Field-Dropdown.md) | ✅ | D1 typeahead FIXED; D2 listbox-owned-element owner-gated |
| [Field-IPAM](./Field-IPAM.md) | ✅ | ⚠️ Address + Supernet leaves still lack `ariaLabel` (see CAMPAIGN_STATUS) |
| [Field-Number](./Field-Number.md) | ✅ | id/label-less caveats resolved by the Shell pass |
| [Field-Password](./Field-Password.md) | ✅ | |
| [Field-Percentage](./Field-Percentage.md) | ✅ | |
| [Field-PhoneNumber](./Field-PhoneNumber.md) | 🟡 | issue-4 (`id` divergence) resolved by Shell pass; report wording predates it |
| [Field-Search](./Field-Search.md) | ✅ | |
| [Field-Signature](./Field-Signature.md) | ✅ | own `canvasAriaLabel` name path |
| [Field-Slider](./Field-Slider.md) | ✅ | |
| [Field-Text](./Field-Text.md) | ✅ | |
| [Field-Time](./Field-Time.md) | ✅ | |
| [Field-USD](./Field-USD.md) | 🟡 | `form-error-not-associated` (issue 10) FIXED via Shell `describedById`; no gate module yet |

## Lint-class notes

Deep-dive write-ups for recurring lint classes (the enforcement lives in `scripts/a11y-lints/`):
[form-label-not-associated](./_lint-form-label-not-associated.md) ·
[icon-missing-aria-hidden](./_lint-icon-missing-aria-hidden.md) ·
[missing-accessible-name](./_lint-missing-accessible-name.md) ·
[missing-keyboard-arrow-nav](./_lint-missing-keyboard-arrow-nav.md) ·
[toggle-missing-aria-pressed](./_lint-toggle-missing-aria-pressed.md)

**Recurring class with NO gate module (gap):** `form-error-not-associated` — build
`scripts/a11y-lints/form-error-not-associated.ts`.
