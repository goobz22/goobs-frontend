/**
 * The ONE resolution of a picked dropdown option to the string its onChange emits: the option's
 * `_id` when it carries a non-empty one, otherwise the option's own `value`, coerced to string.
 *
 * This is the Regular `<Dropdown>`'s documented contract, and it is a single home on purpose.
 * `FilterSection`'s searchable branch used to hand-roll `opt?._id ?? ''`, so a filter dropdown
 * whose options carry no `_id` emitted `''` (the "no filter" value) once it reached 8 options
 * and switched from the Regular variant to `<SearchableSimple>`. The control rendered and took
 * the pick, but filtered nothing: the same option emitted its value at 7 options and `''` at 8.
 * Both variants now resolve through here, so the variant is presentation only.
 *
 * Run: bun test ./scripts/__tests__/dropdown-option-id.test.ts
 */
export function resolveOptionId(option: {
  value: string | number
  _id?: string | null
}): string {
  return option._id != null && option._id !== ''
    ? String(option._id)
    : String(option.value)
}
