import type { A11yLint, LintFile, Violation } from '../lint-a11y'

/**
 * CLASS: media-requires-alternatives — the HEARING-IMPAIRMENT WALL
 * (WCAG 1.2.1 Audio-only/Video-only, 1.2.2 Captions, 1.4.2 Audio Control).
 *
 * The library ships ZERO audio/video today. This module is not a fix for an
 * existing bug — it is a PERMANENT WALL that guarantees no future component ever
 * conveys information by SOUND (or HAPTICS) alone, which excludes deaf and
 * hard-of-hearing users. It flags three shapes in shipped src (ts/tsx, minus
 * .d.ts and stories):
 *
 *  (a) A `<audio>` / `<video>` JSX element that lacks BOTH a captions/subtitles
 *      `<track>` child AND a `controls` attribute — i.e. it provides no text
 *      alternative for its audio (1.2.1/1.2.2) AND no way to pause/stop it
 *      (1.4.2). Having EITHER a `<track kind="captions"|"subtitles">` child OR
 *      `controls` exempts it. `kind="descriptions"|"chapters"|"metadata"` do NOT
 *      count — only captions/subtitles carry the spoken content for a deaf user.
 *
 *  (b) `new Audio(` / `new AudioContext(` / `new webkitAudioContext(` /
 *      `navigator.vibrate(` used ANYWHERE in a component (render or handler) —
 *      sound and vibration are a NON-VISUAL UI channel. Information signalled by
 *      a beep or a buzz alone is invisible to a deaf/hard-of-hearing user, so it
 *      MUST be paired with a visible + programmatically-exposed signal
 *      (an on-screen change AND an aria-live/role announcement). When such a pair
 *      genuinely lands, the author documents it with the escape hatch below.
 *
 *  (c) `autoPlay` on `<audio>` / `<video>` without `muted` — audio that starts
 *      automatically and plays for more than 3s with no immediate control
 *      violates 1.4.2. `muted` (silent autoplay) is the WCAG-safe pattern and
 *      exempts it.
 *
 * ── ESCAPE HATCHES (encoded in the check, never a file ignore-list) ──────────
 *  • (a) has a captions/subtitles `<track>` child OR a `controls` attribute.
 *  • (c) has a `muted` attribute (and `controls={false}` / `muted={false}` /
 *        `autoPlay={false}` are honoured — an explicit `{false}` means "off").
 *  • ALL shapes: a DOCUMENTED comment hatch. A `//` or `/* … *\/` comment
 *    containing the token `a11y-media-alternative` — placed on the flagged line
 *    or up to two lines above it — records that the author has supplied the
 *    required visual + programmatic alternative for this specific sound/media.
 *    This is NOT lint suppression (rule R10): it does not silence a real defect,
 *    it is the spec-sanctioned way to declare that the sound channel HAS the
 *    accessible pair the WCAG criteria demand, WITH a written justification. The
 *    token must be deliberate and local, so a blanket file-level opt-out is
 *    impossible.
 *
 * ── PRECISION (false positives are poison — under-measure ambiguity) ─────────
 *  • Only lower-case host elements `<audio>` / `<video>` are scanned; a custom
 *    `<Video>`/`<AudioPlayer>` component is not a raw media element (its own
 *    implementation, if it renders a raw `<video>`, is what gets scanned).
 *  • Comments are blanked before the tag scan (string-aware), so a JSDoc or a
 *    dev-warning string that mentions `<video>` or `new Audio()` is never read as
 *    code. For shape (b) STRING LITERALS are additionally blanked, so
 *    `"call new Audio()"` in a message is not a call.
 *  • The opening tag is read brace/string-aware so a `>` inside `onError={() =>
 *    …}` or an attribute string does not terminate it early.
 */

const HATCH_TOKEN = 'a11y-media-alternative'

/**
 * Blank `//` line comments and `/* … *\/` block comments to spaces, preserving
 * every newline (so byte offsets and line numbers are unchanged). String-aware:
 * a `//` inside a string (an `https://` URL, a selector) is not a comment.
 */
function blankComments(text: string): string {
  const out = text.split('')
  let str: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      continue
    }
    if (c === '/' && text[i + 1] === '/') {
      let j = i
      while (j < text.length && text[j] !== '\n') {
        out[j] = ' '
        j++
      }
      i = j - 1
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      let j = i
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) {
        if (text[j] !== '\n') out[j] = ' '
        j++
      }
      if (j < text.length) {
        out[j] = ' '
        out[j + 1] = ' '
        j += 1
      }
      i = j
      continue
    }
  }
  return out.join('')
}

/**
 * Blank the CONTENT of string/template literals to spaces (keeping the delimiter
 * quotes and every newline), on top of an already comment-blanked text. Used
 * ONLY for the shape-(b) constructor scan so a `new Audio(` mentioned inside a
 * string literal is not counted as a real call. Escape sequences are handled so
 * a `\"` never closes the string early.
 */
function blankStrings(text: string): string {
  const out = text.split('')
  let quote: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quote) {
      if (c === '\\') {
        if (text[i] !== '\n') out[i] = ' '
        if (i + 1 < text.length && text[i + 1] !== '\n') out[i + 1] = ' '
        i++
        continue
      }
      if (c === quote) {
        quote = null
        continue
      }
      if (c !== '\n') out[i] = ' '
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      quote = c
      continue
    }
  }
  return out.join('')
}

/** Offsets of every `\n` in the text (for O(log n) offset→line lookup). */
function newlineIndex(text: string): number[] {
  const out: number[] = []
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') out.push(i)
  return out
}

/** 1-based line number of a byte offset. */
function offsetToLine(newlineOffsets: number[], offset: number): number {
  let lo = 0
  let hi = newlineOffsets.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (newlineOffsets[mid] < offset) lo = mid + 1
    else hi = mid
  }
  return lo + 1
}

/**
 * Read a JSX opening tag starting at `<` (offset `tagStart`). Brace- and
 * string-aware so a `>` inside `onError={() => f()}`, a `` `template ${x}` ``,
 * or an attribute string is not mistaken for the tag terminator. Returns the
 * closing-`>` offset, the tag body (inclusive), and whether it self-closes
 * (`/>`). Null if unterminated.
 */
function readOpeningTag(
  text: string,
  tagStart: number
): { end: number; body: string; selfClosing: boolean } | null {
  let depth = 0
  let str: string | null = null
  let lastNonSpace = ''
  for (let i = tagStart; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      lastNonSpace = c
      continue
    }
    if (c === '{') {
      depth++
      lastNonSpace = c
      continue
    }
    if (c === '}') {
      if (depth > 0) depth--
      lastNonSpace = c
      continue
    }
    if (c === '>' && depth === 0) {
      return {
        end: i,
        body: text.slice(tagStart, i + 1),
        selfClosing: lastNonSpace === '/',
      }
    }
    if (c !== ' ' && c !== '\t' && c !== '\n' && c !== '\r') lastNonSpace = c
  }
  return null
}

/**
 * True when a boolean-ish JSX attribute `name` is PRESENT and not explicitly
 * turned off with `={false}`. The attribute must sit at an attribute boundary
 * (preceded by whitespace) so `data-controls` / `controlsList` do not count as
 * `controls`, and it must not be continued by a word char (`\b`). Case-
 * insensitive to tolerate `autoPlay` vs `autoplay`.
 */
function hasAttr(body: string, name: string): boolean {
  const present = new RegExp(`[\\s]${name}\\b`, 'i')
  if (!present.test(body)) return false
  const off = new RegExp(`[\\s]${name}\\s*=\\s*\\{\\s*false\\s*\\}`, 'i')
  return !off.test(body)
}

/**
 * True when the forward window of a media element contains a `<track>` whose
 * `kind` is captions or subtitles (the only track kinds that carry the spoken
 * content a deaf user needs). Each `<track>` is read brace/string-aware.
 */
function windowHasCaptionsTrack(win: string): boolean {
  const trackRe = /<track(?=[\s/>])/gi
  let tm: RegExpExecArray | null
  while ((tm = trackRe.exec(win))) {
    const t = readOpeningTag(win, tm.index)
    if (!t) continue
    if (/\bkind\s*=\s*['"](?:captions|subtitles)['"]/i.test(t.body)) return true
  }
  return false
}

/**
 * Line numbers "covered" by a documented `a11y-media-alternative` comment. A
 * violation is exempt when its line, or up to two lines below the comment, is
 * covered (so the hatch may trail the flagged line or sit directly above it).
 */
function collectHatchLines(text: string): Set<number> {
  const lines = new Set<number>()
  const nl = newlineIndex(text)
  let str: string | null = null
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (str) {
      if (c === '\\') {
        i++
        continue
      }
      if (c === str) str = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      continue
    }
    if (c === '/' && text[i + 1] === '/') {
      let j = i
      while (j < text.length && text[j] !== '\n') j++
      if (text.slice(i, j).includes(HATCH_TOKEN))
        lines.add(offsetToLine(nl, i))
      i = j - 1
      continue
    }
    if (c === '/' && text[i + 1] === '*') {
      let j = i
      while (j < text.length && !(text[j] === '*' && text[j + 1] === '/')) j++
      const end = Math.min(j + 1, text.length - 1)
      if (text.slice(i, end + 1).includes(HATCH_TOKEN)) {
        const startLn = offsetToLine(nl, i)
        const endLn = offsetToLine(nl, end)
        for (let L = startLn; L <= endLn; L++) lines.add(L)
      }
      i = j + 1
      continue
    }
  }
  return lines
}

/** A violation on `line` is hatched if a hatch comment is on it or ≤2 lines up. */
function isHatched(line: number, hatch: Set<number>): boolean {
  return hatch.has(line) || hatch.has(line - 1) || hatch.has(line - 2)
}

// Shape (b): sound/haptics constructors + APIs used as a UI channel. Disjoint
// patterns (a `new AudioContext(` never also matches `new Audio(`, since the
// latter requires `(` immediately after `Audio`).
const SOUND_API_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\bnew\s+Audio\s*\(/g, label: 'new Audio()' },
  { re: /\bnew\s+(?:window\.)?AudioContext\s*\(/g, label: 'new AudioContext()' },
  {
    re: /\bnew\s+(?:window\.)?webkitAudioContext\s*\(/g,
    label: 'new webkitAudioContext()',
  },
  { re: /\bnavigator\s*\.\s*vibrate\s*\(/g, label: 'navigator.vibrate()' },
]

const MEDIA_TAG_RE = /<(audio|video)(?=[\s/>])/g

const MSG_A =
  '<audio>/<video> with NEITHER a captions/subtitles <track> child NOR a ' +
  'controls attribute — a deaf/hard-of-hearing user gets no text alternative ' +
  'for the audio (WCAG 1.2.1/1.2.2) and no way to pause/stop it (WCAG 1.4.2). ' +
  'Add a <track kind="captions"|"subtitles"> child OR a controls attribute. If ' +
  'the media is genuinely silent/decorative, document it with an ' +
  '`a11y-media-alternative:` comment on or above this line.'

const MSG_C =
  'autoPlay on <audio>/<video> without muted — audio that auto-starts and plays ' +
  '>3s with no immediate control violates WCAG 1.4.2. Add `muted` (silent ' +
  'autoplay is the safe pattern) or drop autoPlay and give the user a control.'

function msgB(label: string): string {
  return (
    `sound/haptics used as a UI channel (${label}) — a signal conveyed by sound ` +
    'or vibration ALONE is invisible to deaf/hard-of-hearing users (WCAG ' +
    '1.2.1/1.4.2 family). Pair it with a visible on-screen change AND a ' +
    'programmatic aria-live/role announcement, then record the pair with an ' +
    '`a11y-media-alternative:` comment on or above this line.'
  )
}

const lint: A11yLint = {
  name: 'media-requires-alternatives',
  wcag: '1.2.1, 1.2.2, 1.4.2',
  description:
    'The hearing-impairment wall. Flags media/sound that conveys information by ' +
    'audio alone: (a) an <audio>/<video> lacking BOTH a captions/subtitles ' +
    '<track> child AND a controls attribute; (b) new Audio()/new AudioContext()/' +
    'new webkitAudioContext()/navigator.vibrate() used as a UI channel; and (c) ' +
    'autoPlay on media without muted. Escape hatches encoded in the check: a ' +
    'captions/subtitles track or controls (a); a muted attribute (c); and, for ' +
    'any legitimately-paired sound, a documented `a11y-media-alternative:` ' +
    'comment on or ≤2 lines above the flagged line (records the required ' +
    'visual+programmatic alternative — not lint suppression).',
  check(files: LintFile[]): Violation[] {
    const violations: Violation[] = []
    for (const { path, text: raw } of files) {
      const mediaPresent = /<(?:audio|video)(?=[\s/>])/.test(raw)
      const soundPresent =
        /\bnew\s+(?:window\.)?(?:Audio|AudioContext|webkitAudioContext)\s*\(/.test(
          raw
        ) || /\bnavigator\s*\.\s*vibrate\s*\(/.test(raw)
      if (!mediaPresent && !soundPresent) continue

      const commentBlanked = blankComments(raw)
      const nl = newlineIndex(raw)
      const hatch = collectHatchLines(raw)

      // Shapes (a) + (c): scan every <audio>/<video> opening tag.
      if (mediaPresent) {
        MEDIA_TAG_RE.lastIndex = 0
        let m: RegExpExecArray | null
        while ((m = MEDIA_TAG_RE.exec(commentBlanked))) {
          const name = m[1]
          const tag = readOpeningTag(commentBlanked, m.index)
          if (!tag) continue
          const line = offsetToLine(nl, m.index)
          const controls = hasAttr(tag.body, 'controls')
          const muted = hasAttr(tag.body, 'muted')
          const autoplay = hasAttr(tag.body, 'autoplay')

          // (c) autoPlay without muted.
          if (autoplay && !muted && !isHatched(line, hatch))
            violations.push({ file: path, line, message: MSG_C })

          // (a) neither a captions/subtitles track child nor controls.
          let hasTrack = false
          if (!tag.selfClosing) {
            const rest = commentBlanked.slice(tag.end + 1)
            const closeRe = new RegExp(`</${name}\\s*>`, 'i')
            const closeMatch = closeRe.exec(rest)
            const win = closeMatch ? rest.slice(0, closeMatch.index) : rest
            hasTrack = windowHasCaptionsTrack(win)
          }
          if (!hasTrack && !controls && !isHatched(line, hatch))
            violations.push({ file: path, line, message: MSG_A })
        }
      }

      // Shape (b): constructor/API scan over comment- AND string-blanked text.
      if (soundPresent) {
        const fullBlanked = blankStrings(commentBlanked)
        for (const { re, label } of SOUND_API_PATTERNS) {
          re.lastIndex = 0
          let bm: RegExpExecArray | null
          while ((bm = re.exec(fullBlanked))) {
            const line = offsetToLine(nl, bm.index)
            if (isHatched(line, hatch)) continue
            violations.push({ file: path, line, message: msgB(label) })
          }
        }
      }
    }
    return violations
  },
  selftest: {
    bad: [
      // (a) audio with neither a captions track nor controls (self-closing).
      'export const A = () => <audio src="/a.mp3" />',
      // (a) video with a NON-captions track (descriptions) and no controls —
      // descriptions/chapters/metadata do not carry the spoken content.
      'export const B = () => (\n  <video src="/v.mp4">\n    <track kind="descriptions" src="/d.vtt" srcLang="en" />\n  </video>\n)',
      // (c) autoPlay without muted (has controls, so (a) is satisfied).
      'export const C = () => <video src="/v.mp4" autoPlay controls />',
      // (b) new Audio() in a handler.
      'export const D = () => {\n  const beep = () => new Audio("/beep.mp3").play()\n  return <button onClick={beep}>x</button>\n}',
      // (b) AudioContext at module scope.
      'const ctx = new AudioContext()\nexport const E = () => <span />',
      // (b) haptic feedback with no visual pair.
      'export function buzz() {\n  navigator.vibrate(200)\n}',
    ],
    good: [
      // (a) satisfied by BOTH a captions track and controls; no autoplay.
      'export const A = () => (\n  <video src="/v.mp4" controls>\n    <track kind="captions" src="/c.vtt" srcLang="en" label="English" />\n  </video>\n)',
      // (a) satisfied by controls alone.
      'export const B = () => <audio src="/a.mp3" controls />',
      // (a) satisfied by a subtitles track alone.
      'export const C = () => (\n  <video src="/v.mp4">\n    <track kind="subtitles" src="/s.vtt" srcLang="en" />\n  </video>\n)',
      // (c) satisfied by muted; (a) satisfied by controls + captions track.
      'export const D = () => (\n  <video src="/v.mp4" autoPlay muted loop controls>\n    <track kind="captions" src="/c.vtt" srcLang="en" />\n  </video>\n)',
      // (b) documented hatch on the line above — the sound has a visual pair.
      'export function beep() {\n  // a11y-media-alternative: the beep also flashes the tile + sets an aria-live status\n  new Audio("/beep.mp3").play()\n}',
      // (b) mention only inside a comment and a string — neither is a real call.
      'export const E = () => {\n  // plays a new Audio() clip — see docs\n  const label = "click to run new Audio()"\n  return <button>{label}</button>\n}',
      // A non-media element with autoFocus is never scanned for autoPlay/muted.
      'export const F = () => <input autoFocus type="text" />',
    ],
  },
}

export default lint
