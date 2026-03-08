"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export function LoginClient({ dict, lang }: { dict: any, lang: string }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" /></div>}>
            <LoginContent dict={dict} lang={lang} />
        </Suspense>
    )
}

function LoginContent({ dict, lang }: { dict: any, lang: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") ?? `/${lang}/dashboard`
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return
        setLoading(true); setError("")
        const result = await signIn("credentials", { email, password, redirect: false })
        setLoading(false)
        if (result?.error) setError(dict.error)
        else { router.push(callbackUrl); router.refresh() }
    }

    return (
        <div className="min-h-screen flex bg-background">

            {/* Left panel */}
            <div className="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col justify-between p-10 bg-secondary/30 border-r border-border">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded flex items-center justify-center font-black text-[10px] bg-primary text-primary-foreground">MP</div>
                    <span className="font-semibold text-sm tracking-tight text-primary">MindPolis</span>
                </div>
                <div className="space-y-6">
                    <p className="text-xl font-bold leading-tight tracking-tight text-primary">
                        {dict.sidebar.title}
                    </p>
                    <div className="space-y-3">
                        {[dict.sidebar.f1, dict.sidebar.f2, dict.sidebar.f3].map((f: string) => (
                            <div key={f} className="flex items-center gap-3 text-sm font-medium text-secondary-foreground">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground">© {new Date().getFullYear()} MindPolis</p>
            </div>

            {/* Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm space-y-8">

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">{dict.title}</h1>
                        <p className="text-sm mt-1.5 font-medium text-muted-foreground">{dict.subtitle}</p>
                    </div>

                    <div className="px-4 py-3 rounded border text-sm font-medium bg-primary/5 border-primary/20 text-primary">
                        <strong>{dict.devMode.split(':')[0]}:</strong> {dict.devMode.split(':')[1]}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Field label={dict.email} id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
                        <Field label={dict.password} id="password" type="password" value={password} onChange={setPassword} placeholder={dict.passwordPlaceholder} />

                        {error && (
                            <div className="px-4 py-3 rounded border text-sm text-destructive bg-destructive/5 border-destructive/20 font-medium">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded text-sm font-semibold bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-sm mt-2">
                            {loading ? dict.buttonLoading : dict.button}
                        </button>
                    </form>

                    <div className="space-y-4 text-center pt-2">
                        <p className="text-sm font-medium text-muted-foreground">
                            {dict.noAccount}{" "}
                            <Link href={`/${lang}/register`} className="font-semibold text-primary hover:underline underline-offset-4">{dict.createOne}</Link>
                        </p>
                        <p className="text-xs font-medium pt-2">
                            <Link href={`/${lang}/assessment`} className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">{dict.continueWithout}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Field({ label, id, type, value, onChange, placeholder, required }: {
    label: string; id: string; type: string; value: string
    onChange: (v: string) => void; placeholder: string; required?: boolean
}) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-semibold text-primary">{label}</label>
            <input id={id} type={type} value={value} required={required}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded border px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground bg-background border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            />
        </div>
    )
}
