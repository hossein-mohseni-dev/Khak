import { cn } from '../../utils/cn'

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: Array<{ id: string; label: string }>
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium',
            value === tab.id ? 'bg-plant-600 text-white' : 'bg-soil-100 dark:bg-soil-700 text-soil-700 dark:text-soil-100',
          )}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
