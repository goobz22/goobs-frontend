'use client'
import React, { useEffect, useRef, useState } from 'react'
import { sanitizeHtml } from './utils/conversion'
import cssStyles from './RichHtmlPreview.module.css'

interface RichHtmlPreviewProps {
  value: string
  className?: string | undefined
}

/** Authored article HTML uses the same sanitizer as the rich editor. */
const RichHtmlPreview: React.FC<RichHtmlPreviewProps> = ({
  value,
  className,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    const element = contentRef.current
    if (!element) return
    const measure = () =>
      setScrollable(
        element.scrollWidth > element.clientWidth ||
          element.scrollHeight > element.clientHeight
      )
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    element.addEventListener('load', measure, true)
    return () => {
      observer.disconnect()
      element.removeEventListener('load', measure, true)
    }
  }, [value, className])

  return (
    <div
      ref={contentRef}
      className={[cssStyles.preview, className].filter(Boolean).join(' ')}
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? 'group' : undefined}
      aria-label={scrollable ? 'Article content' : undefined}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
    />
  )
}

export default RichHtmlPreview
