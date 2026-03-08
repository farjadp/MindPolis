import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supported locales
export const locales = ['en', 'fa']
export const defaultLocale = 'en'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return

    // Redirect if there is no locale

    // Try to get locale from Accept-Language header
    const acceptLang = request.headers.get("accept-language")
    let locale = defaultLocale
    if (acceptLang && acceptLang.includes("fa")) {
        locale = 'fa'
    }

    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api, etc.)
        '/((?!_next|api|favicon.ico|_vercel).*)',
    ],
}
