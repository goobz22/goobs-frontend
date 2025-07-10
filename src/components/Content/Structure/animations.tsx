'use client'
import React, { useEffect } from 'react'

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

// Animation styles mapping
const animationStyles: Record<Animation, React.CSSProperties> = {
  none: { opacity: 1 },
  slideIn: {
    opacity: 0,
    animation: 'slideInLeft 0.6s ease-out forwards',
  },
  slideInUp: {
    opacity: 0,
    animation: 'slideInUp 0.6s ease-out forwards',
  },
  slideInDown: {
    opacity: 0,
    animation: 'slideInDown 0.6s ease-out forwards',
  },
  slideInLeft: {
    opacity: 0,
    animation: 'slideInLeft 0.6s ease-out forwards',
  },
  slideInRight: {
    opacity: 0,
    animation: 'slideInRight 0.6s ease-out forwards',
  },
  fadeOut: {
    opacity: 1,
    animation: 'fadeOut 0.6s ease-out forwards',
  },
  fadeIn: {
    opacity: 0,
    animation: 'fadeIn 0.6s ease-out forwards',
  },
  stuckOnScroll: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    opacity: 1,
  },
}

export const AnimatedElement: React.FC<AnimationProps> = ({
  animationtype = 'none',
  children,
  className,
  style,
  ...props
}) => {
  const animationStyle = animationStyles[animationtype]

  const finalStyle = {
    ...animationStyle,
    ...style,
  }

  return (
    <div className={className} style={finalStyle} {...props}>
      {children}
    </div>
  )
}

export const StuckElement: React.FC<{
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}> = ({ children, className, style, ...props }) => {
  const stuckStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    ...style,
  } as React.CSSProperties

  return (
    <div className={className} style={stuckStyle} {...props}>
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
