interface LoadingSpinnerProps {
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

export function LoadingSpinner({ fullScreen, size = 'md', label }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} border-2 border-primary/20 border-t-primary rounded-full animate-spin`}
        role="status"
        aria-label={label ?? 'Loading'}
      />
      {label && <p className="text-sm text-muted">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center surface-page">
        {spinner}
      </div>
    )
  }

  return spinner
}
