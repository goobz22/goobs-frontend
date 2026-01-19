'use client'

import { useState, useEffect, RefObject } from 'react'

export default function useContainerWidth(
  containerRef: RefObject<HTMLElement | null>,
  breakpoint = 768
) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const checkSize = () => {
      setIsMobile(container.offsetWidth < breakpoint)
    }

    // Initial check
    checkSize()

    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      checkSize()
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerRef, breakpoint])

  return isMobile
}
