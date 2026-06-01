// --------------------------------------------------------------------------
// SACRED GLYPHS
// --------------------------------------------------------------------------
// Egyptian hieroglyph characters (Unicode block U+13000 "Egyptian Hieroglyphs").
// These were once force-rendered as a hover decoration on every sacred-theme
// icon; that was residue from before the sacred theme had its own gold coloring
// (which now carries the sacred look on its own). The decoration is removed, but
// the glyph set is preserved and exported here so any consumer can use them
// deliberately — e.g. a decorative flourish — by opting in, rather than having
// them imposed on every icon.
//
// Notable members: 𓂀 Eye of Horus (Wedjat), 𓋹 Ankh (life), 𓇳 sun-disc / Ra,
// 𓊨 Isis throne, 𓅓 owl, 𓊹 netjer (god), 𓊖 town.
// --------------------------------------------------------------------------

export const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
] as const

export type SacredGlyph = (typeof SACRED_GLYPHS)[number]
