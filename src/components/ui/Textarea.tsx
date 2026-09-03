import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, id, className, ...props }: Props) {
  const inputId = id || props.name
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-soil-700 dark:text-soil-200">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-soil-800',
          error ? 'border-red-400' : 'border-soil-200 dark:border-soil-600',
          'focus:outline-none focus:ring-2 focus:ring-plant-600/30',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
