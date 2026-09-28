'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

type Tag = 'div' | 'section' | 'li' | 'article' | 'header' | 'p' | 'span' | 'ul' | 'h2'

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  as?: Tag
  delay?: number
  y?: number
  className?: string
}

/** Fades content up as it enters the viewport (once). Honors prefers-reduced-motion. */
export function Reveal({ children, as = 'div', delay = 0, y = 28, className, ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  const Component = motion[as] as typeof motion.div
  return (
    <Component
      data-reveal=""
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </Component>
  )
}

/** Staggers direct children that are <RevealItem>. */
export function RevealGroup({ children, className, as = 'div', stagger = 0.09 }: { children: ReactNode; className?: string; as?: Tag; stagger?: number }) {
  const reduce = useReducedMotion()
  const Component = motion[as] as typeof motion.div
  return (
    <Component
      data-reveal=""
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Component>
  )
}

export function RevealItem({ children, className, as = 'div', y = 24 }: { children: ReactNode; className?: string; as?: Tag; y?: number }) {
  const Component = motion[as] as typeof motion.div
  return (
    <Component
      data-reveal=""
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        shown: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </Component>
  )
}
