'use client'

/**
 * =============================================================================
 * <Form.AutoFields> — schema-driven field scaffolding (escape hatch)
 * =============================================================================
 *
 * Walks the form's zod schema and renders one goobs field per key, picking the
 * field component from `zodTypeToFieldKind`.
 *
 * Each field is rendered through a small per-field `<AutoField>` binding
 * component that calls `useFormField(name)` ONCE and wires the engine's
 * value / onChange / onBlur / error / required onto the chosen goobs field.
 * (The goobs field components are wired for explicit `value`/`onChange` today;
 * the `name`-only auto-bind path arrives in the field-wiring workflow. Driving
 * them explicitly here means AutoFields works both before and after that.)
 *
 * This is an ESCAPE HATCH, not the default. The default form authoring style is
 * hand-placed JSX so the caller controls layout, grouping, adornments, etc.
 *
 *   <Form schema={ContactSchema} initialValues={draft} onSubmit={save}>
 *     <Form.AutoFields omit={['internalId']} optionsMap={{ status: STATUS_OPTS }} />
 *     <CustomButton type="submit" text="Save" />
 *   </Form>
 */

import React, { type ReactElement, type ReactNode } from 'react'
import { useFormContext } from './context'
import { useFormField } from './useFormField'
import { humanize, zodTypeToFieldKind, type FieldKind } from './schema'
import type { FieldTheme } from '../Field/Shell'
import TextField from '../Field/Text'
import DateField from '../Field/Date/DateField'
import InternalIncrementNumberField from '../Field/Number/InternalIncrement'
import Dropdown, { type DropdownOption } from '../Field/Dropdown/Regular'
import Checkbox from '../Checkbox'

/**
 * Per-field render context handed to a custom `render` function. Lets callers
 * override the component for specific kinds while keeping the binding-by-name
 * contract.
 */
export interface AutoFieldRenderContext {
  name: string
  label: string
  kind: FieldKind
  /** The field's zod schema, for callers that want to introspect further. */
  fieldSchema: unknown
}

export interface AutoFieldsProps {
  /** When set, render ONLY these field keys (in this order). */
  only?: string[]
  /** When set, skip these field keys. */
  omit?: string[]
  /**
   * Per-field option lists for `enum` kinds (and any field a caller wants to
   * render as a dropdown). Keyed by field name.
   */
  optionsMap?: Record<string, DropdownOption[]>
  /**
   * Full override hook — return a node to render that field yourself, or
   * `undefined`/`null` to fall back to the default component for its kind.
   */
  render?: (context: AutoFieldRenderContext) => ReactNode
  /**
   * Theme forwarded to every emitted field (`styles.theme`). Without it each
   * component falls back to its OWN default — `sacred` for FieldShell fields,
   * `light` for Checkbox — which mismatches any light/dark form surface (e.g.
   * sacred gold labels on a white page). Pass the form's surrounding theme.
   */
  theme?: FieldTheme | undefined
}

/** Structural view of a zod object schema's shape. */
interface ZodObjectLike {
  shape?: Record<string, unknown>
}

/** Structural view of a zod enum field, for default option derivation. */
interface ZodEnumLike {
  _zod?: { def?: { type?: string; entries?: Record<string, string | number> } }
}

/** Unwrap optional/nullable/default to reach an inner enum schema's entries. */
function deriveEnumOptions(fieldSchema: unknown): DropdownOption[] {
  let current = fieldSchema as ZodEnumLike | undefined
  for (let depth = 0; depth < 10 && current; depth += 1) {
    const def = current._zod?.def
    if (def?.type === 'enum' && def.entries) {
      return Object.values(def.entries).map(value => ({ value }))
    }
    const innerType = (def as { innerType?: unknown } | undefined)?.innerType
    if (innerType === undefined) break
    current = innerType as ZodEnumLike
  }
  return []
}

/** Coerce an engine value to a string for string-shaped fields. */
function asString(value: unknown): string {
  if (value === undefined || value === null) return ''
  return String(value)
}

/** Coerce an engine value to a `Date | null` for the DateField. */
function asDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

interface AutoFieldProps {
  name: string
  label: string
  kind: FieldKind
  options: DropdownOption[]
  theme: FieldTheme | undefined
}

/**
 * Single bound field. Calls `useFormField(name)` once (one hook per field
 * instance — legal) and renders the goobs component for the kind with the
 * engine's value / handlers / error / required wired in explicitly.
 */
const AutoField: React.FC<AutoFieldProps> = ({
  name,
  label,
  kind,
  options,
  theme,
}) => {
  const { value, onChange, onBlur, error, required } = useFormField(name)
  const errorProp = error ?? false
  // exactOptionalPropertyTypes: only carry `theme` when the caller set it, so
  // each component's own default (sacred fields / light checkbox) still applies.
  const fieldStyles = theme ? { required, theme } : { required }

  switch (kind) {
    case 'enum':
      return (
        <Dropdown
          name={name}
          label={label}
          options={options}
          value={asString(value)}
          onChange={next => onChange(next)}
          onBlur={onBlur}
          error={errorProp}
          styles={fieldStyles}
        />
      )
    case 'number':
      return (
        <InternalIncrementNumberField
          name={name}
          label={label}
          value={asString(value)}
          onChange={next => onChange(next)}
          onBlur={onBlur}
          error={errorProp}
          styles={fieldStyles}
        />
      )
    case 'date':
      return (
        <DateField
          name={name}
          label={label}
          value={asDate(value)}
          onChange={next => onChange(next)}
          error={errorProp}
          styles={fieldStyles}
        />
      )
    case 'boolean':
      // Checkbox takes its visible text from `children`, not a `label` prop.
      return (
        <Checkbox
          name={name}
          aria-label={label}
          checked={Boolean(value)}
          onChange={next => onChange(next)}
          onBlur={onBlur}
          {...(theme ? { styles: { theme } } : {})}
        >
          {label}
        </Checkbox>
      )
    case 'email':
      return (
        <TextField
          name={name}
          label={label}
          type="email"
          value={asString(value)}
          onChange={next => onChange(next)}
          onBlur={onBlur}
          error={errorProp}
          styles={fieldStyles}
        />
      )
    case 'stringArray':
    case 'text':
    default:
      return (
        <TextField
          name={name}
          label={label}
          value={asString(value)}
          onChange={next => onChange(next)}
          onBlur={onBlur}
          error={errorProp}
          styles={fieldStyles}
        />
      )
  }
}

AutoField.displayName = 'Form.AutoField'

const AutoFields: React.FC<AutoFieldsProps> = ({
  only,
  omit,
  optionsMap,
  render,
  theme,
}) => {
  const { schema } = useFormContext()
  const shape = (schema as ZodObjectLike | null | undefined)?.shape

  if (!shape || typeof shape !== 'object') return null

  const allKeys = Object.keys(shape)
  const omitSet = new Set(omit ?? [])
  const keys = (only ?? allKeys).filter(
    key => allKeys.includes(key) && !omitSet.has(key)
  )

  const rendered: ReactElement[] = []

  for (const name of keys) {
    const fieldSchema = shape[name]
    const kind = zodTypeToFieldKind(fieldSchema)
    const label = humanize(name)

    if (render) {
      const custom = render({ name, label, kind, fieldSchema })
      if (custom !== undefined && custom !== null) {
        rendered.push(<React.Fragment key={name}>{custom}</React.Fragment>)
        continue
      }
    }

    const options = optionsMap?.[name] ?? deriveEnumOptions(fieldSchema)
    rendered.push(
      <AutoField
        key={name}
        name={name}
        label={label}
        kind={kind}
        options={options}
        theme={theme}
      />
    )
  }

  return <>{rendered}</>
}

AutoFields.displayName = 'Form.AutoFields'

export default AutoFields
