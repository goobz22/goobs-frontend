import React from 'react'
import type { VirtualElement, ComponentChildren } from '../types'
import {
  createRawSignal,
  EffectRunner,
  createReactiveComponent,
  ComponentRenderer,
  resetInfiniteLoopDetector,
  getInfiniteLoopDetectorStatus,
} from '../index'

/**
 * React-compatible useSignal that integrates with React's rendering system
 */
export function useSignal<T>(initialValue: T) {
  const [, forceUpdate] = React.useState({})
  const signalRef = React.useRef<ReturnType<typeof createRawSignal<T>> | null>(
    null
  )
  const effectRef = React.useRef<EffectRunner | null>(null)

  // Create signal only once
  if (!signalRef.current) {
    signalRef.current = createRawSignal(initialValue)
  }

  const signal = signalRef.current

  // Subscribe to signal changes and trigger React re-renders
  React.useEffect(() => {
    if (!effectRef.current) {
      effectRef.current = new EffectRunner(() => forceUpdate({}))
    }

    return signal.subscribe(effectRef.current)
  }, [signal])

  return signal
}

/**
 * React-compatible useEffect that integrates with React's lifecycle
 */
export function useFrameworkEffect(
  effectFn: () => void | (() => void),
  deps?: React.DependencyList
) {
  const effectFnRef = React.useRef(effectFn)
  effectFnRef.current = effectFn

  React.useEffect(() => {
    const cleanup = effectFnRef.current()
    return typeof cleanup === 'function' ? cleanup : undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Simple converter for framework-agnostic VirtualElement to React elements
 * Focused on Storybook use cases
 */
export function convertToReact(
  element: VirtualElement | null
): React.ReactElement {
  if (!element) {
    return React.createElement('div', {}, 'No element')
  }

  const { type, props, children } = element

  // Convert children to React nodes
  const reactChildren: React.ReactNode[] = []
  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      if (typeof child === 'string' || typeof child === 'number') {
        reactChildren.push(child)
      } else if (child && typeof child === 'object' && '__vnode' in child) {
        reactChildren.push(
          React.createElement(
            React.Fragment,
            { key: index },
            convertToReact(child)
          )
        )
      }
    })
  }

  // Handle HTML elements
  if (typeof type === 'string') {
    return React.createElement(type, props, ...reactChildren)
  }

  // Handle component functions with proper reactivity
  if (typeof type === 'function') {
    try {
      // Create a reactive wrapper that triggers React re-renders when signals change
      const ReactWrapper = () => {
        const [, forceUpdate] = React.useState({})
        const rendererRef = React.useRef<ComponentRenderer | null>(null)

        if (!rendererRef.current) {
          rendererRef.current = createReactiveComponent(
            () =>
              (type as unknown as (props: unknown) => VirtualElement | null)(
                props
              ),
            () => {
              forceUpdate({})
            }
          )
        }

        React.useEffect(() => {
          return () => {
            rendererRef.current?.dispose()
          }
        }, [])

        const result = rendererRef.current.render()
        return result
          ? convertToReact(result as VirtualElement)
          : React.createElement('div')
      }

      return React.createElement(ReactWrapper)
    } catch (error) {
      console.warn('Error rendering component:', error)
      return React.createElement(
        'div',
        { style: { color: 'red' } },
        String(error)
      )
    }
  }

  // Fallback
  return React.createElement('div', props, ...reactChildren)
}

/**
 * Create a React component wrapper for framework-agnostic components
 * Specifically designed for Storybook
 */
export function createStorybookAdapter<P extends Record<string, unknown>>(
  frameworkComponent: (props: P) => VirtualElement | null,
  displayName?: string
) {
  const StorybookComponent = (props: P): React.ReactElement => {
    // Check if infinite loop detector has blocked operations and reset it for new stories
    const detectorStatus = getInfiniteLoopDetectorStatus()
    if (detectorStatus.blockedOperations.length > 0) {
      console.log(
        '🔄 Storybook: Resetting infinite loop detector for new story'
      )
      resetInfiniteLoopDetector()
    }

    try {
      const element = frameworkComponent(props)
      return convertToReact(element)
    } catch (error) {
      console.error('Storybook adapter error:', error)
      return React.createElement(
        'div',
        {
          style: { color: 'red', padding: '1rem', border: '1px solid red' },
        },
        `Error: ${String(error)}`
      )
    }
  }

  StorybookComponent.displayName = displayName || 'StorybookAdapter'
  return StorybookComponent
}

/**
 * Create a story render function adapter
 */
export function adaptStoryRender<P extends Record<string, unknown>>(
  renderFn: (args: P) => VirtualElement | null
) {
  return (args: P): React.ReactElement => {
    try {
      const element = renderFn(args)
      return convertToReact(element)
    } catch (error) {
      console.error('Story render error:', error)
      return React.createElement(
        'div',
        {
          style: { color: 'red', padding: '1rem' },
        },
        `Render error: ${String(error)}`
      )
    }
  }
}

/**
 * Hook to use framework-agnostic signals in React
 */
export function useFrameworkSignal<T>(signal: {
  value: T
  subscribe: (callback: () => void) => () => void
}) {
  const [value, setValue] = React.useState(signal.value)

  React.useEffect(() => {
    const unsubscribe = signal.subscribe(() => {
      setValue(signal.value)
    })
    return unsubscribe
  }, [signal, signal.subscribe])

  return value
}

/**
 * Legacy converter for backward compatibility
 */
export function convertAgnosticToReact(
  element: VirtualElement | ComponentChildren
): React.ReactNode {
  if (element && typeof element === 'object' && '__vnode' in element) {
    return convertToReact(element)
  }

  if (typeof element === 'string' || typeof element === 'number') {
    return element
  }

  if (Array.isArray(element)) {
    return element.map((child, index) => {
      if (child && typeof child === 'object' && '__vnode' in child) {
        return React.createElement(
          React.Fragment,
          { key: index },
          convertToReact(child)
        )
      }
      return child
    })
  }

  return null
}

/**
 * Higher-order component that wraps framework-agnostic components for React
 */
export function createReactAdapter<P extends object>(
  frameworkComponent: (props: P) => VirtualElement | null,
  displayName?: string
) {
  const ReactAdapter = (props: P): React.ReactElement | null => {
    const virtualElement = frameworkComponent(props)
    return convertToReact(virtualElement)
  }

  ReactAdapter.displayName =
    displayName || frameworkComponent.name || 'FrameworkAdapter'

  return ReactAdapter
}

/**
 * Utility to create framework-agnostic event handlers that work with React
 */
export function createEventHandler<T extends Event>(
  handler: (event: T) => void
) {
  return function (event: React.SyntheticEvent) {
    // Convert React SyntheticEvent to native Event for framework-agnostic handlers
    const nativeEvent = event.nativeEvent as T
    handler(nativeEvent)
  }
}

/**
 * Type-safe wrapper for any props when bridging to React
 */
export type ReactAdapterProps<T = object> = T & {
  [key: string]: unknown
}
