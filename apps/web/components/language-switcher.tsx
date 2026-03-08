"use client"

import { usePathname, useRouter } from "next/navigation"

export function LanguageSwitcher() {
    const pathname = usePathname()
    const router = useRouter()

    // Extract current language from pathname (e.g., "/en/dashboard" -> "en")
    const currentLang = pathname.split('/')[1]

    // Safe default just in case middleware hasn't run yet or we're on an internal path
    const isValidLang = currentLang === 'en' || currentLang === 'fa'
    const displayLang = isValidLang ? currentLang : 'en'

    const toggleLanguage = () => {
        const newLang = displayLang === 'en' ? 'fa' : 'en'
        const newPath = pathname.replace(`/${displayLang}`, `/${newLang}`)
        router.push(newPath)
    }

    return (
        <button
            onClick={toggleLanguage}
            className="text-xs transition-colors hover:text-primary text-muted-foreground font-medium uppercase px-2 py-1 rounded hover:bg-muted"
        >
            {displayLang === 'en' ? 'FA' : 'EN'}
        </button>
    )
}
