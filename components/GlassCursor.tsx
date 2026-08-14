"use client"

import React, { useContext, useEffect, useRef } from "react"
import { CursorContext } from "@/context/CursorContext"

export function GlassCursor() {
    const { variant, hidden } = useContext(CursorContext)
    const isOpen = variant === "open"
    const shellRef = useRef<HTMLDivElement>(null)

    /*
     * The pointer is followed by writing `transform` directly, coalesced into one
     * write per frame. React state here would re-render this component — and,
     * previously, every other CursorContext consumer — on every mousemove event,
     * which browsers fire faster than they paint.
     */
    useEffect(() => {
        let frame = 0
        let x = 0
        let y = 0

        const flush = () => {
            frame = 0
            if (shellRef.current) {
                shellRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
            }
        }

        const onMove = (event: MouseEvent) => {
            x = event.clientX
            y = event.clientY
            if (!frame) frame = requestAnimationFrame(flush)
        }

        window.addEventListener("mousemove", onMove, { passive: true })
        return () => {
            window.removeEventListener("mousemove", onMove)
            if (frame) cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div
            ref={shellRef}
            className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block ${
                hidden ? "opacity-0" : ""
            }`}
            aria-hidden="true"
        >
            <div
                className={[
                    "-translate-x-1/2 -translate-y-1/2 transform-gpu",
                    "transition-[width,height,transform] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
                    "will-change-[width,height,transform]",
                    // size changes live here now
                    isOpen ? "h-24 w-24" : "h-3 w-3",
                ].join(" ")}
            >
                <div className="relative h-full w-full">
                    {/* CLOSED: dot (always mounted) */}
                    <div
                        className={[
                            "absolute inset-0 rounded-full",
                            "bg-black",
                            "transition-opacity duration-200 ease-out",
                            "will-change-[opacity]",
                            isOpen ? "opacity-0" : "opacity-100",
                        ].join(" ")}
                    />

                    {/* OPEN: glass */}
                    <div
                        className={[
                            "absolute inset-0 rounded-full",
                            // stable dark glass
                            "bg-black/35 border border-white/15",
                            "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                            /*
                             * The backdrop-filter is attached only while the disc is
                             * actually visible. A blur that moves with the pointer
                             * makes the browser re-sample everything behind it every
                             * frame, so an invisible one left mounted "to keep it
                             * warm" was paying that cost across the whole page.
                             */
                            isOpen
                                ? "supports-[backdrop-filter:blur(0)]:backdrop-blur-md supports-[backdrop-filter:blur(0)]:bg-black/25"
                                : "",
                            "transition-[opacity,transform] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
                            "transform-gpu will-change-[opacity,transform]",
                            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
                        ].join(" ")}
                    >
                        {/* optional subtle highlight to mimic glass */}
                        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />

                        <div className="relative flex h-full w-full items-center justify-center">
                            <span
                                className={[
                                    "font-sans text-xs font-normal tracking-tight uppercase",
                                    "transition-all duration-200 ease-out",
                                    "text-white",
                                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-75",
                                ].join(" ")}
                            >
                                Open
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
