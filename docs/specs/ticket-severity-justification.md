# Ticket severity justification (W-977)

Staff and customers set severity in either direction through one editor.
The host callback is `onSetSeverity({taskId, severityId, reason})`, returning
`void` or `Promise<void>`; the customer `onRaiseSeverity` remains compatible.

- Changed severity requires a trimmed reason of 20 through 2000 characters.
- Invalid input displays an error and never calls the host.
- Unchanged severity is a no-op without a required reason.
- Pending saves disable editing/cancel and block same-batch duplicate clicks.
- Rejection displays the error and preserves the draft for retry; success clears it.
- Option refreshes preserve drafts. The editor is keyed by ticket identity.
- All board variants forward the setter; read-only permissions withhold it.
- Generic `onEdit` payloads never include severity. Other staff-only fields
  stay unavailable to customers.

Implementation lives in ProjectBoard `index.tsx`, `types/index.tsx`, and
`forms/ShowTask/inline.tsx`; its fixtures are the InlineForms and Board stories.
`bun run test:severity` runs real-browser regressions and the six CSF plays.
CI includes these in `test:browser`. Typecheck, lint:all, library/Storybook
builds and package/API/budget gates must pass for release. The read-only
regression was red across all three variants before the shared forwarding fix.
`lint:ticket-severity` runs a planted/clean selftest and scans generic `onEdit`
object literals for severity writes; lint:all includes this bounded guard.

The ThothOS owner lane owns server enforcement, consumer wiring and full-stack
acceptance. Publishing belongs to the operator; local library evidence does
not prove a consumer has installed the new package.
