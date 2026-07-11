import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * random-id-in-render
 * -------------------
 * A non-deterministic value (`Math.random()`, `Date.now()`,
 * `crypto.randomUUID()`) that is computed during a component's RENDER and flows
 * into a stable-identity attribute — a JSX `id` / `key` / `htmlFor` / `aria-*`
 * attribute, or an `id`/`key`-named variable used as one — is a GUARANTEED
 * hydration mismatch: the server render and the client render produce different
 * strings for the same node, so React tears down and rebuilds the subtree (and
 * the value is unstable across every render, defeating keys/memoisation).
 *
 * Fix: derive the id/key deterministically (React `useId()` for a rendered id,
 * or a stable content-derived key) instead of a random/time value.
 *
 * WHAT IS NOT FLAGGED (legitimate escape hatches, encoded in the check — never
 * an ignore-list):
 *   - `Math.random()` used for NON-identity output (canvas particle
 *     coordinates, sizes, opacities) — it never reaches an id/key attribute.
 *   - a random/time value produced inside a useEffect / event handler /
 *     useState initializer that is NOT wired into a JSX id/key/htmlFor/aria
 *     attribute (client-only, post-hydration — no SSR text to mismatch).
 *   - `id: `\``...${Date.now()}`\`` on an object literal built inside a handler
 *     (a brand-new client-side entity id), which is not a render-scope
 *     declaration nor a JSX attribute.
 */

const NONDET = String.raw`(?:Math\.random\s*\(\s*\)|Date\.now\s*\(\s*\)|crypto\.randomUUID\s*\(\s*\))`
// Random-but-not-monotonic sources for the fallback-key shape (Date.now() is
// deliberately excluded here: a `|| Date.now()` fallback is a common, defensible
// "new timestamp id" and is not an unstable *shuffle* of an existing key).
const RANDOM_ONLY = String.raw`(?:Math\.random\s*\(\s*\)|crypto\.randomUUID\s*\(\s*\))`

// A JSX identity attribute whose braced expression contains a non-deterministic
// call: id={...}, key={...}, htmlFor={...}, aria-*={...}. `[^}]*` stops at the
// first `}` which still spans a single `${...}` interpolation.
const JSX_ATTR_INLINE = new RegExp(
  String.raw`\b(?:id|key|htmlFor|aria-[\w-]+)\s*=\s*\{[^}]*\b${NONDET}`
)

// A render-scope declaration that assigns a non-deterministic value.
const DECL_NONDET = new RegExp(
  String.raw`^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=[^=].*?${NONDET}`
)

// An id/key-named declaration whose right-hand side is a `||` / `??` fallback
// chain ending in a random value (the "unstable fallback key" shape).
const FALLBACK_ID_DECL = new RegExp(
  String.raw`^\s*(?:const|let|var)\s+(id|key|[A-Za-z_$][\w$]*(?:Id|Key))\s*=\s*[^=].*(?:\|\||\?\?)[^;]*?${RANDOM_ONLY}`
)

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const lint: A11yLint = {
  name: 'random-id-in-render',
  wcag: '4.1.1',
  description:
    'A Math.random()/Date.now()/crypto.randomUUID() value computed in render and used as a JSX id/key/htmlFor/aria attribute (or an id/key-named fallback) mismatches between server and client — use useId() or a stable derivation.',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text } of files) {
      const lines = text.split('\n')

      // Shape A: inline non-deterministic JSX identity attribute.
      // Shape C: id/key-named fallback declaration ending in a random value.
      lines.forEach((line, i) => {
        if (JSX_ATTR_INLINE.test(line)) {
          violations.push({
            file: path,
            line: i + 1,
            message:
              'non-deterministic value in a JSX id/key/htmlFor/aria attribute — hydration mismatch; use useId() or a stable derivation',
          })
        } else if (FALLBACK_ID_DECL.test(line)) {
          violations.push({
            file: path,
            line: i + 1,
            message:
              'unstable id/key fallback derived from Math.random()/crypto.randomUUID() — the key changes every call; derive it deterministically',
          })
        }
      })

      // Shape B: a render-scope variable assigned a non-deterministic value
      // that is later consumed by a JSX id/key/htmlFor/aria attribute.
      lines.forEach((line, i) => {
        const decl = DECL_NONDET.exec(line)
        if (!decl) return
        const name = decl[1]
        const usedInIdAttr = new RegExp(
          String.raw`\b(?:id|key|htmlFor|aria-[\w-]+)\s*=\s*\{[^}]*\b${escapeRegex(name)}\b`
        )
        if (usedInIdAttr.test(text)) {
          violations.push({
            file: path,
            line: i + 1,
            message: `'${name}' is derived from a non-deterministic value and used as a JSX id/key/htmlFor/aria attribute — hydration mismatch; use useId() or a stable derivation`,
          })
        }
      })
    }
    return violations
  },
  selftest: {
    bad: [
      // Shape A — inline random in an id attribute.
      "export const A = () => <span id={'currency-' + Math.random().toString(36)}>x</span>",
      // Shape B — random assigned to a var, used as a JSX id.
      'export const B = () => {\n  const formatId = `currency-${Math.random().toString(36)}`\n  return <span id={formatId}>x</span>\n}',
      // Shape C — id-named fallback ending in Math.random().
      'export function rowKey(row: { _id?: string; id?: string }) {\n  const id = row._id || row.id || Math.random().toString(36)\n  return id\n}',
      // Shape A — template key with crypto.randomUUID().
      'export const D = () => <li key={`k-${crypto.randomUUID()}`}>x</li>',
    ],
    good: [
      // useState initializer producing a random value not wired to an id attr.
      'export const G1 = () => {\n  const [t] = useState(() => Math.random().toString(36))\n  return <span id="static">{t}</span>\n}',
      // Random in a useEffect, assigned to `id`, never used as a JSX id attr.
      'export const G2 = () => {\n  const ref = useRef(null)\n  useEffect(() => {\n    const id = Math.random().toString(36)\n    if (ref.current) ref.current.dataset.token = id\n  }, [])\n  return <span ref={ref} />\n}',
      // New client entity id built inside a handler-scoped object literal.
      'export const G3 = () => {\n  const makeItem = () => ({ _id: `t-${Date.now()}-${Math.random().toString(36)}` })\n  return <button onClick={() => console.log(makeItem())}>go</button>\n}',
      // Canvas particle coordinates — random, but never an identity attribute.
      'export const G4 = () => {\n  useEffect(() => {\n    const nodes = Array.from({ length: 3 }, () => ({ x: Math.random(), y: Math.random() }))\n    void nodes\n  }, [])\n  return <canvas />\n}',
      // Deterministic id via useId — the sanctioned fix.
      'export const G5 = () => {\n  const uid = useId()\n  return <span id={`currency-${uid}`}>x</span>\n}',
    ],
  },
}

export default lint
