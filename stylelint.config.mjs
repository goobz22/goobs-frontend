// @ts-check

/**
 * goobs-frontend stylelint configuration.
 *
 * Purpose: keep the tokenized theme honest. Every component .module.css must
 * author against the shared --goobs-* custom properties defined in
 * src/styles/global.css. This config forbids the raw, pre-tokenization literals
 * from reappearing in declaration values so a future brand retune stays a
 * single-file edit in global.css.
 *
 * Forbidden literals (mapped to their canonical token in global.css):
 *   - raw sacred-gold rgb triplet `255, 215, 0`  -> use var(--goobs-gold-rgb)
 *     or one of the --goobs-gold-a** alpha tokens / --goobs-gold.
 *   - `#ffd700`                                   -> var(--goobs-gold)
 *   - shared easing cubic-bezier(0.4, 0, 0.2, 1)  -> var(--goobs-ease)
 *     (or a --goobs-transition-* convenience token).
 *   - severity hex #ef4444 / #f59e0b / #22c55e    -> var(--goobs-danger) /
 *     var(--goobs-warn) / var(--goobs-success) (+ their -bg / -border tokens).
 *
 * src/styles/global.css is EXEMPT below because it is the single source of
 * truth that defines every one of these literals.
 */

const disallowedValuePatterns = [
  // Raw sacred-gold rgb triplet, e.g. rgb(255, 215, 0) / rgba(255,215,0, .3).
  // Use var(--goobs-gold-rgb) inside rgb()/rgba(), or a --goobs-gold(-a**) token.
  '/255\\s*,\\s*215\\s*,\\s*0/',
  // Literal sacred-gold hex -> var(--goobs-gold).
  '/#ffd700/i',
  // Shared easing curve -> var(--goobs-ease) (or --goobs-transition-*).
  '/cubic-bezier\\(\\s*0\\.4\\s*,\\s*0\\s*,\\s*0\\.2\\s*,\\s*1\\s*\\)/',
  // Severity hexes -> var(--goobs-danger) / -warn / -success (+ -bg / -border).
  '/#ef4444/i',
  '/#f59e0b/i',
  '/#22c55e/i',
];

// Properties that carry color / motion literals and must therefore route
// through the shared tokens.
const guardedProperties = [
  'color',
  'background',
  'background-color',
  'border',
  'border-color',
  'box-shadow',
  'transition',
  'transition-timing-function',
];

/** @type {import('stylelint').Config} */
const config = {
  extends: ['stylelint-config-standard'],
  ignoreFiles: [
    '**/node_modules/**',
    'node_modules/**',
    'dist/**',
    'storybook-static/**',
    // EXEMPT: global.css is the single source of truth that DEFINES every one
    // of the forbidden literals (the --goobs-* token declarations). Linting it
    // against the disallowed-list would flag its own definitions.
    'src/styles/global.css',
    // ---------------------------------------------------------------------
    // In-flight component directories — under active concurrent edit by
    // another agent/human at the time this config landed. They still contain
    // raw literals pending their own tokenization pass; linting them here
    // would either falsely fail the build or force edits to dirty files we
    // are not allowed to touch. Deferred pending concurrent work; remove each
    // entry once that directory's tokenization is committed.
    // ---------------------------------------------------------------------
    'src/components/Card/**',
    'src/components/Field/USD/**',
    'src/components/Field/Text/**',
    'src/components/Button/SaveButton/**',
    'src/components/EmptyState/**',
    'src/components/Panel/**',
    'src/components/SacredGlyphFrame/**',
    'src/components/DetailField/**',
    'src/components/FieldGrid/**',
    'src/components/FileDropzone/**',
    'src/components/ListItemCard/**',
    // ProgressBar.module.css is git-dirty (under active concurrent edit) and
    // its sacred gradient steps through #f59e0b as a gold-shade stop; deferred
    // pending concurrent work — cannot edit a dirty file. Remove once committed.
    'src/components/ProgressBar/ProgressBar.module.css',
  ],
  overrides: [
    {
      files: ['src/**/*.css'],
      rules: {
        'declaration-property-value-disallowed-list': [
          guardedProperties.reduce((acc, property) => {
            acc[property] = disallowedValuePatterns;
            return acc;
          }, /** @type {Record<string, string[]>} */ ({})),
          {
            message:
              'Raw theme literal is disallowed — map it to the matching --goobs-* token defined in src/styles/global.css.',
          },
        ],
      },
    },
  ],
  rules: {
    // ---------------------------------------------------------------------
    // stylelint-config-standard stylistic opinions that conflict with this
    // codebase's established, intentional conventions. Turning them off keeps
    // `lint:css` focused on REAL problems (the token-leak rule above and
    // genuine CSS-validity rules) instead of thousands of false positives on
    // patterns that are correct-by-design here. These are convention mismatches,
    // not suppressed bugs.
    // ---------------------------------------------------------------------

    // CSS Modules are consumed as `styles.myClass`, so every class selector is
    // camelCase by design (1200+ across the library). config-standard expects
    // kebab-case; that opinion does not apply to a CSS-Modules codebase.
    'selector-class-pattern': null,
    // Keyframes are referenced from camelCase JS/TS identifiers (e.g.
    // progressIndeterminate) and intentionally match those names.
    'keyframes-name-pattern': null,

    // Color / alpha NOTATION preferences only — they do not change the rendered
    // value. The library authors rgba()/decimal-alpha throughout; config-standard
    // prefers rgb()/percentage-alpha. Purely cosmetic, left as authored.
    'color-function-notation': null,
    'color-function-alias-notation': null,
    'alpha-value-notation': null,
    'hue-degree-notation': null,
    'color-hex-length': null,

    // Empty-line-before formatting is owned by Prettier (`npm run format`),
    // not stylelint, to avoid two tools fighting over blank lines.
    'rule-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'comment-empty-line-before': null,
    'declaration-empty-line-before': null,

    // Specificity ordering and duplicate-selector grouping are deliberate in
    // the theme-override (sacred/light/dark) blocks; flagging them would force
    // re-ordering that breaks the cascade these components rely on.
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'declaration-block-no-redundant-longhand-properties': null,

    // CSS Modules syntax — config-standard is written for plain CSS and does
    // not know the CSS-Modules composition features this codebase is built on.
    // `:global(...)` scopes a selector globally; `composes:` inherits classes.
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'local'] },
    ],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    // `composes:` values are case-sensitive CLASS NAMES — the lower-case
    // autofix corrupts them into dangling references that break the build.
    'value-keyword-case': ['lower', { ignoreProperties: ['composes'] }],
  },
};

export default config;
