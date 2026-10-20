"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getClientAnalyticsContext } from "@/lib/analytics"
import { hasGlobalProjectUnlock, isProjectUnlocked, persistProjectUnlock } from "@/lib/project-auth"
import { trackEvent } from "@/lib/track-event"

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
    const [isVisible, setIsVisible] = useState(false)
    const hasTrackedGateViewRef = useRef(false)

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    useEffect(() => {
        if (!enabled) {
            setIsUnlocked(true)
            return
        }

        setIsUnlocked(isProjectUnlocked(projectSlug, correctPassword))
    }, [projectSlug, correctPassword, enabled])

    useEffect(() => {
        if (!enabled || isUnlocked || hasTrackedGateViewRef.current) return

        hasTrackedGateViewRef.current = true
        trackEvent("password_gate_viewed", {
            projectSlug,
            gateType: "inline",
            ...getClientAnalyticsContext(),
        })
    }, [enabled, isUnlocked, projectSlug])

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault()
        trackEvent("password_unlock_attempt", {
            projectSlug,
            gateType: "inline",
            ...getClientAnalyticsContext(),
        })

        if (password === correctPassword) {
            const hadGlobalUnlock = hasGlobalProjectUnlock()
            persistProjectUnlock(projectSlug, password)
            setIsUnlocked(true)
            setError("")
            trackEvent("password_unlock_success", {
                projectSlug,
                gateType: "inline",
                unlockScope: hadGlobalUnlock ? "already-global" : "new-global",
                ...getClientAnalyticsContext(),
            })
            return
        }

        trackEvent("password_unlock_failed", {
            projectSlug,
            gateType: "inline",
            ...getClientAnalyticsContext(),
        })
        setError("Incorrect password. Please try again.")
        setPassword("")
    }

    if (isUnlocked || !enabled) {
        return (
            <div
                className={`transition-all duration-300 ease-out [&>section+section]:mt-24 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
            >
                {children}
            </div>
        )
    }

    return (
        <section
            id="solution"
            className={`space-y-6 transition-all duration-300 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
            <h2 className="text-[clamp(30px,3.2vw,44px)] font-medium leading-[1.05] tracking-[-0.04em] text-ink">
                Solution
            </h2>
            <div className="border-y border-hairline py-6">
                <p className="text-lg text-ink">Add password to keep reading.</p>
                <form onSubmit={handleUnlock} className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Input
                        type="password"
                        placeholder="Enter password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 rounded-none border-hairline text-[15px] shadow-none sm:max-w-xs"
                    />
                    <Button
                        type="submit"
                        className="h-11 rounded-full bg-ink px-5 text-[15px] font-medium text-white hover:bg-brand sm:w-auto"
                    >
                        Unlock section
                    </Button>
                </form>
                {error && (
                    <p className="mt-2 text-[13px] text-red-600" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </section>
    )
}
