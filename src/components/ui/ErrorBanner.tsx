import { Button } from './Button'

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-5" role="alert">
      <p className="font-medium text-red-800 dark:text-red-200 mb-1">Something went wrong</p>
      <p className="text-sm text-red-700 dark:text-red-300 mb-3">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
