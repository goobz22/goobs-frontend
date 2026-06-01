# goobs-frontend Icon Catalog — Appearance & Use-Cases

This is the authoritative appearance reference for every icon exported from
`src/components/Icons/index.ts`. Each icon is exported with an `Icon` suffix
(e.g. the `Assignment` component is exported as `AssignmentIcon`).

Use this document to pick an icon **by what it looks like**, not by what its
name happens to be. Many name-driven choices in consuming apps render the wrong
glyph (a gear for "service", a calendar for a "reservation", etc.) — the
appearance column is the source of truth.

> Conventions in this doc:
>
> - **Appearance** = the literal glyph drawn on screen.
> - **Use-cases** = contexts where the glyph reads correctly.
> - **DUP** in the Notes column flags an icon that is a pixel-for-pixel
>   duplicate of another. See the [Exact-Duplicate Pairs](#exact-duplicate-pairs)
>   section for the canonical-keep / retire decision.

---

## Table of Contents

1. [Actions & Editing](#actions--editing)
2. [Navigation & Arrows](#navigation--arrows)
3. [Status, Alerts & Validation](#status-alerts--validation)
4. [People, Accounts & Roles](#people-accounts--roles)
5. [Files, Documents & Content](#files-documents--content)
6. [Commerce, Money & Billing](#commerce-money--billing)
7. [Time, Calendar & Scheduling](#time-calendar--scheduling)
8. [Charts, Data & Analytics](#charts-data--analytics)
9. [Buildings, Places & Maps](#buildings-places--maps)
10. [Devices, Network & Infrastructure](#devices-network--infrastructure)
11. [Media & Playback](#media--playback)
12. [Layout, Views & Lists](#layout-views--lists)
13. [Text Formatting](#text-formatting)
14. [Security & Identity](#security--identity)
15. [Communication & Notifications](#communication--notifications)
16. [Misc, Brand & Numerals](#misc-brand--numerals)
17. [Exact-Duplicate Pairs](#exact-duplicate-pairs)

---

## Actions & Editing

| Icon             | Appearance                                                             | Use-cases                                                                       | Notes                        |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------- |
| Add              | Plain plus sign (+), equal strokes, no enclosure                       | add / create new, insert item, increment, expand, new entry                     |                              |
| AddCircle        | Plus sign inside a solid filled circle                                 | add new item, create/add button, append, new record, FAB add                    |                              |
| AddCircleOutline | Plus sign inside a thin-line circle outline                            | add new (lighter), create item, add to list, expand section, secondary add      |                              |
| AddTask          | Checkmark inside a circle outline (check-circle)                       | add task/to-do, mark complete, approve/confirm, checklist, accept               |                              |
| Create           | Diagonal pencil                                                        | create/write, edit content, compose, rename, draft/annotate                     | DUP → keep **Edit**          |
| Edit             | Diagonal pencil pointing down-left, tip at bottom                      | edit/modify, write/compose, rename, draw/annotate, update                       | DUP canonical of Create      |
| Delete           | Trash can / waste bin with lid and ridged body                         | delete item, remove/discard, move to trash, clear entry                         |                              |
| Remove           | Single horizontal minus / dash                                         | remove/delete, subtract/decrease, collapse, minus/reduce                        |                              |
| Clear            | An X (cross), no enclosure                                             | clear/reset field, close/dismiss, remove input, cancel, delete entry            | DUP → keep **Close**         |
| Close            | An X (cross), no enclosure (same glyph as Clear)                       | close dialog/modal, dismiss panel, exit/cancel, remove item, collapse           | DUP canonical of Clear       |
| Cancel           | An X inside a solid filled circle                                      | cancel/dismiss, close/remove, reject/abort, clear input, delete chip            |                              |
| Block            | Circle with a diagonal slash (the "no" sign)                           | block/ban user, prohibited, disable/restrict, cancel access, mute/stop          |                              |
| ContentCopy      | Two overlapping rectangles (offset duplicate pages)                    | copy/duplicate, clipboard copy, clone item, replicate, copy to clipboard        | DUP → keep **ContentCopy**   |
| Duplicate        | Two overlapping/stacked rounded rectangles                             | duplicate item, copy, clone/replicate, make a copy, stacked layers              | DUP retire → ContentCopy     |
| FileCopy         | Two overlapping document sheets, front with folded corner              | copy file, duplicate document, clone files, paste copy, backup                  |                              |
| Save             | Floppy disk: square, notched top-right, label rectangle                | save file, store data, commit/persist changes, download/keep                    |                              |
| Print            | Printer body with paper feeding from top, output tray below            | print document, printer settings, hard copy, send to printer                    |                              |
| Undo             | Curved arrow looping back to the left                                  | undo last action, revert/go back, step backward, cancel change                  |                              |
| Redo             | Curved arrow looping to the upper/forward right                        | redo last action, forward/next step, reapply change, repeat undone              |                              |
| Refresh          | Circular arrow forming an almost-complete loop with arrowhead          | refresh/reload, sync data, retry/re-run, update view                            |                              |
| Autorenew        | Two curved arrows forming a circular loop (clockwise)                  | refresh/reload, auto-renew subscription, sync/update, retry/cycle, recurring    |                              |
| Loop             | Two curved arrows chasing each other in a closed loop                  | repeat/loop playback, sync/cycle, continuous/recurring, reload cycle            |                              |
| Repeat           | Two horizontal arrows in a rounded opposing loop                       | repeat playback/loop, recurring schedule, cycle/re-run, shuffle-repeat          |                              |
| Sync             | Two curved arrows chasing each other (refresh cycle)                   | sync/refresh data, reload/update, two-way sync, retry, auto-update              |                              |
| Transfer         | Two horizontal arrows pointing opposite directions, stacked            | transfer/move data, swap/exchange, two-way transfer, send/receive, migrate      |                              |
| CompareArrows    | Two horizontal arrows pointing toward each other (converging)          | compare items, transfer/swap, sync two sides, versus/diff, exchange             |                              |
| Launch           | Square/box with arrow exiting the top-right corner                     | open in new tab/window, external link, launch app, open externally              |                              |
| Send             | Paper-plane pointing right                                             | send message/email, submit/transmit, share/dispatch, post/deliver               |                              |
| Search           | Magnifying glass: circle lens with short diagonal handle               | search/find, explore/look up, zoom/inspect, filter/query                        |                              |
| FilterList       | Three stacked horizontal lines of decreasing length (funnel)           | filter list, sort/refine, narrow results, apply filters, funnel data            |                              |
| Sort             | Three/four left-aligned lines of decreasing length                     | sort list, filter/order, arrange by criteria, alignment, reorder rows           |                              |
| Drag             | 3×3 grid of evenly spaced dots (full matrix)                           | drag handle/reorder, move element, app launcher, grip/sortable, options grid    | DUP → keep **DragIndicator** |
| DragIndicator    | 2-column × 3-row arrangement of six dots (vertical grip)               | drag handle, reorder list, sortable rows, move/grip, draggable control          | DUP canonical of Drag        |
| Settings         | Toothed cog / gear wheel with hollow center                            | settings/configuration, preferences/options, system controls, adjust/customize  |                              |
| Build            | A single wrench at a diagonal                                          | build/tools, settings & maintenance, configure/repair, dev tools, fix/adjust    |                              |
| Construction     | Crossed wrench and screwdriver (X)                                     | construction/maintenance, under repair, build tools, service, work in progress  |                              |
| Calculate        | Calculator face with button grid and math symbols, rounded square      | calculate/math, calculator tool, totals & sums, accounting, compute values      |                              |
| Code             | Pair of angle brackets pointing outward ( <> )                         | code/source, developer view, embed/HTML snippet, API/markup, technical content  |                              |
| SmartButton      | Horizontal rounded button shape with a small curved-arrow glyph inside | smart/action button, interactive control, trigger action, UI button, automation |                              |
| CreateNewFolder  | Folder shape with a small plus sign                                    | create new folder, add directory, new collection, organize into folder          |                              |
| PostAdd          | Document with text lines and a plus sign at top-right                  | create new post/document, add note/entry, new article/draft, append to file     |                              |

## Navigation & Arrows

| Icon                | Appearance                                                    | Use-cases                                                                          | Notes |
| ------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----- |
| ArrowBack           | Leftward arrow, full shaft + arrowhead                        | back/previous, navigate backward, return/undo nav, prior page, left                |       |
| ArrowForward        | Rightward arrow, full shaft + arrowhead                       | forward/next, proceed/continue, navigate forward, submit/go, right                 |       |
| ChevronLeft         | Single left-pointing chevron ( < ), no shaft                  | previous/back, collapse left panel, carousel previous, navigate left, step back    |       |
| ChevronRight        | Single right-pointing chevron ( > ), no shaft                 | next/forward, expand/drill in, carousel next, navigate right, disclosure           |       |
| KeyboardArrowLeft   | Thin chevron/caret pointing left                              | previous/back, navigate left, carousel previous, collapse panel, go back           |       |
| KeyboardArrowRight  | Thin chevron/caret pointing right                             | next/forward, navigate right, carousel next, expand panel, drill into              |       |
| KeyboardArrowDown   | Thin chevron/caret pointing down                              | scroll down, open dropdown, expand/show more, next item, collapse arrow            |       |
| KeyboardReturn      | Bent arrow pointing down-then-left (return key)               | enter/submit, return key, new line, confirm input, send                            |       |
| ExpandLess          | Chevron / caret pointing up ( ^ )                             | collapse section, scroll to top, minimize, previous/up, show less                  |       |
| ExpandMore          | Chevron / caret pointing down ( v )                           | expand section, open dropdown, show more, next/down, reveal content                |       |
| ArrowDropDown       | Small solid downward triangle                                 | dropdown/expand menu, collapse down, sort descending, more options, select control |       |
| ArrowDropUp         | Small solid upward triangle                                   | collapse up / dropup, sort ascending, scroll to top, hide content, increase        |       |
| ArrowDropDownCircle | Downward triangle inside a solid filled circle                | dropdown toggle (emphasized), expand panel, reveal content, circular trigger       |       |
| FirstPage           | Left-pointing arrow with a vertical bar to its left ( \|< )   | jump to first page, go to start, rewind to top, first in pagination, skip first    |       |
| LastPage            | Right-pointing arrow with a vertical bar to its right ( >\| ) | jump to last page, go to end, fast-forward final, last in pagination, skip end     |       |
| Navigation          | Upward solid arrowhead / compass needle                       | navigation/heading, current bearing/compass, go/move forward, explore/route        |       |
| Menu                | Three stacked horizontal lines (hamburger)                    | open nav menu, list/options drawer, toggle sidebar, more navigation                |       |
| MoreHoriz           | Three dots in a horizontal row (ellipsis)                     | more options/overflow, additional actions, show more, context menu trigger         |       |
| MoreVert            | Three dots stacked vertically (kebab)                         | more options/overflow, row/item actions, kebab context menu, settings              |       |

## Status, Alerts & Validation

| Icon                  | Appearance                                                  | Use-cases                                                                        | Notes                                      |
| --------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| Check                 | Bare checkmark (tick), no enclosure                         | confirm/done, mark complete, approve/accept, success, selected                   |                                            |
| CheckCircle           | Checkmark inside a solid filled circle                      | success/completed, confirmed, verified/approved, done, positive indicator        |                                            |
| CheckCircleOutline    | Checkmark inside a thin-line circle outline                 | success (lighter), completed, verified, mark as done, positive outline badge     |                                            |
| CheckBox              | Square box with a checkmark inside                          | checkbox selected, enabled toggle, multi-select, task done, agree/opt-in         |                                            |
| IndeterminateCheckBox | Square/checkbox with a single horizontal dash               | indeterminate checkbox, partial selection, mixed state, collapse/minus           |                                            |
| CircleOutline         | Plain thin-line circle outline (empty ring)                 | radio unselected, unchecked/empty, status dot, placeholder, toggle               | DUP → keep **CircleOutline**               |
| RadioButtonChecked    | Outer ring circle with a solid filled center dot            | selected radio, toggle on/active, record/live, single-select input               | DUP retire → CircleOutline                 |
| Error                 | Solid filled circle with an exclamation cut out             | error/failure, critical alert, blocking problem, stop/invalid, danger            |                                            |
| ErrorOutline          | Hollow circle containing an exclamation mark                | warning notice, non-blocking error, caution, attention needed, info alert        |                                            |
| Warning               | Solid filled up-triangle with an exclamation inside         | warning/alert, caution/hazard, error notification, attention required, risk      |                                            |
| WarningAmber          | Up-triangle outline (not filled) with an exclamation inside | mild warning/caution, non-critical alert, attention notice, advisory, review     |                                            |
| ReportProblem         | Warning triangle (rounded) with an exclamation inside       | report a problem/error, warning/caution, alert/hazard, flag issue                |                                            |
| PriorityHigh          | Bold exclamation mark ( ! )                                 | high priority/urgent, alert/attention, warning/important, critical flag          |                                            |
| Info                  | Outlined circle containing a lowercase letter i             | information, details/about, tooltip/hint, notice, more info                      |                                            |
| InfoOutline           | Hollow circle containing a lowercase i (thinner stroke)     | information note, help hint, about/details, subtle notice, metadata              |                                            |
| LowPriority           | Lowercase italic letter i (info glyph)                      | low priority flag, information/details, help tip/note, status indicator          | ⚠ name says priority, glyph is an info "i" |
| Help                  | Solid filled circle with a question mark cut out            | help/support, FAQ, ask a question, assistance, tooltip/hint                      |                                            |
| HourglassEmpty        | Hourglass outline with no sand (empty)                      | waiting/loading, timer/countdown, pending/in progress, elapsed, processing       |                                            |
| PendingActions        | Filled circle containing a checkmark (round check)          | pending tasks awaiting action, approved/confirmed, completed item, done/verified | ⚠ name says pending, glyph reads as "done" |
| Flag                  | Solid filled flag on a vertical pole                        | flag/mark, report content, milestone marker, set priority, bookmark/highlight    |                                            |
| Pause                 | Two thick vertical bars side by side                        | pause playback, hold/suspend process, standby, freeze/interrupt                  |                                            |
| Stop                  | Solid filled square                                         | stop media, halt process, end recording, cancel operation, block/terminate       |                                            |

## People, Accounts & Roles

| Icon                 | Appearance                                                  | Use-cases                                                                       | Notes                          |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------ |
| Account              | Solid filled head above a rounded torso (single bust)       | user account/profile, person/contact, login, account settings, avatar           |                                |
| Person               | Round head above a rounded-shoulders torso (single bust)    | user account/profile, individual contact, my account/avatar, single member      | DUP → keep **Person**          |
| Group                | Single person silhouette (head + shoulders)                 | user/person, profile/account, single contact, member, people                    | DUP retire → Person (see note) |
| PersonOutline        | Person silhouette as outline only (hollow)                  | user profile (outline), guest/unassigned, account placeholder, view person      |                                |
| People               | Two overlapping person silhouettes side by side             | users/people group, team/members, contacts/community, shared/multiple accounts  |                                |
| Groups               | Three person silhouettes clustered (small crowd)            | groups/teams, community/members, collaboration, audience, org people            |                                |
| GroupWork            | A circle containing three smaller circles                   | group work/teamwork, shared workspace, collaboration, team project, roles group |                                |
| PersonAdd            | Person silhouette with a small plus sign to its left        | add user/new member, invite person, create account/sign up, add contact         |                                |
| Contacts             | Contact card: head/face on left, detail lines on right      | contacts/address book, contact details, directory, customer info, profile card  |                                |
| SupervisedUserCircle | Circle outline enclosing a person head-and-shoulders avatar | supervised/managed user, account profile, admin oversight, group member, avatar |                                |
| AdminPanelSettings   | Shield outline with a small person/head badge inside        | admin settings/panel, security & permissions, role management, access control   |                                |
| Engineering          | Person wearing a hard hat with a gear beside the head       | engineering/maintenance, construction work, technical settings, field worker    |                                |
| Handshake            | Two hands clasped in a handshake                            | agreement/deal, partnership, handshake/greeting, contract signed, trust         |                                |
| Psychology           | Side-profile head with a brain/gear inside                  | psychology/mental, AI/ML/thinking, cognition/mindset, brainstorm/knowledge      |                                |

## Files, Documents & Content

| Icon                    | Appearance                                                      | Use-cases                                                                          | Notes       |
| ----------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------- |
| Article                 | Document/page rectangle with horizontal text lines              | article/document, blog/news, read content, report/page, text record                |             |
| Description             | Paper sheet with folded top-right corner and text lines         | document/file, description text, notes, article content, view details              |             |
| Assignment              | Clipboard with clip at top and horizontal text lines            | assignment/task, clipboard/checklist, work order/form, to-do, submitted report     |             |
| Contract                | Document with a small badge / signature mark in lower corner    | contract/agreement, signed document, legal terms, policy/deed, formal record       |             |
| Policy                  | Blank document page with folded top-right corner                | policy document, terms/agreement, file/page, document/report                       |             |
| Template                | Document/page with a folded corner and content lines            | document template, new file from template, page layout, reusable form              |             |
| Pdf                     | Document page with a folded corner and the letters "PDF"        | PDF file/document, download PDF, export to PDF, attachment/report file             |             |
| Receipt                 | Receipt slip with zig-zag torn bottom and text lines            | receipt/proof of purchase, invoice/bill, transaction record, expense summary       |             |
| PointOfSale             | Receipt/document with horizontal text lines (register printout) | point of sale/register, receipt/invoice, checkout terminal, sales record           |             |
| AttachFile              | Diagonal paperclip                                              | attach file, add attachment, link document, upload enclosure, email attachment     |             |
| Attachment              | Horizontal/upright paperclip (variant orientation)              | attachment indicator, attached file, clip/fasten, linked document, enclosure       |             |
| AttachMoney             | Dollar sign ( $ )                                               | money/price, payment/cost, salary/revenue, currency (USD), financial value         |             |
| Filing                  | Open/tabbed file folder outline                                 | folder/directory, file storage, organize/archive, open folder, categorize          |             |
| Layers                  | Two stacked overlapping diamond/rhombus layers                  | layers/stack, map layers, z-index/overlays, grouped elements, design layers        |             |
| Category                | A triangle, circle, and square grouped together                 | categories/grouping, classification/tags, filter by type, organize, collections    |             |
| Inventory               | Open box/crate with lid flap and a horizontal label line        | inventory/stock, warehouse storage, archive box, products on hand, supply          |             |
| Image                   | Picture frame with a small mountain + sun (photo placeholder)   | image/photo, upload picture, gallery/media, insert image, thumbnail placeholder    |             |
| AddPhotoAlternate       | Landscape/picture frame with a plus badge in the corner         | add photo/image, upload picture, insert media, attach image, new gallery item      |             |
| CloudUpload             | Cloud shape with an upward-pointing arrow                       | upload to cloud, backup files, push/publish data, save remotely, import to storage |             |
| CloudSync               | Cloud outline with circular sync/refresh arrows                 | cloud sync, backup & restore, data synchronization, cloud update, auto-save        | ✅ repaired |
| Download                | Downward arrow over a horizontal baseline (tray)                | download file, save to device, import data, pull/fetch, export to local            |             |
| Description / Article   | (see above)                                                     |                                                                                    |             |
| IntegrationInstructions | Document/clipboard with code brackets/lines and a tab at top    | integration docs, code snippet/API guide, dev setup, embed instructions            |             |
| MenuBook                | Open book from above, two facing pages and a center spine       | menu/catalog, read docs/guide, library/reading material, manual/handbook           |             |
| Gesture                 | Freeform scribble / cursive swirl line (handwriting stroke)     | gesture/draw, signature/handwriting, freehand annotation, touch gestures, sketch   |             |

## Commerce, Money & Billing

| Icon                 | Appearance                                                      | Use-cases                                                                             | Notes                                                  |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| AddShoppingCart      | Shopping cart on wheels with a small plus sign                  | add to cart, add product to order, e-commerce purchase, buy, new cart item            |                                                        |
| ShoppingBag          | Handbag/tote silhouette with a curved handle arc on top         | shopping cart/bag, purchase/buy, ecommerce checkout, retail store, add to bag         |                                                        |
| ShoppingBasket       | Trapezoidal market basket with a handle hoop on top             | shopping basket, grocery/retail purchase, add to basket, ecommerce, order items       |                                                        |
| Store                | Storefront building with an awning/canopy roofline and entrance | shop/store, marketplace, retail business, vendor/merchant, point of sale              |                                                        |
| StoreMallDirectory   | Storefront silhouette with a flag/marker on top                 | mall/store directory, business listing, place of shop, retail directory, find a store |                                                        |
| LocalShipping        | Delivery box truck in side profile (cargo box, cab, two wheels) | shipping/delivery, logistics/fulfillment, order tracking/in-transit, freight          |                                                        |
| LocalGasStation      | Fuel pump with hose and nozzle on the side                      | gas station/fuel, vehicle refueling, energy/fuel level, fleet, petrol on map          |                                                        |
| LocalOffer           | Price tag / luggage-label, tilted, with a punched hole          | pricing/price tag, discounts/sale/coupon, product/category tag, special offer         |                                                        |
| Loyalty              | Price tag with a small heart embossed on it                     | loyalty/rewards program, membership perks/points, favorite product, VIP               |                                                        |
| CardGiftcard         | Gift card/box with a bow ribbon (a present)                     | gift card/voucher, reward/bonus, promotion/coupon, loyalty perk, redeem               |                                                        |
| CardMembership       | Membership card with a curved highlight/banner stripe           | membership card, subscription tier, loyalty/VIP card, ID/pass, enrollment             |                                                        |
| CreditCard           | Horizontal card with a magnetic stripe band                     | credit card/payment, checkout/billing, card on file, payment method, transaction      | DUP → keep **CreditCard** (see note)                   |
| Payment              | Rounded card with a horizontal magnetic stripe across the top   | payment/checkout, credit card/billing, add payment method, transaction/pay now        | DUP retire → CreditCard                                |
| CreditCardOff        | Credit card with a diagonal slash (disabled)                    | card declined/disabled, remove payment method, no card, blocked transaction           |                                                        |
| AttachMoney          | Dollar sign ( $ )                                               | money/price, payment/cost, salary/revenue, currency, financial value                  |                                                        |
| MonetizationOn       | A circle with a dollar sign ( $ ) centered inside it            | money/pricing, revenue/earnings, payment/charge, monetization/cost                    | DUP → keep **MonetizationOn**                          |
| Money                | Solid coin disc with a dollar sign cut into its center          | money/cash, balance/funds, price/cost, financial/banking                              | DUP retire → MonetizationOn                            |
| AccountBalance       | Neoclassical bank facade: pediment + columns + base             | bank/banking, account balance, financial institution, government/legal, treasury      |                                                        |
| AccountBalanceWallet | Wallet/billfold rectangle with a small card on the right edge   | wallet/digital wallet, account balance with funds, payment method, stored cards       |                                                        |
| Bank                 | Neoclassical bank building (pediment + columns)                 | bank/banking, financial institution, deposit/transfer, account/treasury               | (same family as AccountBalance, not flagged duplicate) |
| CurrencyExchange     | Dollar sign inside two curved circular-arrow loops              | currency exchange, convert money, refund/reverse payment, recurring billing           |                                                        |
| RequestQuote         | Document page with a dollar sign / currency mark                | request a quote/estimate, invoice/billing document, pricing proposal, financial doc   |                                                        |
| BusinessCenter       | Briefcase with a handle on top                                  | business/work, portfolio/projects, job/career, briefcase, professional services       |                                                        |
| Work                 | Briefcase: rectangular body with a small handle bar on top      | work/business, job/career, portfolio/projects, briefcase/office, professional         |                                                        |
| EmojiEvents          | Two-handled trophy cup on a small base/pedestal                 | award/trophy, achievement/win, leaderboard/ranking, rewards, milestone                |                                                        |

## Time, Calendar & Scheduling

| Icon           | Appearance                                                     | Use-cases                                                                           | Notes                   |
| -------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------- |
| AccessTime     | Thin-line clock circle, hands at ~4 o'clock                    | time/clock, schedule/timestamp, recent/history, duration/timer, pending/waiting     |                         |
| Schedule       | Clock face with two hands at ~9 o'clock                        | schedule/time, appointment/calendar event, clock/current time, deadline/reminder    |                         |
| Timer          | Stopwatch circle with a top button/stem and a tick/hand inside | timer/countdown, stopwatch, time tracking, duration limit, scheduling/deadline      |                         |
| History        | Counter-clockwise circular arrow with a clock hand at center   | history/recent activity, undo/revert, version history, restore previous, log        |                         |
| Restore        | Clock face with a counter-clockwise arrow wrapping around it   | restore previous version, undo/revert, history/recent activity, backup recovery     |                         |
| Calendar       | Calendar/date page with header bar and two hanging rings       | calendar/dates, schedule events, appointments, plan/book, date picker               | DUP → keep **Calendar** |
| CalendarToday  | Calendar page with header bar and an empty/single body         | today/current date, single-day schedule, date marker, daily agenda, jump to today   | DUP retire → Calendar   |
| CalendarMonth  | Calendar with header and a grid of day cells (month view)      | monthly calendar, month view/planner, date range by month, overview, monthly events |                         |
| DateRange      | Calendar page with header, binding rings, grid of date cells   | calendar, pick a date, schedule event, date range selection, deadlines/due dates    |                         |
| Event          | Calendar page with binding rings and a single filled day dot   | calendar event, scheduled appointment, mark a date, booking, reminder day           |                         |
| EventAvailable | Calendar page with a checkmark inside                          | available/confirmed slot, booking confirmed, RSVP yes, scheduled OK, free slot      |                         |
| EventBusy      | Calendar page with an X mark inside                            | busy/unavailable, cancelled event, blocked date, no availability, declined          |                         |

## Charts, Data & Analytics

| Icon         | Appearance                                                   | Use-cases                                                                             | Notes |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ----- |
| Analytics    | Vertical bar chart in a rounded square frame                 | analytics/metrics, reporting dashboard, data insights, statistics, performance charts |       |
| Assessment   | Bar chart inside a document/page rectangle                   | assessment/report, performance review, analytics document, scorecard, data summary    |       |
| BarChart     | Vertical bars of varying heights, no frame                   | bar chart/graph, statistics & metrics, data comparison, analytics, sales figures      |       |
| ShowChart    | Single zig-zag line trending upward (stock ticker, no axes)  | line chart, analytics/trends, stock/financial data, performance metrics, growth       |       |
| AutoGraph    | Line graph with a trending line and star/sparkle accents     | auto-generated chart, trend analytics, AI insights/forecast, performance over time    |       |
| Insights     | Connected dots forming an upward trend with a chart node     | insights/analytics, data trends, statistics/metrics, reports, performance/growth      |       |
| Timeline     | Line with connected points moving upward (event-line)        | timeline of events, project history/milestones, activity feed, progress over time     |       |
| TrendingUp   | Upward-sloping line with arrowhead at upper-right            | increasing trend, growth/gain, upturn, positive performance, price rise               |       |
| TrendingDown | Downward-sloping line with arrowhead at lower-right          | decreasing trend, loss/decline, downturn, negative growth, price drop                 |       |
| Speed        | Circular speedometer/gauge dial with a needle                | speed/performance, dashboard gauge, speedometer, fast mode, metrics & tuning          |       |
| Table        | Top bar across with a body below (data-table header row)     | data table/grid, spreadsheet view, tabular layout, database table, roster             |       |
| Storage      | Stacked horizontal bars/drawers (server rack / list of rows) | storage/disk, database/server, data archive, capacity/usage, file storage drives      |       |

## Buildings, Places & Maps

| Icon              | Appearance                                                     | Use-cases                                                                           | Notes                   |
| ----------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------- |
| Apartment         | Multi-story facade with a grid of windows (tall block)         | apartment/residence, building/property, real estate, company office, city/urban     |                         |
| Business          | Commercial building with a grid of windows (office block)      | business/company, corporate office, organization, workplace, enterprise             | DUP → keep **Business** |
| Domain            | Office/apartment building facade with a grid of small windows  | company/organization, domain/website, business entity, office building, real estate | DUP retire → Business   |
| LocationCity      | Cluster of tall buildings / city skyline with windows          | city/urban area, company HQ/office, real estate/property, business district         |                         |
| Home              | Solid filled house with a peaked roof                          | home/homepage, dashboard start, main menu, go home, house/property                  |                         |
| HomeWork          | A house combined with an office building, side by side         | home office/remote work, work from home, real estate, hybrid workplace              |                         |
| Store             | Storefront with awning roofline and entrance                   | shop/store, marketplace, retail business, vendor/merchant, point of sale            |                         |
| Map               | Folded paper map: rectangle divided into panels with creases   | map view, navigation/directions, explore area/regions, geographic overview          |                         |
| Location          | Solid map pin/teardrop, point at bottom, hollow circle center  | map location/place marker, address/store location, check-in, point of interest      | DUP → keep **Location** |
| LocationOn        | Filled teardrop map pin with a small hollow dot, pointing down | pinned location/you-are-here, map marker/drop pin, saved place, navigation target   | DUP retire → Location   |
| LocationSearching | Crosshair/reticle: center dot, ring, four tick marks           | locate me/find GPS, GPS targeting/locking, center map, precision aim/focus          |                         |
| Public            | Globe: circle with latitude/longitude grid and continents      | public/worldwide, internet/web/global, language/region, share publicly              |                         |
| Spa               | Lotus flower / petals fanning up from a rounded base           | spa/wellness, relaxation/self-care, beauty services, health/meditation, nature      |                         |

## Devices, Network & Infrastructure

| Icon                   | Appearance                                                   | Use-cases                                                                               | Notes |
| ---------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----- |
| DesktopWindows         | Desktop monitor screen on a small stand/base                 | desktop computer, display/screen, workstation, desktop view, monitor device             |       |
| Devices                | A laptop and a smartphone side by side                       | multiple devices, responsive/cross-device, device management, sync, hardware list       |       |
| Smartphone             | Tall rounded rectangle in portrait (mobile phone body)       | mobile phone, mobile/responsive view, contact by phone, app on mobile, phone layout     |       |
| Tablet                 | Wide rounded rectangle in landscape (tablet device)          | tablet device, responsive (medium screen), reading device, app on tablet, device select |       |
| Mouse                  | Computer mouse top view, center scroll-wheel line            | mouse/pointer device, click interaction, input settings/peripherals, cursor/hardware    |       |
| ScreenRotation         | Device/rectangle tilted with a curved rotation arrow         | screen rotation/orientation, rotate display, auto-rotate, portrait-landscape toggle     |       |
| AccountTree            | Connected nodes/boxes linked by branching lines (hierarchy)  | org chart/hierarchy, tree structure/node graph, workflow/pipeline, file tree            |       |
| Lan                    | Central node connected downward to several child nodes       | LAN/local network, network topology, org chart/hierarchy, connected nodes, infra map    |       |
| DeviceHub              | Central node connected by spokes to surrounding dots (hub)   | connected devices hub, network topology, IoT/device mgmt, integration point             |       |
| Hub                    | Central dot emitting concentric broadcast arcs both sides    | hub/broadcast, wireless signal/connectivity, network center, live/streaming, node       |       |
| Dns                    | Two stacked server/rack bars, each with indicator-light dots | DNS settings, server/hosting, storage racks, database servers, infrastructure           |       |
| Router                 | Flat box with status light and antenna emitting signal waves | router/networking hardware, Wi-Fi/wireless, internet device/modem, network settings     |       |
| Wifi                   | Concentric arc waves radiating up from a dot                 | wifi/wireless connection, signal strength, internet connectivity, hotspot, online       |       |
| WifiOff                | Wi-Fi arcs with a diagonal slash through them                | wifi off/disconnected, no internet, airplane/offline mode, unavailable, disable         |       |
| NetworkCheck           | Paper-plane/pennant arrow swooshing toward upper right       | network speed test/check, connectivity status, send/transmit, signal/throughput         |       |
| Web                    | Browser window outline with a top bar of small blocks        | website/web page, browser/internet, go online, web view, domain/URL                     |       |
| Extension              | Jigsaw puzzle piece with knob and socket tabs                | plugin/extension, add-on/module, integration piece, compatibility, feature add          |       |
| PrecisionManufacturing | Articulated robotic arm with a jointed claw end              | manufacturing/production, automation/robotics, assembly line/factory, machinery         |       |

## Media & Playback

| Icon         | Appearance                                                        | Use-cases                                                                          | Notes |
| ------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----- |
| PlayArrow    | Right-pointing solid triangle (play button)                       | play/start playback, resume, run/begin, next/proceed                               |       |
| SkipNext     | Right-pointing triangle with a thin vertical bar at its tip       | skip to next track, next item/step, media forward, fast-forward, advance playlist  |       |
| Videocam     | Rectangular camera body with a triangular lens nub pointing right | video camera/record, start a video call, camera on, record video, live stream      |       |
| VideoLibrary | Stacked rectangles with a play triangle on the front one          | video library/playlist, media collection, saved videos, content gallery, archive   |       |
| Animation    | Three overlapping circles/rings (motion cluster)                  | animation/motion, transitions & effects, linked frames, loop/cycle, layered media  |       |
| AutoAwesome  | Large four-point sparkle/star with two smaller sparkles           | AI/auto-magic feature, enhance/generate, new & special, highlight/recommend, smart |       |
| Campaign     | Megaphone/bullhorn with broadcast lines                           | campaign/announcement, marketing & promotion, broadcast/notify, advertising        |       |
| WaterDrop    | Single teardrop/water-droplet shape                               | water/liquid, humidity/moisture, hydration, fluid level, weather/rain              |       |

## Layout, Views & Lists

| Icon         | Appearance                                                       | Use-cases                                                                             | Notes |
| ------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----- |
| Dashboard    | 2×2 grid where the top-left tile is taller/larger (widget panel) | dashboard/home overview, widgets panel, app modules grid, control center, summary     |       |
| GridView     | 2×2 grid of equal rounded squares                                | grid view/layout toggle, gallery/tiles, app modules, card layout, view as grid        |       |
| ViewModule   | Grid of equal small squares (tiled)                              | grid/module view, gallery layout, app tiles dashboard, card grid, thumbnail grid      |       |
| ViewCompact  | A few vertical panel blocks of differing widths                  | compact view layout, dense grid display, column arrangement, density toggle           |       |
| ViewHeadline | Several full-width horizontal lines stacked evenly               | headline/feed view, article list layout, stacked rows, text list view, content stream |       |
| ViewKanban   | Vertical columns each holding stacked cards (kanban board)       | kanban board view, task/workflow columns, project board, drag-drop cards, pipeline    |       |
| ViewList     | Rows of a small leading square (bullet) plus a horizontal line   | list view, itemized list, menu/directory, row layout toggle, checklist/feed           |       |
| ViewSidebar  | Rectangle split with a narrow vertical panel on one side         | sidebar layout view, panel/nav drawer, split pane, toggle sidebar, app shell          |       |
| ListAlt      | Rounded card with list lines each with a leading marker          | list view, detailed list/table, menu items, tasks/records, view all entries           |       |
| Widgets      | Several small shapes (squares + a diamond) clustered 2×2         | widgets/components, dashboard add-ons, app gallery tiles, modular UI, customize       |       |
| Preview      | Framed window with a small circular eye/lens centered            | preview content, view/inspect, quick look/see, display/render check                   |       |

## Text Formatting

| Icon               | Appearance                                                      | Use-cases                                                                                  | Notes |
| ------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----- |
| FormatBold         | A bold capital letter B                                         | bold text, rich-text formatting, emphasize/strong, editor toolbar, bold heading            |       |
| FormatItalic       | A slanted/italic capital letter I                               | italic text, rich-text formatting, emphasis/slant, editor toolbar, style text              |       |
| FormatUnderlined   | A capital letter U with a horizontal underline bar              | underline text, rich-text formatting, editor toolbar, emphasize, link styling              |       |
| StrikethroughS     | A letter S with a horizontal line struck through it             | strikethrough text, cross out/deleted text, editor toolbar, mark obsolete, format toggle   |       |
| FormatAlignLeft    | Text lines flush left, alternating shorter lines left-aligned   | align left text, left justify, editor toolbar, default paragraph alignment, left layout    |       |
| FormatAlignCenter  | Text lines centered, alternating shorter lines centered         | align center text, center formatting, editor toolbar, paragraph alignment, centered        |       |
| FormatAlignRight   | Text lines flush right, alternating shorter lines right-aligned | align right text, right justify, editor toolbar, RTL alignment, right layout               |       |
| FormatListBulleted | Three text lines each preceded by a bullet dot                  | bulleted list, unordered list, list view, menu items, outline points                       |       |
| FormatListNumbered | Three text lines each preceded by a number (1,2,3)              | numbered list, ordered list/steps, ranking, sequence/procedure, table of contents          |       |
| PlaylistAddCheck   | Three list lines with a checkmark right of the bottom line      | add to playlist with confirmation, mark items done, completed checklist, verified queue    |       |
| TextFields         | A large T next to a small t (capital and lowercase)             | text field input, font/typography settings, add/edit text, text formatting, content editor |       |

## Security & Identity

| Icon          | Appearance                                                     | Use-cases                                                                              | Notes                                                       |
| ------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Lock          | Closed padlock: rounded body with a fixed semicircular shackle | security/locked, password protection/auth, privacy/restricted, encryption/secure       |                                                             |
| Security      | Shield outline with a small padlock inside                     | security/protection, privacy/data safety, auth/access control, firewall/safeguard      |                                                             |
| Shield        | Shield/crest with a small padlock embossed in its center       | protection/security, privacy guard/safety, insurance/coverage, defense/safeguard       |                                                             |
| VerifiedUser  | Shield outline with a check/tick mark inside                   | verified account/user, trusted/secure, security badge, auth confirmed, protection      |                                                             |
| Fingerprint   | Concentric curved fingerprint ridge lines (partial swirl)      | fingerprint/biometric login, identity verification, security/auth, privacy, unique ID  |                                                             |
| VpnKey        | Key shape: round looped head + notched shaft (angled key)      | password/access key, VPN credential, auth/login, unlock/secure access, API key         |                                                             |
| VpnLock       | Rounded square/shield containing a lock/padlock glyph          | secured VPN connection, locked/encrypted network, private connection, protected access |                                                             |
| Login         | Arrow pointing right into a vertical bar / open doorframe      | sign in/log in, enter/access account, authenticate session, join/entry point           |                                                             |
| LogoutRounded | Rounded doorway/box with an arrow pointing right out of it     | sign out/log out, exit/leave session, disconnect account, end session/quit             |                                                             |
| Gavel         | A judge's gavel/mallet at a diagonal                           | legal/law, rulings/judgment, auction/bidding, terms & policies, moderation             |                                                             |
| Visibility    | Open eye with a circular pupil/iris (clearly visible)          | show/visible, reveal password, preview content, visibility on, watch/monitor           | DUP → keep **Visibility**                                   |
| View          | Simple open eye shape with a round pupil in the center         | view/preview, show or display, visibility on, read-only look, watch/observe            | DUP retire → Visibility                                     |
| VisibilityOff | Open eye crossed out by a diagonal slash                       | hide/invisible, mask password, visibility off, conceal content, mute display           |                                                             |
| ShowHideEye   | Eye outline with a diagonal slash crossing through it          | hide/show toggle, mask/reveal password, privacy off, hidden state, toggle visibility   | (near-twin of VisibilityOff; differs by outline vs. filled) |

## Communication & Notifications

| Icon                  | Appearance                                                       | Use-cases                                                                         | Notes                |
| --------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------- |
| Chat                  | Speech/chat bubble with a tail containing a text line            | chat/messaging, comments/conversation, support/help chat, feedback, discussion    |                      |
| Sms                   | Rounded speech bubble with three horizontal dots and a tail      | text message/SMS, chat/messaging, comments, notifications, conversation thread    |                      |
| Feedback              | Speech/chat bubble with an exclamation mark inside               | feedback/report, comment with alert, send a note, flag an issue, survey/opinion   |                      |
| RateReview            | Speech/comment bubble with a checkmark or pencil inside          | rate and review, leave feedback/comment, write a review, approve/mark message     |                      |
| Email                 | Sealed envelope with the triangular flap fold across the top     | email/mail, send message, inbox, contact/notify, newsletter subscription          | DUP → keep **Email** |
| Outlook               | Sealed envelope (rectangle with a triangular flap)               | email/inbox, compose message, mail client/Outlook, contact/send mail              | DUP retire → Email   |
| Phone                 | Classic handset receiver tilted diagonally                       | call/dial phone, contact by phone, voice support/hotline, phone number/telephone  |                      |
| Notifications         | Simple upright bell with a small clapper dot                     | notifications/alerts, reminders, announcements, activity bell                     |                      |
| NotificationActive    | Bell tilted/ringing with motion lines and a clapper dot          | active alerts/new notifications, ringing alarm/reminder, sound on, incoming alert |                      |
| NotificationImportant | A bell with an exclamation mark inside its body                  | important/urgent notification, priority alert, critical reminder, warning notice  |                      |
| Support               | Circular gear/lifebuoy ring with a person/headset hint at center | customer support, help desk, contact/assist, service center, live agent help      |                      |

## Misc, Brand & Numerals

| Icon             | Appearance                                                    | Use-cases                                                                          | Notes |
| ---------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----- |
| Favorite         | A solid filled heart                                          | favorite/like, save to favorites, love/wishlist, add to favorites, mark important  |       |
| FavoriteBorder   | An outlined (hollow) heart                                    | add to favorites (unselected), like toggle, wishlist, save for later, follow       |       |
| Star             | A solid filled five-pointed star                              | favorite/bookmark, rating/review, featured item, mark important, reward/quality    |       |
| StarBorder       | A five-pointed star drawn as an outline (hollow)              | unrated/unfavorited, add to favorites toggle, empty rating, bookmark off, wishlist |       |
| ThumbUp          | A hand with thumb extended upward                             | like/approve, upvote, positive feedback, agree/endorse, rate as good               |       |
| BugReport        | A beetle/insect (bug) body with legs and antennae             | bug report/issue, report a problem, debug/defect tracking, error/fault, QA/testing |       |
| School           | Graduation cap / mortarboard with tassel                      | education/school, graduation/degree, learning/courses/training, academic/student   |       |
| WorkspacePremium | Badge/seal medallion with a star inside (premium award)       | premium workspace/plan, certified/award badge, upgraded tier, achievement seal     |       |
| LocalHospital    | Solid square/badge with a plus/cross cut out (medical cross)  | hospital/medical, first aid/emergency, add (plus), health services, clinic on map  |       |
| QrCode           | QR code grid of modules with three corner positioning squares | QR code/scan-to-link, share contact or URL, product code/label, quick mobile link  |       |
| QrCodeScanner    | QR-code pattern framed by four corner brackets (viewfinder)   | scan QR code, camera scan/capture, point-of-scan checkout, read barcode/decode     |       |
| Apple            | Apple logo silhouette: apple with a bite and a leaf           | Apple/iOS/macOS, Apple device/platform, sign in with Apple, App Store, tech brand  |       |
| Google           | Google brand capital letter G                                 | sign in with Google, Google account/OAuth, Google services, search, connect Google |       |
| Link             | Two interlocking chain links at a diagonal                    | hyperlink/URL, copy link, attach/connect, share link, linked items                 |       |
| LooksOne         | Rounded square tile containing the numeral 1                  | step 1/first item, number one rank/top, numbered badge, single quantity/first page |       |
| LooksTwo         | Rounded square tile containing the numeral 2                  | step 2/second item, rank/rating of two, numbered badge, page 2/level 2             |       |
| LooksThree       | Rounded square tile containing the numeral 3                  | step 3/page 3, rank/rating of three, numbered list marker, third tier/level 3      |       |
| LooksFour        | Rounded square tile containing the numeral 4                  | step 4/page 4, rating/rank of four, numbered list item, filter/quantity selector   |       |

---

## Exact-Duplicate Pairs

Thirteen pairs render the identical glyph. For each, keep the **canonical**
icon and collapse the duplicate's use-case names onto it. The aliases below are
the semantic names that should fold onto the canonical icon. (Retiring is a
plan-level decision — see `ICON-MIGRATION-PLAN.md`; this section only records
which name survives and which use-cases collapse.)

| Canonical (keep)       | Duplicate (retire) | Aliased use-cases that collapse onto the canonical                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Business**           | Domain             | "domain/website", "business entity" → use Business; (LocationCity/Domain skyline nuance handled by LocationCity)                                                                                                                                                                                                                                                                                                                                                                                 |
| **Calendar**           | CalendarToday      | "today / current date", "single-day schedule", "jump to today" → Calendar                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **CircleOutline**      | RadioButtonChecked | NOTE: opposite visual states — CircleOutline is the _empty_ ring (unselected), RadioButtonChecked is the _filled-dot_ (selected). The catalog lists them as an exact pair; before retiring, the USER must confirm whether the codebase relies on the filled-dot variant for "selected radio / record / live". If not used as a distinct selected state, "selected option/radio choice", "record/live indicator" collapse onto CircleOutline. **Flagged for confirmation, not auto-retire.**      |
| **Clear** _(or Close)_ | Close _(or Clear)_ | Identical X glyph. Keep one; "close dialog/modal", "dismiss panel", "exit/cancel" all map to it. Recommend keep **Close** (more common DOM intent) and alias Clear.                                                                                                                                                                                                                                                                                                                              |
| **ContentCopy**        | Duplicate          | "duplicate item", "clone/replicate", "make a copy", "stacked layers" → ContentCopy                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Edit**               | Create             | "create/write", "compose new", "draft/annotate" → Edit                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **CreditCard**         | Payment            | "payment/checkout", "add payment method", "transaction/pay now" → CreditCard                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **DragIndicator**      | Drag               | "drag handle/reorder", "move element", "grip/sortable" → DragIndicator (note: Drag is a full 3×3 dot matrix vs DragIndicator's 2×3; treat as exact per catalog, keep the 6-dot grip)                                                                                                                                                                                                                                                                                                             |
| **Email**              | Outlook            | "email/inbox", "compose message", "mail client/Outlook", "send mail" → Email                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Person**             | Group              | NOTE: in the catalog "Group" is described as a **single** bust (same as Person) — but the consuming ThothOS app deliberately uses `GroupIcon` as a **multi-person** glyph to contrast with single `PersonIcon`. If the goobs `Group` glyph is genuinely single-person, ThothOS's contrast is broken and ThothOS should switch its "customer" multi-person use to **People** or **Groups**. **Flagged for confirmation.** Aliases "user/person", "single contact", "member" collapse onto Person. |
| **Location**           | LocationOn         | "pinned location/you-are-here", "map marker/drop pin", "saved place", "navigation target" → Location                                                                                                                                                                                                                                                                                                                                                                                             |
| **MonetizationOn**     | Money              | "money/cash", "balance/funds", "price/cost", "financial/banking" → MonetizationOn                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Visibility**         | View               | "view/preview", "show or display", "read-only look", "watch/observe" → Visibility                                                                                                                                                                                                                                                                                                                                                                                                                |

> ✅ **CloudSync** was already repaired and is canonical; no dedup action needed there.
