import { ArrowLeft, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  showSearch?: boolean
  onSearchClick?: () => void
  rightAction?: React.ReactNode
  transparent?: boolean
}

export function PageHeader({
  title,
  showBack = true,
  showSearch = false,
  onSearchClick,
  rightAction,
  transparent = false,
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header
      className={`sticky top-0 z-40 ${
        transparent ? 'bg-transparent' : 'glass border-b border-default/60'
      }`}
    >
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-body hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-ring"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-base font-bold truncate text-body tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {showSearch && (
            <button
              type="button"
              onClick={onSearchClick}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-body hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-ring"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  )
}
