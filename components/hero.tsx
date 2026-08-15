"use client"

import { useEffect, useState } from "react"
import PixelBlast from "./PixelBlast"
import { formatCopenhagenTime, isCopenhagenNight } from "@/lib/copenhagen-time"

export function Hero() {
    /*
     * Seeded lazily on the client so the value React hydrates with matches what
     * the inline script in app/layout.tsx already painted during HTML parse.
     * On the server this is "" — the page is statically prerendered, so build
     * time is not a useful "now" — hence suppressHydrationWarning below.
     */
    const [time, setTime] = useState(() =>
        typeof window === "undefined" ? "" : formatCopenhagenTime()
    )
    const [isNight, setIsNight] = useState(() =>
        typeof window === "undefined" ? false : isCopenhagenNight()
    )

    // NEW: controls scroll indicator visibility
    const [showScrollIndicator, setShowScrollIndicator] = useState(true)

    useEffect(() => {
        let interval: number | undefined
        let timeout: number | undefined

        const updateTime = () => {
            const now = new Date()
            setTime(formatCopenhagenTime(now))
            setIsNight(isCopenhagenNight(now))
        }

        updateTime()

        const now = new Date()
        const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

        timeout = window.setTimeout(() => {
            updateTime()
            interval = window.setInterval(updateTime, 60_000)
        }, msToNextMinute)

        return () => {
            if (timeout) window.clearTimeout(timeout)
            if (interval) window.clearInterval(interval)
        }
    }, [])

    // NEW: fade scroll indicator out when user scrolls down, back in at top
    useEffect(() => {
        const thresholdPx = 8 // small buffer so it doesn't flicker at 0

        const onScroll = () => {
            setShowScrollIndicator(window.scrollY <= thresholdPx)
        }

        onScroll() // set initial state
        window.addEventListener("scroll", onScroll, { passive: true })

        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <section className="relative h-[80vh] min-h-[560px] flex items-center overflow-hidden">
            <div className="absolute inset-0">
                <PixelBlast
                    variant="diamond"
                    pixelSize={5}
                    color="#B19EEF"
                    patternScale={2}
                    patternDensity={0.7}
                    pixelSizeJitter={0}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.5}
                    edgeFade={0.25}
                    transparent
                    className="w-full h-full"
                    style={{ display: "block" }}
                />
            </div>

            <div className="w-full mx-auto px-6">
                <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3">
                    <div className="col-span-4 md:col-span-3 flex flex-col justify-end pb-8 md:pb-0 z-10">
                        <span
                            className="material-symbols-outlined text-foreground leading-none mb-1 font-medium"
                            aria-hidden="true"
                            style={{
                                fontSize: 18,
                                fontVariationSettings: '"FILL" 0, "wght" 500, "GRAD" 0, "opsz" 20',
                            }}
                        >
                            {isNight ? "bedtime" : "sunny"}
                        </span>

                        <span
                            id="copenhagen-clock"
                            className="text-base font-medium text-foreground font-sans"
                            aria-label="Current time in Copenhagen"
                            suppressHydrationWarning
                        >
                            {time || "..."}
                        </span>

                        <p className="text-base font-medium text-[var(--text-tertiary)]">
                            Copenhagen, Denmark
                        </p>
                    </div>

                    <div className="col-span-4 md:col-span-7 md:col-start-6 flex flex-col justify-center z-10">
                        <h1 className="text-4xl md:text-[56px] lg:text-[67px] font-medium leading-[1.08] text-foreground text-balance tracking-tight">
                            {"I'm Diana, a design engineer untangling complex systems."}
                        </h1>

                    </div>
                </div>
            </div>

            {/* Scroll indicator (moving mouse) */}
            <div
                className="absolute bottom-8 left-6 z-10 transition-opacity duration-300 ease-out"
                style={{
                    opacity: showScrollIndicator ? 1 : 0,
                    pointerEvents: showScrollIndicator ? "auto" : "none",
                }}
            >
                <span id="scroll-to-explore" className="scroll-to-explore inline-block">
                    <div className="icon-scroll" aria-hidden="true" />
                </span>
            </div>
        </section>
    )
}
