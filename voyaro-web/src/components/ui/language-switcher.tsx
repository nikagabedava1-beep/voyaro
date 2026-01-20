'use client'

import { useLanguage } from '@/contexts/language-context'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className={cn('inline-flex rounded-lg bg-gray-100 p-1', className)}>
      <button
        onClick={() => setLanguage('ka')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
          language === 'ka'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        )}
      >
        ქარ
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
          language === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        )}
      >
        ENG
      </button>
    </div>
  )
}
