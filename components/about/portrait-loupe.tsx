"use client"

import { useEffect, useRef, useState } from "react"

/*
 * Portrait with a magnifier. At rest a small loupe sits in the bottom-right
 * corner with a zoom icon over it, as a hint. On hover it springs to the cursor
 * and grows to full size, then follows the pointer. Only the first flight
 * animates position; after that it tracks the pointer directly, so it never
 * lags behind it.
 */

const SRC = "/images/about/sibiu.webp"
// Intrinsic size of the file above, so the lens maths works before it loads.
const NATURAL = { w: 1440, h: 1920 }
// Matches the img's object-position, so the lens shows what sits under it.
const FOCUS_Y = 0.22
const LENS = 160
const ZOOM = 2.4
const SPRING = "cubic-bezier(.34,1.56,.64,1)"
const EASE = "cubic-bezier(.2,0,0,1)"
const FLIGHT_MS = 550

type Lens = { x: number; y: number; size: string; position: string }

function lensAt(px: number, py: number, w: number, h: number): Lens {
    // Replays object-fit: cover, so the zoomed background lines up with the img.
    const scale = Math.max(w / NATURAL.w, h / NATURAL.h)
    const dw = NATURAL.w * scale
    const dh = NATURAL.h * scale
    const ox = (w - dw) * 0.5
    const oy = (h - dh) * FOCUS_Y
    const r = LENS / 2
    return {
        x: px,
        y: py,
        size: `${dw * ZOOM}px ${dh * ZOOM}px`,
        position: `${r - (px - ox) * ZOOM}px ${r - (py - oy) * ZOOM}px`,
    }
}

export function PortraitLoupe() {
    const frameRef = useRef<HTMLDivElement>(null)
    const flightTimer = useRef<number | undefined>(undefined)
    const enteredAt = useRef(0)
    const [frame, setFrame] = useState({ w: 320, h: 400 })
    const [active, setActive] = useState<Lens | null>(null)
    const [flying, setFlying] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
        setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        const el = frameRef.current
        if (!el) return
        const measure = () => {
            const r = el.getBoundingClientRect()
            setFrame((prev) => (prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height }))
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(el)
        return () => {
            observer.disconnect()
            window.clearTimeout(flightTimer.current)
        }
    }, [])

    const rest = lensAt(frame.w - 32, frame.h - 32, frame.w, frame.h)
    const lens = active ?? rest
    const on = active !== null

    const transition = reducedMotion
        ? "none"
        : flying || !on
          ? `transform .55s ${SPRING}, left .55s ${EASE}, top .55s ${EASE}, background-position .55s ${EASE}, background-size .55s ${EASE}`
          : `transform .55s ${SPRING}`

    return (
        <div
            ref={frameRef}
            className="relative aspect-[4/5]"
            style={{ cursor: on ? "none" : "zoom-in" }}
            onMouseEnter={() => {
                enteredAt.current = Date.now()
                setActive(rest)
                setFlying(true)
                window.clearTimeout(flightTimer.current)
                flightTimer.current = window.setTimeout(() => setFlying(false), FLIGHT_MS)
            }}
            onMouseMove={(event) => {
                // Ignore the move that arrives with the enter, so the lens
                // starts its flight from the corner instead of jumping.
                if (Date.now() - enteredAt.current < 30) return
                const r = event.currentTarget.getBoundingClientRect()
                setActive(lensAt(event.clientX - r.left, event.clientY - r.top, r.width, r.height))
            }}
            onMouseLeave={() => setActive(null)}
        >
            <div className="absolute inset-0 overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element -- the lens reads the same file as a CSS background */}
                <img
                    src={SRC}
                    alt="Diana holding a bouquet of dahlias in Sibiu"
                    className="absolute inset-0 block h-full w-full object-cover"
                    style={{ objectPosition: `50% ${FOCUS_Y * 100}%` }}
                />
            </div>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute z-[3] rounded-full bg-no-repeat"
                style={{
                    left: lens.x,
                    top: lens.y,
                    width: LENS,
                    height: LENS,
                    margin: `${-LENS / 2}px 0 0 ${-LENS / 2}px`,
                    transform: `scale(${on ? 1 : 0.22})`,
                    transition,
                    backgroundImage: `url(${SRC})`,
                    backgroundSize: lens.size,
                    backgroundPosition: lens.position,
                    boxShadow:
                        "0 0 0 3px #fff, 0 0 0 4px rgba(22,21,26,.25), 0 18px 40px -10px rgba(22,21,26,.55), inset 0 0 18px rgba(0,0,0,.35)",
                }}
            >
                {/* Glass highlight */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle at 32% 26%, rgba(255,255,255,.55) 0, rgba(255,255,255,.12) 22%, transparent 46%), radial-gradient(circle at 70% 80%, rgba(255,255,255,.18) 0, transparent 35%)",
                    }}
                />
                {/* Zoom hint, shown only while the loupe is resting */}
                <div
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-[rgba(22,21,26,.38)] text-white transition-opacity duration-200"
                    style={{ opacity: on ? 0 : 1 }}
                >
                    <svg width="84" height="84" viewBox="0 0 16 16" className="block">
                        <circle cx="6.8" cy="6.8" r="4.6" fill="none" stroke="currentColor" strokeWidth="1" />
                        <line x1="10.1" y1="10.1" x2="13.4" y2="13.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="5" y1="6.8" x2="8.6" y2="6.8" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
                        <line x1="6.8" y1="5" x2="6.8" y2="8.6" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
