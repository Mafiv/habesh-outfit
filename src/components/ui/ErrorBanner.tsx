import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorBanner({ message, onRetry, className = '' }: ErrorBannerProps) {
  return (
    <div
      className={`mx-4 mt-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3 ${className}`}
      role="alert"
    >
      <AlertCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-body">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary"
          >
            <RefreshCw size={12} />
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
