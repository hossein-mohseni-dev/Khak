import { Link } from 'react-router-dom'
import { Button } from './Button'

export function EmptyState({
  title,
  message,
  actionTo,
  actionLabel,
}: {
  title: string
  message: string
  actionTo?: string
  actionLabel?: string
}) {
  return (
    <div className="text-center py-14 px-4">
      <p className="text-3xl mb-2">🌱</p>
      <h2 className="font-bold text-lg mb-1">{title}</h2>
      <p className="text-sm text-soil-600 dark:text-soil-300 mb-4">{message}</p>
      {actionTo && actionLabel && (
        <Link to={actionTo}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
