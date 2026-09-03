import { cn } from '../../utils/cn'

export function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'ok' | 'warn' | 'bad' }) {
  const map = {
    neutral: 'bg-soil-100 text-soil-700 dark:bg-soil-700 dark:text-soil-100',
    ok: 'bg-green-100 text-green-800',
    warn: 'bg-amber-100 text-amber-800',
    bad: 'bg-red-100 text-red-800',
  }
  return <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', map[tone])}>{children}</span>
}
