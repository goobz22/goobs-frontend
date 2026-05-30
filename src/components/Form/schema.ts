/**
 * =============================================================================
 * FORM SCHEMA INTROSPECTION — zod-native, defensive
 * =============================================================================
 *
 * Helpers that read structure out of a zod schema WITHOUT hard-coupling the
 * form surface to a specific zod minor version. Everything here is wrapped in
 * try/catch and falls back to a safe default — schema introspection must never
 * throw during render (FieldShell calls `deriveRequiredFromSchema` on every
 * render when bound).
 *
 * zod v4 specifics this relies on (verified against zod ^4.4.3):
 *   - `schema.shape` is the per-field record on an object schema.
 *   - A field schema exposes `isOptional()` / `isNullable()` predicates.
 *   - `fieldSchema.safeParse(undefined).success === true` is an
 *     optional-detection FALLBACK for schemas whose `isOptional` is unreliable.
 *   - The internal kind is at `fieldSchema._zod.def.type`, with wrapper kinds
 *     (`optional` / `nullable` / `default`) exposing `def.innerType`.
 */

/** The field kinds AutoFields knows how to render. */
export type FieldKind =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'enum'
  | 'boolean'
  | 'stringArray'

/** Structural view of a zod object schema's `.shape`. */
interface ZodObjectLike {
  shape?: Record<string, unknown>
}

/** Structural view of a zod field schema's introspection surface. */
interface ZodFieldLike {
  isOptional?: () => boolean
  isNullable?: () => boolean
  safeParse?: (value: unknown) => { success: boolean }
  _zod?: {
    def?: {
      type?: string
      format?: string
      innerType?: unknown
      element?: unknown
    }
  }
}

/** Read `.shape` off a schema, or `undefined` if it isn't object-shaped. */
function getShape(schema: unknown): Record<string, unknown> | undefined {
  const shape = (schema as ZodObjectLike | null | undefined)?.shape
  if (shape && typeof shape === 'object') return shape
  return undefined
}

/** Read the field schema for `name` off a schema's shape. */
function getFieldSchema(schema: unknown, name: string): unknown {
  const shape = getShape(schema)
  if (!shape) return undefined
  return shape[name]
}

/**
 * Whether a field is required (not optional and not nullable). Defensive:
 * returns `false` for anything it can't introspect, and never throws.
 *
 * Detection order:
 *   1. `isOptional()` / `isNullable()` predicates when present.
 *   2. `safeParse(undefined).success` as an optional-detection fallback —
 *      a schema that accepts `undefined` is treated as not-required.
 */
export function deriveRequiredFromSchema(
  schema: unknown,
  name: string
): boolean {
  try {
    const fieldSchema = getFieldSchema(schema, name) as ZodFieldLike | undefined
    if (!fieldSchema) return false

    const isOptional =
      typeof fieldSchema.isOptional === 'function'
        ? fieldSchema.isOptional()
        : undefined
    const isNullable =
      typeof fieldSchema.isNullable === 'function'
        ? fieldSchema.isNullable()
        : undefined

    if (isOptional === true || isNullable === true) return false

    // Fallback: a field whose schema accepts `undefined` is optional. This
    // covers zod versions / wrappers where the predicates above are missing.
    if (typeof fieldSchema.safeParse === 'function') {
      const acceptsUndefined = fieldSchema.safeParse(undefined).success
      if (acceptsUndefined) return false
    }

    // If predicates were present and both explicitly false, it's required.
    if (isOptional === false && isNullable === false) return true

    // Predicates absent and safeParse didn't prove optional → assume required
    // only when we at least have a real field schema. (We returned false above
    // for a missing field.)
    return isOptional !== undefined || isNullable !== undefined
      ? !(isOptional || isNullable)
      : false
  } catch {
    return false
  }
}

/**
 * Turn a camelCase / snake_case field key into a human label.
 *   'contractName'   -> 'Contract Name'
 *   'address_line_1' -> 'Address Line 1'
 *   'customerId'     -> 'Customer Id'
 */
export function humanize(key: string): string {
  if (!key) return ''
  const withSpaces = key
    // snake_case / kebab-case separators → space
    .replace(/[_-]+/g, ' ')
    // camelCase / PascalCase boundary → space
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    // letter→digit boundary → space (address1 -> address 1)
    .replace(/([A-Za-z])([0-9])/g, '$1 $2')
    .trim()
  return withSpaces
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Unwrap optional/nullable/default wrappers to reach the inner field schema,
 * so kind detection sees `string` rather than `optional`.
 */
function unwrapFieldSchema(fieldSchema: unknown): ZodFieldLike | undefined {
  let current = fieldSchema as ZodFieldLike | undefined
  // Bound the loop — wrappers are shallow, but never spin forever.
  for (let depth = 0; depth < 10 && current; depth += 1) {
    const def = current._zod?.def
    const kind = def?.type
    if (
      (kind === 'optional' || kind === 'nullable' || kind === 'default') &&
      def?.innerType !== undefined
    ) {
      current = def.innerType as ZodFieldLike
      continue
    }
    break
  }
  return current
}

/**
 * Map a zod field schema to the goobs field kind AutoFields renders. Defensive:
 * unknown / unintrospectable schemas fall back to `'text'`, and it never throws.
 */
export function zodTypeToFieldKind(fieldSchema: unknown): FieldKind {
  try {
    const unwrapped = unwrapFieldSchema(fieldSchema)
    const def = unwrapped?._zod?.def
    const kind = def?.type
    const format = def?.format

    switch (kind) {
      case 'number':
      case 'bigint':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'date':
        return 'date'
      case 'enum':
      case 'literal':
        return 'enum'
      case 'array':
        return 'stringArray'
      case 'string': {
        if (format === 'email') return 'email'
        if (format === 'date' || format === 'datetime') return 'date'
        return 'text'
      }
      default:
        return 'text'
    }
  } catch {
    return 'text'
  }
}
