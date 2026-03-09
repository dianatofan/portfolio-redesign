"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface InlinePasswordGateProps {
    projectSlug: string
    children: React.ReactNode
    correctPassword?: string
    enabled?: boolean
}

export function InlinePasswordGate({
    projectSlug,
    children,
    correctPassword = "design2025",
    enabled = true,
}: InlinePasswordGateProps) {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isUnlocked, setIsUnlocked] = useState(false)

    useEffect(() => {
        if (!enabled) {
            setIsUnlocked(true)
            return
        }
        const stored = localStorage.getItem(`project-auth-${projectSlug}`)
        if (stored === correctPassword) {
            setIsUnlocked(true)
        }
    }, [projectSlug, correctPassword, enabled])

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === correctPassword) {
            localStorage.setItem(`project-auth-${projectSlug}`, password)
            setIsUnlocked(true)
            setError("")
            return
        }
        setError("Incorrect password. Please try again.")
        setPassword("")
    }

    if (isUnlocked || !enabled) {
        return <>{children}</>
    }

    return (
        <section id="solution" className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-medium text-foreground">Solution</h2>
            <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-base text-[var(--text-secondary)]">Add password to keep reading.</p>
                <form onSubmit={handleUnlock} className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="sm:max-w-xs"
                    />
                    <Button type="submit" className="sm:w-auto">
                        Unlock section
                    </Button>
                </form>
                {error && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </section>
    )
}
