import {
  Signal,
  ComputedSignal,
  EffectRunner,
  FocusSignal,
  useSignal as signal,
  useComputed as computed,
} from '../core/reactive'
import { AsyncSignal, AsyncSignalOptions } from '../core/async'
import {
  VirtualElement,
  Props,
  ComponentInstance,
  createElement,
} from './element'
import { ErrorBoundary } from '../error/boundary'

interface ComponentDefinition<P extends Props = Props> {
  name: string
  render: (props: P, context: ComponentContext) => VirtualElement | null
  displayName?: string
  errorBoundary?: boolean
}

export interface ComponentContext {
  emit: (event: string, data?: unknown) => void
  slots: Record<string, VirtualElement[]>
  expose: (api: Record<string, unknown>) => void
  loading: boolean
  error: Error | null
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
}

export type ComponentRenderFunction = () => VirtualElement | null

export class FrameworkAgnosticComponent<P extends Props = Props>
  implements ComponentInstance
{
  public props: P
  private definition: ComponentDefinition<P>
  public signals: Map<string, Signal<unknown>> = new Map()
  public computedSignals: Map<string, ComputedSignal<unknown>> = new Map()
  public asyncSignals: Map<string, AsyncSignal<unknown>> = new Map()
  public effects: EffectRunner[] = []
  public cleanup: (() => void)[] = []
  public context: ComponentContext
  private exposedApi: Record<string, unknown> = {}
  public errorBoundary?: ErrorBoundary
  private loadingSignal: Signal<boolean>
  private errorSignal: Signal<Error | null>

  constructor(definition: ComponentDefinition<P>, props: P) {
    this.definition = definition
    this.props = props
    this.loadingSignal = signal<boolean>(false)
    this.errorSignal = signal<Error | null>(null)

    this.context = {
      emit: this.emit.bind(this),
      slots: {},
      expose: this.expose.bind(this),
      loading: false,
      error: null,
      setLoading: (loading: boolean) => {
        this.loadingSignal.value = loading
      },
      setError: (error: Error | null) => {
        this.errorSignal.value = error
      },
    }

    Object.defineProperties(this.context, {
      loading: {
        get: () => this.loadingSignal.value,
        enumerable: true,
      },
      error: {
        get: () => this.errorSignal.value,
        enumerable: true,
      },
    })

    if (definition.errorBoundary) {
      this.errorBoundary = new ErrorBoundary()
    }
  }

  render(): VirtualElement | null {
    const prevComponent = getCurrentComponent()
    setCurrentComponent(this as FrameworkAgnosticComponent<Props>)
    try {
      if (this.errorBoundary?.value.hasError) {
        // This should render a fallback UI, which needs to be defined.
        return createElement('div', {}, 'Error!')
      }
      const view = this.definition.render(this.props, this.context)
      return view
    } catch (error) {
      if (this.errorBoundary) {
        this.errorBoundary.catchError(() => {
          throw error
        })
        return createElement('div', {}, 'Error!')
      }
      console.error(`Error rendering component ${this.definition.name}:`, error)
      return null
    } finally {
      setCurrentComponent(prevComponent)
    }
  }

  onMount(): void | (() => void) {
    // This will be called by the renderer
  }

  onUpdate(_prevProps: Props): void {
    this.props = { ...this.props }
  }

  onUnmount(): void {
    this.effects.forEach(effect => effect.dispose())
    this.cleanup.forEach(fn => fn())
    if (this.errorBoundary) {
      this.errorBoundary.reset()
    }
  }

  private emit(event: string, ...args: unknown[]): void {
    const handler = (this.props as Record<string, unknown>)[
      `on${event.charAt(0).toUpperCase()}${event.slice(1)}`
    ]
    if (typeof handler === 'function') {
      handler(...args)
    }
  }

  private expose(api: Record<string, unknown>): void {
    Object.assign(this.exposedApi, api)
  }

  getExposedApi(): Record<string, unknown> {
    return this.exposedApi
  }
}

let currentComponent: FrameworkAgnosticComponent<Props> | null = null

function getCurrentComponent(): FrameworkAgnosticComponent<Props> | null {
  return currentComponent
}

export function setCurrentComponent(
  component: FrameworkAgnosticComponent<Props> | null
): void {
  currentComponent = component
}

export function createSignal<T>(initialValue: T, key?: string): Signal<T> {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error(
      'createSignal must be called within a component setup function'
    )
  }
  const signalKey = key || `signal_${component.signals.size}`
  if (!component.signals.has(signalKey)) {
    component.signals.set(signalKey, signal(initialValue))
  }
  return component.signals.get(signalKey)! as Signal<T>
}

export function createComputed<T>(
  computeFn: () => T,
  key?: string
): ComputedSignal<T> {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error(
      'createComputed must be called within a component setup function'
    )
  }
  const signalKey = key || `computed_${component.computedSignals.size}`
  if (!component.computedSignals.has(signalKey)) {
    component.computedSignals.set(signalKey, computed(computeFn))
  }
  return component.computedSignals.get(signalKey)! as ComputedSignal<T>
}

export function createAsync<T>(
  asyncFn: () => Promise<T>,
  options?: AsyncSignalOptions,
  key?: string
): AsyncSignal<T> {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error(
      'createAsync must be called within a component setup function'
    )
  }
  const signalKey = key || `async_${component.asyncSignals.size}`
  if (!component.asyncSignals.has(signalKey)) {
    const asyncSignal = new AsyncSignal(asyncFn, options)
    component.asyncSignals.set(signalKey, asyncSignal)

    // Watch for state changes using an effect
    const effect = new EffectRunner(() => {
      const state = asyncSignal.value
      component.context.setLoading(state.status === 'loading')
      component.context.setError(state.status === 'error' ? state.error : null)
    })

    component.effects.push(effect)
    effect.run()
  }
  return component.asyncSignals.get(signalKey)! as AsyncSignal<T>
}

export function createEffect(
  effectFn: () => void | (() => void),
  _deps?: unknown[]
): void {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error(
      'createEffect must be called within a component setup function'
    )
  }
  const effect = new EffectRunner(effectFn)
  component.effects.push(effect)
  effect.run()
}

export function onMount(fn: () => void | (() => void)): void {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error('onMount must be called within a component setup function')
  }
  createEffect(fn)
}

export function onUnmount(fn: () => void): void {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error(
      'onUnmount must be called within a component setup function'
    )
  }
  component.cleanup.push(fn)
}

export function createErrorBoundary(): ErrorBoundary {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error(
      'createErrorBoundary must be called within a component setup function'
    )
  }
  if (!component.errorBoundary) {
    component.errorBoundary = new ErrorBoundary()
  }
  return component.errorBoundary
}

export function createLoading(initialState = false): Signal<boolean> {
  return createSignal(initialState, 'loading')
}

export function getProps<P extends Props = Props>(): P {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error('getProps must be called within a component setup function')
  }
  return component.props as P
}

export function createRef<T>(initialValue: T | null = null): Signal<T | null> {
  return createSignal(initialValue)
}

export function useFocus(key?: string): FocusSignal {
  const component = getCurrentComponent()
  if (!component) {
    throw new Error('useFocus must be called within a component setup function')
  }
  const signalKey = key || `focus_${component.signals.size}`
  if (!component.signals.has(signalKey)) {
    const focusSignal = new FocusSignal()
    component.signals.set(signalKey, focusSignal)
  }
  return component.signals.get(signalKey)! as FocusSignal
}

type ComponentFunction<P extends Props> = (props: P) => VirtualElement | null

interface ComponentSetupFunction<P extends Props> {
  (props: P): () => VirtualElement | null
}

interface ComponentDefinitionWithSetup<P extends Props> {
  name?: string
  setup: ComponentSetupFunction<P>
  displayName?: string
  errorBoundary?: boolean
}

export function defineComponent<P extends Props>(
  config: ComponentFunction<P> | ComponentDefinitionWithSetup<P>,
  options: {
    displayName?: string
    errorBoundary?: boolean
  } = {}
): new (props: P) => ComponentInstance {
  let renderFn: ComponentFunction<P>
  let componentName: string

  if (typeof config === 'function') {
    // Simple render function
    renderFn = config
    componentName = options.displayName || config.name || 'AnonymousComponent'
  } else {
    // Setup-style component definition
    componentName =
      config.name ||
      config.displayName ||
      options.displayName ||
      'AnonymousComponent'
    const setupFn = config.setup

    renderFn = (props: P) => {
      const component = getCurrentComponent()
      if (!component) {
        throw new Error(
          'Component render function must be called within a component context'
        )
      }

      // Call setup function to get the actual render function
      const actualRenderFn = setupFn(props)
      return actualRenderFn()
    }
  }

  const definition: ComponentDefinition<P> = {
    name: componentName,
    render: (props: P) => renderFn(props),
    displayName: options.displayName || componentName,
    errorBoundary: options.errorBoundary,
  }

  const ComponentClass = class extends FrameworkAgnosticComponent<P> {
    constructor(props: P) {
      super(definition, props)
    }
  }

  Object.defineProperty(ComponentClass, 'name', {
    value: definition.displayName || definition.name,
  })

  return ComponentClass
}

export function memo<P extends Props>(
  componentFn: ComponentFunction<P>,
  areEqual?: (prev: P, next: P) => boolean
): ComponentFunction<P> {
  let lastProps: P | null = null
  let lastResult: VirtualElement | null = null

  const memoized = (nextProps: P) => {
    if (
      lastProps === null ||
      (areEqual ? !areEqual(lastProps, nextProps) : true)
    ) {
      lastProps = nextProps
      lastResult = componentFn(nextProps)
    }
    return lastResult
  }
  return memoized
}
