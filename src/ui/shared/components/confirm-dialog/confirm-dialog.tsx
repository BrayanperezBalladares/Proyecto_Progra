import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import { AppButton } from '@ui/shell/button/app-button'
import type { ConfirmDialogProps } from './confirm-dialog.types'

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  /* Focus cancel button when dialog opens */
  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus()
    }
  }, [isOpen])

  /* ESC key + focus trap */
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConfirming) {
        onCancel()
        return
      }
      if (e.key !== 'Tab' || !overlayRef.current) return
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, isConfirming, onCancel])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      onClick={(e) => { if (e.target === e.currentTarget && !isConfirming) onCancel() }}
    >
      <div className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-danger-light">
            <AlertTriangle className="size-4 text-danger" aria-hidden />
          </div>
          <div>
            <h2 id="confirm-dialog-title" className="text-base font-semibold text-primary-dark">
              {title}
            </h2>
            {description && (
              <div id="confirm-dialog-desc" className="mt-1 text-sm text-muted">
                {description}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <AppButton
            ref={cancelRef}
            variant="secondary"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </AppButton>
          <AppButton variant="danger" onClick={onConfirm} isLoading={isConfirming}>
            {confirmLabel}
          </AppButton>
        </div>
      </div>
    </div>
  )
}
