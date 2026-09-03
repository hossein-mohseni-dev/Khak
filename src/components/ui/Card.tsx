import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-soil-800 rounded-2xl border border-soil-200 dark:border-soil-700 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
