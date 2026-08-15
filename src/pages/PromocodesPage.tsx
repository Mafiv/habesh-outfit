import { Tag, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { useUserData } from '../context/UserDataContext'
import { useCart } from '../context/CartContext'

export function PromocodesPage() {
  const { promocodes } = useUserData()
  const { setPromocode } = useCart()
  const [copied, setCopied] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setPromocode(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const isExpired = (date: string) => new Date(date) < new Date()

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader title="Promocodes" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {promocodes.map((promo) => {
          const expired = isExpired(promo.expiresAt)
          return (
            <div
              key={promo.code}
              className={`surface rounded-xl p-4 border border-default ${
                expired ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Tag size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold font-mono tracking-wider">{promo.code}</p>
                    {expired && (
                      <span className="text-[10px] font-bold uppercase text-muted bg-gray-100 dark:bg-dark-elevated px-2 py-0.5 rounded">
                        Expired
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted mt-0.5">{promo.description}</p>
                  <p className="text-xs text-muted mt-1">
                    {Math.round(promo.discount * 100)}% off · Expires {promo.expiresAt}
                  </p>
                </div>
              </div>
              {!expired && (
                <button
                  type="button"
                  onClick={() => copyCode(promo.code)}
                  className="mt-3 w-full h-10 flex items-center justify-center gap-2 border border-primary text-primary rounded-full text-xs font-bold uppercase"
                >
                  {copied === promo.code ? (
                    <>
                      <Check size={14} /> Applied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy & Apply
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
