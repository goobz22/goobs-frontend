// Framework-agnostic TypeScript definitions
import type * as React from 'react'

// ====================================
// CORE TYPES
// ====================================

export type CSSProperties = React.CSSProperties & {
  [key: string]: string | number | undefined
}

export interface ComponentProps {
  [key: string]: unknown
  style?: CSSProperties
}

export type ComponentChildren = Children

export type ComponentNode =
  | VirtualElement
  | string
  | number
  | boolean
  | null
  | undefined

// ====================================
// VIRTUAL ELEMENT TYPES
// ====================================

export interface ElementRef<T = HTMLElement> {
  current: T | null
}

export interface ComponentConstructor<P = ComponentProps> {
  new (props: P): ComponentInstance<P>
  displayName?: string
}

export type ComponentFunction<P = ComponentProps> = (
  props: P
) => VirtualElement | null

// Define ElementType to match runtime
export type ElementType = string | ComponentConstructor | ComponentFunction

// Define Children type to match runtime
export type Children = (
  | VirtualElement
  | string
  | number
  | boolean
  | null
  | undefined
)[]

// Fixed VirtualElement to match runtime implementation
export interface VirtualElement {
  type: ElementType
  props: ComponentProps
  children: Children
  key?: string | number
  ref?: ElementRef<HTMLElement>
  __vnode: true
}

export interface ComponentInstance<P = ComponentProps> {
  props: P
  render(): VirtualElement | null
  onMount?(): void | (() => void)
  onUpdate?(prevProps: P): void
  onUnmount?(): void
}

// ====================================
// EVENT TYPES (React-compatible)
// ====================================

export interface SyntheticEvent<T = Element, E = Event> {
  nativeEvent: E
  currentTarget: T
  target: EventTarget | null
  bubbles: boolean
  cancelable: boolean
  defaultPrevented: boolean
  eventPhase: number
  isTrusted: boolean
  preventDefault(): void
  stopPropagation(): void
  stopImmediatePropagation(): void
  timeStamp: number
  type: string
}

export interface MouseEvent<T = Element>
  extends SyntheticEvent<T, globalThis.MouseEvent> {
  altKey: boolean
  button: number
  buttons: number
  clientX: number
  clientY: number
  ctrlKey: boolean
  metaKey: boolean
  pageX: number
  pageY: number
  screenX: number
  screenY: number
  shiftKey: boolean
  detail: number
  getModifierState(key: string): boolean
  movementX: number
  movementY: number
  offsetX: number
  offsetY: number
  relatedTarget: EventTarget | null
}

export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget &
    T & {
      value: string
      name?: string
      checked?: boolean
    }
}

export interface KeyboardEvent<T = Element>
  extends SyntheticEvent<T, globalThis.KeyboardEvent> {
  altKey: boolean
  charCode: number
  code: string
  ctrlKey: boolean
  key: string
  keyCode: number
  locale: string
  location: number
  metaKey: boolean
  repeat: boolean
  shiftKey: boolean
  which: number
  getModifierState(key: string): boolean
}

export interface FocusEvent<T = Element>
  extends SyntheticEvent<T, globalThis.FocusEvent> {
  relatedTarget: EventTarget | null
  target: EventTarget & T
}

export interface FormEvent<T = Element> extends SyntheticEvent<T> {
  // Form-specific properties can be added here if needed
  submitter?: HTMLElement | null
}

export interface TouchEvent<T = Element>
  extends SyntheticEvent<T, globalThis.TouchEvent> {
  altKey: boolean
  changedTouches: TouchList
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  targetTouches: TouchList
  touches: TouchList
  getModifierState(key: string): boolean
}

// ====================================
// EVENT HANDLERS (React-compatible)
// ====================================

export type EventHandler<E = SyntheticEvent> = (event: E) => void

export type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>
export type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>
export type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>
export type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>
export type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>
export type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>

// ====================================
// HTML ATTRIBUTES (React-compatible)
// ====================================

export interface HTMLAttributes<T = HTMLElement> {
  // Standard HTML attributes
  accessKey?: string
  className?: string
  contentEditable?: boolean | 'true' | 'false' | 'inherit'
  contextMenu?: string
  dir?: string
  draggable?: boolean
  hidden?: boolean
  id?: string
  lang?: string
  placeholder?: string
  slot?: string
  spellCheck?: boolean
  style?: CSSProperties
  tabIndex?: number
  title?: string
  translate?: 'yes' | 'no'

  // ARIA attributes
  role?: string
  'aria-activedescendant'?: string
  'aria-atomic'?: boolean | 'true' | 'false'
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
  'aria-busy'?: boolean | 'true' | 'false'
  'aria-checked'?: boolean | 'true' | 'false' | 'mixed'
  'aria-colcount'?: number
  'aria-colindex'?: number
  'aria-colspan'?: number
  'aria-controls'?: string
  'aria-current'?:
    | boolean
    | 'true'
    | 'false'
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
  'aria-describedby'?: string
  'aria-details'?: string
  'aria-disabled'?: boolean | 'true' | 'false'
  'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup'
  'aria-errormessage'?: string
  'aria-expanded'?: boolean | 'true' | 'false'
  'aria-flowto'?: string
  'aria-grabbed'?: boolean | 'true' | 'false'
  'aria-haspopup'?:
    | boolean
    | 'true'
    | 'false'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog'
  'aria-hidden'?: boolean | 'true' | 'false'
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling'
  'aria-keyshortcuts'?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-level'?: number
  'aria-live'?: 'off' | 'assertive' | 'polite'
  'aria-modal'?: boolean | 'true' | 'false'
  'aria-multiline'?: boolean | 'true' | 'false'
  'aria-multiselectable'?: boolean | 'true' | 'false'
  'aria-orientation'?: 'horizontal' | 'vertical'
  'aria-owns'?: string
  'aria-placeholder'?: string
  'aria-posinset'?: number
  'aria-pressed'?: boolean | 'true' | 'false' | 'mixed'
  'aria-readonly'?: boolean | 'true' | 'false'
  'aria-relevant'?:
    | 'additions'
    | 'additions removals'
    | 'additions text'
    | 'all'
    | 'removals'
    | 'removals additions'
    | 'removals text'
    | 'text'
    | 'text additions'
    | 'text removals'
  'aria-required'?: boolean | 'true' | 'false'
  'aria-roledescription'?: string
  'aria-rowcount'?: number
  'aria-rowindex'?: number
  'aria-rowspan'?: number
  'aria-selected'?: boolean | 'true' | 'false'
  'aria-setsize'?: number
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other'
  'aria-valuemax'?: number
  'aria-valuemin'?: number
  'aria-valuenow'?: number
  'aria-valuetext'?: string

  // Event handlers
  onClick?: MouseEventHandler<T>
  onDoubleClick?: MouseEventHandler<T>
  onMouseDown?: MouseEventHandler<T>
  onMouseUp?: MouseEventHandler<T>
  onMouseMove?: MouseEventHandler<T>
  onMouseEnter?: MouseEventHandler<T>
  onMouseLeave?: MouseEventHandler<T>
  onMouseOver?: MouseEventHandler<T>
  onMouseOut?: MouseEventHandler<T>
  onContextMenu?: MouseEventHandler<T>

  onKeyDown?: KeyboardEventHandler<T>
  onKeyUp?: KeyboardEventHandler<T>
  onKeyPress?: KeyboardEventHandler<T>

  onFocus?: FocusEventHandler<T>
  onBlur?: FocusEventHandler<T>
  onFocusIn?: FocusEventHandler<T>
  onFocusOut?: FocusEventHandler<T>

  onChange?: ChangeEventHandler<T>
  onInput?: FormEventHandler<T>
  onSubmit?: FormEventHandler<T>
  onReset?: FormEventHandler<T>
  onSelect?: FormEventHandler<T>

  onTouchStart?: TouchEventHandler<T>
  onTouchMove?: TouchEventHandler<T>
  onTouchEnd?: TouchEventHandler<T>
  onTouchCancel?: TouchEventHandler<T>

  // Custom framework props
  ref?: ElementRef<T>
  key?: string | number
}

// ====================================
// SPECIFIC ELEMENT TYPES
// ====================================

export interface InputHTMLAttributes<T = HTMLInputElement>
  extends HTMLAttributes<T> {
  accept?: string
  alt?: string
  autoCapitalize?: string
  autoComplete?: string
  autoCorrect?: string
  autoFocus?: boolean
  capture?: boolean | string
  checked?: boolean
  crossOrigin?: string
  disabled?: boolean
  form?: string
  formAction?: string
  formEncType?: string
  formMethod?: string
  formNoValidate?: boolean
  formTarget?: string
  height?: number | string
  list?: string
  max?: number | string
  maxLength?: number
  min?: number | string
  minLength?: number
  multiple?: boolean
  name?: string
  pattern?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  size?: number
  src?: string
  step?: number | string
  type?: string
  value?: string | ReadonlyArray<string> | number
  width?: number | string
}

export interface ButtonHTMLAttributes<T = HTMLButtonElement>
  extends HTMLAttributes<T> {
  autoFocus?: boolean
  disabled?: boolean
  form?: string
  formAction?: string
  formEncType?: string
  formMethod?: string
  formNoValidate?: boolean
  formTarget?: string
  name?: string
  type?: 'submit' | 'reset' | 'button'
  value?: string | ReadonlyArray<string> | number
}

export interface SelectHTMLAttributes<T = HTMLSelectElement>
  extends HTMLAttributes<T> {
  autoComplete?: string
  autoFocus?: boolean
  disabled?: boolean
  form?: string
  multiple?: boolean
  name?: string
  required?: boolean
  size?: number
  value?: string | ReadonlyArray<string> | number
}

export interface TextareaHTMLAttributes<T = HTMLTextAreaElement>
  extends HTMLAttributes<T> {
  autoComplete?: string
  autoFocus?: boolean
  cols?: number
  dirName?: string
  disabled?: boolean
  form?: string
  maxLength?: number
  minLength?: number
  name?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  rows?: number
  value?: string | ReadonlyArray<string> | number
  wrap?: string
}

export interface FormHTMLAttributes<T = HTMLFormElement>
  extends HTMLAttributes<T> {
  acceptCharset?: string
  action?: string
  autoComplete?: string
  encType?: string
  method?: string
  name?: string
  noValidate?: boolean
  target?: string
}

export interface LabelHTMLAttributes<T = HTMLLabelElement>
  extends HTMLAttributes<T> {
  form?: string
  htmlFor?: string
}

export interface AnchorHTMLAttributes<T = HTMLAnchorElement>
  extends HTMLAttributes<T> {
  download?: boolean | string
  href?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: string
}

export interface ImgHTMLAttributes<T = HTMLImageElement>
  extends HTMLAttributes<T> {
  alt?: string
  crossOrigin?: 'anonymous' | 'use-credentials' | ''
  decoding?: 'async' | 'auto' | 'sync'
  height?: number | string
  loading?: 'eager' | 'lazy'
  referrerPolicy?: string
  sizes?: string
  src?: string
  srcSet?: string
  useMap?: string
  width?: number | string
}

// Remove empty interfaces - they're redundant
export type DivHTMLAttributes<T = HTMLDivElement> = HTMLAttributes<T>
export type SpanHTMLAttributes<T = HTMLSpanElement> = HTMLAttributes<T>

// ====================================
// INTRINSIC ELEMENTS (Like React.JSX.IntrinsicElements)
// ====================================

export interface IntrinsicElements {
  // HTML
  a: AnchorHTMLAttributes<HTMLAnchorElement>
  abbr: HTMLAttributes<HTMLElement>
  address: HTMLAttributes<HTMLElement>
  area: HTMLAttributes<HTMLAreaElement>
  article: HTMLAttributes<HTMLElement>
  aside: HTMLAttributes<HTMLElement>
  audio: HTMLAttributes<HTMLAudioElement>
  b: HTMLAttributes<HTMLElement>
  base: HTMLAttributes<HTMLBaseElement>
  bdi: HTMLAttributes<HTMLElement>
  bdo: HTMLAttributes<HTMLElement>
  big: HTMLAttributes<HTMLElement>
  blockquote: HTMLAttributes<HTMLQuoteElement>
  body: HTMLAttributes<HTMLBodyElement>
  br: HTMLAttributes<HTMLBRElement>
  button: ButtonHTMLAttributes<HTMLButtonElement>
  canvas: HTMLAttributes<HTMLCanvasElement>
  caption: HTMLAttributes<HTMLElement>
  cite: HTMLAttributes<HTMLElement>
  code: HTMLAttributes<HTMLElement>
  col: HTMLAttributes<HTMLTableColElement>
  colgroup: HTMLAttributes<HTMLTableColElement>
  data: HTMLAttributes<HTMLDataElement>
  datalist: HTMLAttributes<HTMLDataListElement>
  dd: HTMLAttributes<HTMLElement>
  del: HTMLAttributes<HTMLModElement>
  details: HTMLAttributes<HTMLDetailsElement>
  dfn: HTMLAttributes<HTMLElement>
  dialog: HTMLAttributes<HTMLDialogElement>
  div: DivHTMLAttributes<HTMLDivElement>
  dl: HTMLAttributes<HTMLDListElement>
  dt: HTMLAttributes<HTMLElement>
  em: HTMLAttributes<HTMLElement>
  embed: HTMLAttributes<HTMLEmbedElement>
  fieldset: HTMLAttributes<HTMLFieldSetElement>
  figcaption: HTMLAttributes<HTMLElement>
  figure: HTMLAttributes<HTMLElement>
  footer: HTMLAttributes<HTMLElement>
  form: FormHTMLAttributes<HTMLFormElement>
  h1: HTMLAttributes<HTMLHeadingElement>
  h2: HTMLAttributes<HTMLHeadingElement>
  h3: HTMLAttributes<HTMLHeadingElement>
  h4: HTMLAttributes<HTMLHeadingElement>
  h5: HTMLAttributes<HTMLHeadingElement>
  h6: HTMLAttributes<HTMLHeadingElement>
  head: HTMLAttributes<HTMLHeadElement>
  header: HTMLAttributes<HTMLElement>
  hgroup: HTMLAttributes<HTMLElement>
  hr: HTMLAttributes<HTMLHRElement>
  html: HTMLAttributes<HTMLHtmlElement>
  i: HTMLAttributes<HTMLElement>
  iframe: HTMLAttributes<HTMLIFrameElement>
  img: ImgHTMLAttributes<HTMLImageElement>
  input: InputHTMLAttributes<HTMLInputElement>
  ins: HTMLAttributes<HTMLModElement>
  kbd: HTMLAttributes<HTMLElement>
  keygen: HTMLAttributes<HTMLElement>
  label: LabelHTMLAttributes<HTMLLabelElement>
  legend: HTMLAttributes<HTMLLegendElement>
  li: HTMLAttributes<HTMLLIElement>
  link: HTMLAttributes<HTMLLinkElement>
  main: HTMLAttributes<HTMLElement>
  map: HTMLAttributes<HTMLMapElement>
  mark: HTMLAttributes<HTMLElement>
  menu: HTMLAttributes<HTMLElement>
  menuitem: HTMLAttributes<HTMLElement>
  meta: HTMLAttributes<HTMLMetaElement>
  meter: HTMLAttributes<HTMLMeterElement>
  nav: HTMLAttributes<HTMLElement>
  noscript: HTMLAttributes<HTMLElement>
  object: HTMLAttributes<HTMLObjectElement>
  ol: HTMLAttributes<HTMLOListElement>
  optgroup: HTMLAttributes<HTMLOptGroupElement>
  option: HTMLAttributes<HTMLOptionElement>
  output: HTMLAttributes<HTMLOutputElement>
  p: HTMLAttributes<HTMLParagraphElement>
  param: HTMLAttributes<HTMLParamElement>
  picture: HTMLAttributes<HTMLElement>
  pre: HTMLAttributes<HTMLPreElement>
  progress: HTMLAttributes<HTMLProgressElement>
  q: HTMLAttributes<HTMLQuoteElement>
  rp: HTMLAttributes<HTMLElement>
  rt: HTMLAttributes<HTMLElement>
  ruby: HTMLAttributes<HTMLElement>
  s: HTMLAttributes<HTMLElement>
  samp: HTMLAttributes<HTMLElement>
  script: HTMLAttributes<HTMLScriptElement>
  section: HTMLAttributes<HTMLElement>
  select: SelectHTMLAttributes<HTMLSelectElement>
  small: HTMLAttributes<HTMLElement>
  source: HTMLAttributes<HTMLSourceElement>
  span: SpanHTMLAttributes<HTMLSpanElement>
  strong: HTMLAttributes<HTMLElement>
  style: HTMLAttributes<HTMLStyleElement>
  sub: HTMLAttributes<HTMLElement>
  summary: HTMLAttributes<HTMLElement>
  sup: HTMLAttributes<HTMLElement>
  table: HTMLAttributes<HTMLTableElement>
  template: HTMLAttributes<HTMLTemplateElement>
  tbody: HTMLAttributes<HTMLTableSectionElement>
  td: HTMLAttributes<HTMLTableDataCellElement>
  textarea: TextareaHTMLAttributes<HTMLTextAreaElement>
  tfoot: HTMLAttributes<HTMLTableSectionElement>
  th: HTMLAttributes<HTMLTableHeaderCellElement>
  thead: HTMLAttributes<HTMLTableSectionElement>
  time: HTMLAttributes<HTMLTimeElement>
  title: HTMLAttributes<HTMLTitleElement>
  tr: HTMLAttributes<HTMLTableRowElement>
  track: HTMLAttributes<HTMLTrackElement>
  u: HTMLAttributes<HTMLElement>
  ul: HTMLAttributes<HTMLUListElement>
  var: HTMLAttributes<HTMLElement>
  video: HTMLAttributes<HTMLVideoElement>
  wbr: HTMLAttributes<HTMLElement>
}

// ====================================
// UTILITY TYPES
// ====================================

// Moved ElementType here to be before VirtualElement

export type ComponentPropsWithoutRef<T extends ElementType> =
  T extends ComponentConstructor
    ? ComponentProps
    : T extends keyof IntrinsicElements
      ? IntrinsicElements[T]
      : never

export type ComponentPropsWithRef<T extends ElementType> =
  T extends ComponentConstructor
    ? ComponentProps & { ref?: ElementRef<HTMLElement> }
    : T extends keyof IntrinsicElements
      ? IntrinsicElements[T] & { ref?: ElementRef<HTMLElement> }
      : never

// ====================================
// CREATEELEMENT SIGNATURE (React-compatible)
// ====================================

export interface CreateElement {
  (
    type: ElementType,
    props?: ComponentProps | null,
    ...children: ComponentNode[]
  ): VirtualElement
}

// ====================================
// FRAMEWORK CONTEXT TYPES
// ====================================

export interface FrameworkConfig {
  strictMode?: boolean
  autoMemoization?: boolean
  circuitBreakerEnabled?: boolean
  developmentMode?: boolean
}

export interface RenderOptions {
  container: HTMLElement
  config?: FrameworkConfig
  onError?: (error: Error) => void
  onWarning?: (warning: string) => void
}

// ====================================
// EXPORTS FOR MODULE AUGMENTATION
// ====================================

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Element extends VirtualElement {
      // React-compatible element properties
      $$typeof?: symbol
      _owner?: ComponentInstance | null
      _store?: {
        validated: boolean
      }
      _self?: ComponentInstance | null
      _source?: {
        fileName: string
        lineNumber: number
        columnNumber: number
      }
    }
    interface IntrinsicElements {
      // This will use the exported IntrinsicElements interface from above
      [elemName: string]: HTMLAttributes<HTMLElement>
    }
    interface ElementClass extends ComponentInstance {
      // React-compatible component class properties
      contextType?: React.Context<unknown>
      defaultProps?: Partial<ComponentProps>
      displayName?: string
      getDerivedStateFromProps?: (
        nextProps: ComponentProps,
        prevState: unknown
      ) => Partial<unknown> | null
      getDerivedStateFromError?: (error: Error) => Partial<unknown> | null
      getSnapshotBeforeUpdate?: (
        prevProps: ComponentProps,
        prevState: unknown
      ) => unknown
      componentDidCatch?: (
        error: Error,
        errorInfo: { componentStack: string }
      ) => void
      shouldComponentUpdate?: (
        nextProps: ComponentProps,
        nextState: unknown,
        nextContext: unknown
      ) => boolean
    }
    interface ElementAttributesProperty {
      props: object
    }
    interface ElementChildrenAttribute {
      children: object
    }
  }
}

// Re-export everything for convenience
export * from '../core/reactive'
export * from '../core/async'
export {
  createElement,
  createRef as createElementRef,
  Fragment,
  render,
  isVirtualElement,
  updateDOMNode,
  unmountDOMNode,
} from '../runtime/element'
export {
  defineComponent,
  onMount,
  onUnmount,
  memo as memoComponent,
  createSignal,
  createComputed,
  createAsync,
  createEffect,
  createErrorBoundary,
  createLoading,
  getProps,
} from '../runtime/component'
export * from '../runtime/event-system'
export * from '../utils/memoization'
