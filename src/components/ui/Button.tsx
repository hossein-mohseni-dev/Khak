import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary: 'bg-plant-600 hover:bg-plant-700 text-white disabled:opacity-60',
  secondary: 'bg-white dark:bg-soil-800 border border-soil-300 dark:border-soil-600 text-soil-800 dark:text-soil-100',
  ghost: 'text-soil-700 dark:text-soil-200 hover:bg-soil-100 dark:hover:bg-soil-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plant-600',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-sm',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
