'use client'
import React, { useEffect } from 'react'
import cssStyles from './animations.module.css'

export type Animation =
  | 'none'
  | 'slideIn'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'stuckOnScroll'
  | 'fadeOut'
  | 'fadeIn'

interface AnimationProps {
  animationtype?: Animation
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

function mergeClassNames(...names: Array<string | undefined>): string {
  return names.filter(Boolean).join(' ')
}

// Animation variant -> CSS-module class mapping. The visual definitions
// (initial opacity + @keyframes timing) live in animations.module.css.
const animationClassNames: Record<Animation, string> = {
  none: cssStyles.none ?? '',
  slideIn: cssStyles.slideIn ?? '',
  slideInUp: cssStyles.slideInUp ?? '',
  slideInDown: cssStyles.slideInDown ?? '',
  slideInLeft: cssStyles.slideInLeft ?? '',
  slideInRight: cssStyles.slideInRight ?? '',
  fadeOut: cssStyles.fadeOut ?? '',
  fadeIn: cssStyles.fadeIn ?? '',
  stuckOnScroll: cssStyles.stuckOnScroll ?? '',
}

export const AnimatedElement: React.FC<AnimationProps> = ({
  animationtype = 'none',
  children,
  className,
  style,
  ...props
}) => {
  const mergedClassName = mergeClassNames(
    animationClassNames[animationtype],
    className
  )

  return (
    <div
      className={mergedClassName}
      {...(style !== undefined ? { style } : {})}
      {...props}
    >
      {children}
    </div>
  )
}

export const StuckElement: React.FC<{
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}> = ({ children, className, style, ...props }) => {
  const mergedClassName = mergeClassNames(cssStyles.stuck, className)

  return (
    <div
      className={mergedClassName}
      {...(style !== undefined ? { style } : {})}
      {...props}
    >
      {children}
    </div>
  )
}

export function useAnimation(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
          } else {
            entry.target.classList.remove('animate')
          }
        })
      },
      { threshold: 0.2 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref])
}
