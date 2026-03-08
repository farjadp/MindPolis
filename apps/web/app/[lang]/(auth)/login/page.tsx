// ============================================================================
// MindPolis: app/(auth)/login/page.tsx
// Version: 6.0.0
// Why: Sign-in — semantic light UI with Suspense boundary to fix prerender.
// Env / Identity: React Server Component
// ============================================================================

import { getDictionary } from "@/get-dictionary"
import { LoginClient } from "./login-client"

export default async function LoginPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang as 'en' | 'fa')

  return <LoginClient dict={dict.login} lang={lang} />
}
