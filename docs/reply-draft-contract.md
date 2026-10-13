# Reply save completion

W-2058 is the goobs companion to ThothOS W-1957. `InlineShowTask` and
`ProjectBoard` accept synchronous or promise-returning comment writers. An async
writer must resolve after persistence succeeds and reject when it fails.

- Pending, rejected and aborted writes preserve the exact draft.
- A pending composer starts at most one write, including clicks before React renders.
- Success clears only the submitted draft. A later typed draft or a canceled and
  reopened editor survives an older completion.
- Explicit Cancel discards the edit without starting a write.
- ProjectBoard forwards completion and changes its saved comment text only after
  the host edit succeeds. The host remains responsible for persistence and refresh.
- The existing audience, permissions and comment classification rules are unchanged.

`bun scripts/test-reply-drafts.ts` bundles the real source components into an isolated
browser fixture and runs both Detail and Board. The Storybook fixture supplies a
controlled transport with resolve, reject, abort and synchronous controls. It proves
component state and callback behavior, not a ThothOS server/database journey.

`bun run lint:reply-completion` scans every non-story ProjectBoard TS/TSX source
file for discarded direct reply writes. Its selftest contains three planted defects
and three clean controls. It is a structural fence for direct calls, not a general
promise-flow analyzer; the browser cases prove draft retention and stale-completion
behavior. Both checks are wired into the corresponding package gates.

ThothOS also needs rejection-preserving handlers and promise forwarding in its help
workspace. These changes must be consumed together with a published goobs version.
Source tests do not authorize a release, dependency rollout or production integration.
