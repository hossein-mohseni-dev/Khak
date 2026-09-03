import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Button } from './Button'

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    panelRef.current?.querySelector('button')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="absolute inset-0 bg-black/40" aria-label="Close dialog" onClick={onClose} />
      <div ref={panelRef} className="relative bg-white dark:bg-soil-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <h2 id="modal-title" className="text-lg font-bold mb-3">
          {title}
        </h2>
        {children}
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/40" aria-label="Cancel" onClick={onCancel} />
      <div className="relative bg-white dark:bg-soil-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm text-soil-600 dark:text-soil-300 mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
