interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'soft'
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus-ring'

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-7 text-sm',
  }

  const variants = {
    primary: 'gradient-primary text-white shadow-soft hover:opacity-95',
    outline: 'border border-default text-body bg-white/80 dark:bg-dark-surface/80 hover:bg-gray-50 dark:hover:bg-dark-elevated',
    ghost: 'text-primary bg-transparent hover:bg-primary/8',
    soft: 'bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/15',
  }

  return (
    <button
      type="button"
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
