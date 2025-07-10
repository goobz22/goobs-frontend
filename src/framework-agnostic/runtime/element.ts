export type ElementType = string | ComponentConstructor | ComponentFunction

export type ComponentFunction = (props: Props) => VirtualElement | null
export type Props = Record<string, any>
export type Children = (
  | VirtualElement
  | string
  | number
  | boolean
  | null
  | undefined
)[]

export interface VirtualElement {
  type: ElementType
  props: Props
  children: Children
  key?: string | number
  ref?: ElementRef
  __vnode: true
}

export interface ElementRef {
  current: HTMLElement | null
}

export interface ComponentConstructor {
  new (props: Props): ComponentInstance
  displayName?: string
}

export interface ComponentInstance {
  props: Props
  render(): VirtualElement | null
  onMount?(): void | (() => void)
  onUpdate?(prevProps: Props): void
  onUnmount?(): void
  getState?(): any
  setState?(newState: any): void
}

export interface DOMNode {
  element: VirtualElement
  domNode: HTMLElement | Text
  componentInstance?: ComponentInstance
  cleanup?: () => void
}

// Create virtual element
export function createElement(
  type: ElementType,
  props: Props | null = null,
  ...children: Children
): VirtualElement {
  const normalizedProps = props || {}
  const normalizedChildren = children
    .flat()
    .filter(child => child !== null && child !== undefined && child !== false)

  return {
    type,
    props: normalizedProps,
    children: normalizedChildren,
    key: normalizedProps.key,
    ref: normalizedProps.ref,
    __vnode: true,
  }
}

// Create element reference
export function createRef(): ElementRef {
  return { current: null }
}

// Check if value is a virtual element
export function isVirtualElement(value: any): value is VirtualElement {
  return value && typeof value === 'object' && value.__vnode === true
}

// Fragment component for multiple children
export class Fragment implements ComponentInstance {
  constructor(public props: { children: Children }) {}

  render(): VirtualElement {
    return createElement(
      'div',
      { style: { display: 'contents' } },
      ...this.props.children
    )
  }
}

// Render virtual element to DOM
export function render(
  element: VirtualElement,
  container: HTMLElement
): DOMNode {
  const domNode = createDOMNode(element)
  container.appendChild(domNode.domNode)

  // Call onMount if it's a component
  if (domNode.componentInstance?.onMount) {
    const cleanup = domNode.componentInstance.onMount()
    if (typeof cleanup === 'function') {
      domNode.cleanup = cleanup
    }
  }

  return domNode
}

// Create DOM node from virtual element
function createDOMNode(element: VirtualElement): DOMNode {
  if (typeof element.type === 'string') {
    return createHTMLElement(element)
  } else if (
    typeof element.type === 'function' &&
    !isComponentConstructor(element.type)
  ) {
    return createFunctionComponentElement(element)
  } else {
    return createComponentElement(element)
  }
}

// Check if a function is a component constructor (class) or function component
function isComponentConstructor(func: any): func is ComponentConstructor {
  return func.prototype && func.prototype.render
}

// Create HTML element
function createHTMLElement(element: VirtualElement): DOMNode {
  const domElement = document.createElement(element.type as string)

  // Set properties
  Object.entries(element.props).forEach(([key, value]) => {
    if (key === 'key' || key === 'ref') return

    if (key === 'style' && typeof value === 'object') {
      Object.assign(domElement.style, value)
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase()
      domElement.addEventListener(eventName, value)
    } else if (key === 'className') {
      domElement.className = value
    } else if (key === 'htmlFor') {
      domElement.setAttribute('for', value)
    } else if (typeof value === 'boolean') {
      if (value) {
        domElement.setAttribute(key, '')
      }
    } else if (value !== null && value !== undefined) {
      domElement.setAttribute(key, String(value))
    }
  })

  // Set ref
  if (element.ref) {
    element.ref.current = domElement
  }

  // Append children
  element.children.forEach(child => {
    if (typeof child === 'string' || typeof child === 'number') {
      domElement.appendChild(document.createTextNode(String(child)))
    } else if (isVirtualElement(child)) {
      const childDOMNode = createDOMNode(child)
      domElement.appendChild(childDOMNode.domNode)
    }
  })

  return {
    element,
    domNode: domElement,
  }
}

// Create function component element with reactive system
function createFunctionComponentElement(element: VirtualElement): DOMNode {
  const componentFunction = element.type as ComponentFunction

  // This will be used by the React adapter to trigger re-renders
  let updateCallback: (() => void) | null = null
  let componentRenderer: any = null

  // Create a wrapper that can be called by the reactive system
  const renderWrapper = () => {
    return componentFunction(element.props)
  }

  // For now, just render directly (React adapter will handle reactivity)
  const rendered = renderWrapper()
  if (!rendered) {
    const emptyDiv = document.createElement('div')
    emptyDiv.style.display = 'none'
    return {
      element,
      domNode: emptyDiv,
    }
  }

  const childDOMNode = createDOMNode(rendered)

  return {
    element,
    domNode: childDOMNode.domNode,
  }
}

// Create component element
function createComponentElement(element: VirtualElement): DOMNode {
  const ComponentClass = element.type as ComponentConstructor
  const instance = new ComponentClass(element.props)

  const rendered = instance.render()
  if (!rendered) {
    const emptyDiv = document.createElement('div')
    emptyDiv.style.display = 'none'
    return {
      element,
      domNode: emptyDiv,
      componentInstance: instance,
    }
  }

  const childDOMNode = createDOMNode(rendered)

  return {
    element,
    domNode: childDOMNode.domNode,
    componentInstance: instance,
  }
}

// Update DOM node with new element
export function updateDOMNode(
  domNode: DOMNode,
  newElement: VirtualElement
): DOMNode {
  const oldElement = domNode.element

  // If types are different, replace entirely
  if (oldElement.type !== newElement.type) {
    const newDOMNode = createDOMNode(newElement)
    domNode.domNode.parentNode?.replaceChild(
      newDOMNode.domNode,
      domNode.domNode
    )

    // Clean up old component
    if (domNode.componentInstance?.onUnmount) {
      domNode.componentInstance.onUnmount()
    }
    if (domNode.cleanup) {
      domNode.cleanup()
    }

    // Mount new component
    if (newDOMNode.componentInstance?.onMount) {
      const cleanup = newDOMNode.componentInstance.onMount()
      if (typeof cleanup === 'function') {
        newDOMNode.cleanup = cleanup
      }
    }

    return newDOMNode
  }

  // Update existing element
  if (typeof newElement.type === 'string') {
    return updateHTMLElement(domNode, newElement)
  } else if (
    typeof newElement.type === 'function' &&
    !isComponentConstructor(newElement.type)
  ) {
    return updateFunctionComponentElement(domNode, newElement)
  } else {
    return updateComponentElement(domNode, newElement)
  }
}

// Update HTML element
function updateHTMLElement(
  domNode: DOMNode,
  newElement: VirtualElement
): DOMNode {
  const htmlElement = domNode.domNode as HTMLElement
  const oldProps = domNode.element.props
  const newProps = newElement.props

  // Update properties
  const allProps = new Set([...Object.keys(oldProps), ...Object.keys(newProps)])

  allProps.forEach(key => {
    if (key === 'key' || key === 'ref') return

    const oldValue = oldProps[key]
    const newValue = newProps[key]

    if (oldValue !== newValue) {
      if (key === 'style' && typeof newValue === 'object') {
        Object.assign(htmlElement.style, newValue)
      } else if (key.startsWith('on') && typeof newValue === 'function') {
        const eventName = key.slice(2).toLowerCase()
        if (typeof oldValue === 'function') {
          htmlElement.removeEventListener(eventName, oldValue)
        }
        htmlElement.addEventListener(eventName, newValue)
      } else if (key === 'className') {
        htmlElement.className = newValue || ''
      } else if (newValue === null || newValue === undefined) {
        htmlElement.removeAttribute(key)
      } else if (typeof newValue === 'boolean') {
        if (newValue) {
          htmlElement.setAttribute(key, '')
        } else {
          htmlElement.removeAttribute(key)
        }
      } else {
        htmlElement.setAttribute(key, String(newValue))
      }
    }
  })

  // Update ref
  if (newElement.ref) {
    newElement.ref.current = htmlElement
  }

  // Update children (simplified - would need proper diffing for performance)
  htmlElement.innerHTML = ''
  newElement.children.forEach(child => {
    if (typeof child === 'string' || typeof child === 'number') {
      htmlElement.appendChild(document.createTextNode(String(child)))
    } else if (isVirtualElement(child)) {
      const childDOMNode = createDOMNode(child)
      htmlElement.appendChild(childDOMNode.domNode)
    }
  })

  return {
    element: newElement,
    domNode: htmlElement,
  }
}

// Update function component element
function updateFunctionComponentElement(
  domNode: DOMNode,
  newElement: VirtualElement
): DOMNode {
  const componentFunction = newElement.type as ComponentFunction

  // Re-render with new props
  const rendered = componentFunction(newElement.props)
  if (!rendered) {
    const emptyDiv = document.createElement('div')
    emptyDiv.style.display = 'none'
    domNode.domNode.parentNode?.replaceChild(emptyDiv, domNode.domNode)
    return {
      element: newElement,
      domNode: emptyDiv,
    }
  }

  const newDOMNode = createDOMNode(rendered)
  domNode.domNode.parentNode?.replaceChild(newDOMNode.domNode, domNode.domNode)

  return {
    element: newElement,
    domNode: newDOMNode.domNode,
  }
}

// Update component element
function updateComponentElement(
  domNode: DOMNode,
  newElement: VirtualElement
): DOMNode {
  const instance = domNode.componentInstance!
  const oldProps = instance.props

  // Update props
  instance.props = newElement.props

  // Call onUpdate
  if (instance.onUpdate) {
    instance.onUpdate(oldProps)
  }

  // Re-render
  const rendered = instance.render()
  if (!rendered) {
    const emptyDiv = document.createElement('div')
    emptyDiv.style.display = 'none'
    domNode.domNode.parentNode?.replaceChild(emptyDiv, domNode.domNode)
    return {
      element: newElement,
      domNode: emptyDiv,
      componentInstance: instance,
    }
  }

  const newDOMNode = createDOMNode(rendered)
  domNode.domNode.parentNode?.replaceChild(newDOMNode.domNode, domNode.domNode)

  return {
    element: newElement,
    domNode: newDOMNode.domNode,
    componentInstance: instance,
  }
}

// Unmount DOM node
export function unmountDOMNode(domNode: DOMNode): void {
  if (domNode.componentInstance?.onUnmount) {
    domNode.componentInstance.onUnmount()
  }
  if (domNode.cleanup) {
    domNode.cleanup()
  }
  domNode.domNode.remove()
}
