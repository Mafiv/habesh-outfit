import type { LucideIcon } from 'lucide-react'
import { Button } from '../Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 shadow-soft">
        <Icon size={32} className="text-primary" />
      </div>
      <h2 className="text-lg font-bold text-body">{title}</h2>
      <p className="text-sm text-muted mt-2 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
