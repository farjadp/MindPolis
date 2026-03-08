"use client"

import { signOut } from "next-auth/react"

export function SignOutButton({ label = "Sign out" }: { label?: string }) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md transition-colors w-full text-start sm:w-auto"
        >
            {label}
        </button>
    )
}
