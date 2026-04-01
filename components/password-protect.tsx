"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isProjectUnlocked, persistProjectUnlock } from "@/lib/project-auth"

interface PasswordProtectProps {
    children: React.ReactNode
    projectSlug: string
    /** Default password is "design2025" - change this in production */
    correctPassword?: string
}

export function PasswordProtect({
    children,
    projectSlug,
    correctPassword = "design2025",
}: PasswordProtectProps) {
    const [password, setPassword] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // Check localStorage on mount
    useEffect(() => {
        setIsAuthenticated(isProjectUnlocked(projectSlug, correctPassword))
        setIsLoading(false)
    }, [projectSlug, correctPassword])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password === correctPassword) {
            persistProjectUnlock(projectSlug, password)
            setIsAuthenticated(true)
        } else {
            setError("Incorrect password. Please try again.")
            setPassword("")
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin h-8 w-8 border-4 border-foreground border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <span
                            className="material-symbols-outlined text-foreground mb-4 inline-block"
                            style={{
                                fontSize: 48,
                                fontVariationSettings:
                                    '"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 48',
                            }}
                        >
                            lock
                        </span>
                        <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-2">
                            Password Protected
                        </h1>
                        <p className="text-base text-[var(--text-secondary)]">
                            This project is confidential. Please enter the password to view.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full"
                                autoFocus
                            />
                            {error && (
                                <p className="text-sm text-red-600 mt-2" role="alert">
                                    {error}
                                </p>
                            )}
                        </div>
                        <Button type="submit" className="w-full">
                            Access Project
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors"
                        >
                            ← Back to projects
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
