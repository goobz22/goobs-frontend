'use client'
import React from 'react'
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

// `StuckElement` and `useAnimation` were removed 2026-09-07. StuckElement was a
// second route to the `.stuck` rule that `AnimatedElement`'s `stuckOnScroll`
// variant already reaches through `animationClassNames`, and nothing rendered
// it. `useAnimation` was an IntersectionObserver that toggled a bare `animate`
// class no stylesheet in the library defines (the entrance animations are pure
// CSS in `animations.module.css`), so it could not have had a visual effect;
// nothing called it either.
