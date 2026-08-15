import { ArrowLeft, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  showSearch?: boolean
  onSearchClick?: () => void
  rightAction?: React.ReactNode
}

export function PageHeader({
  title,
  showBack = true,
  showSearch = false,
  onSearchClick,
  rightAction,
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 surface border-b border-default">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-shrink-0 p-1 -ml-1 text-body"
              aria-label="Go back"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <h1 className="text-lg font-bold truncate text-body">{title}</h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {showSearch && (
            <button
              type="button"
              onClick={onSearchClick}
              className="p-1 text-body"
              aria-label="Search"
            >
              <Search size={22} />
            </button>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  )
}
