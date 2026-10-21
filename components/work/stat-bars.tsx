"use client"

import { useEffect, useRef, useState } from "react"

/*
 * A result figure that plays once as it scrolls into view: the number counts up
 * from 0, and for a "fewer / faster" percentage the After bar shrinks from the
 * Before length to what is left. With reduced motion it is shown as it ends.
 */

const EASE = (t: number) => 1 - Math.pow(1 - t, 3)
const DURATION = 1200

export function StatBars({ value, label }: { value: string; label: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const [t, setT] = useState(0)

    const match = value.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/)
    const target = match ? parseFloat(match[2].replace(",", ".")) : NaN
    const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0
    const fewer = value.endsWith("%") && /fewer|faster|less|reduc/i.test(label)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || Number.isNaN(target)) {
            setT(1)
            return
        }
        let raf = 0
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                observer.disconnect()
                const start = performance.now()
                const step = (now: number) => {
                    const k = Math.min(1, (now - start) / DURATION)
                    setT(EASE(k))
                    if (k < 1) raf = requestAnimationFrame(step)
                }
                raf = requestAnimationFrame(step)
            },
            { threshold: 0.4 }
        )
        observer.observe(el)
        return () => {
            observer.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [target])

    const shown = match && !Number.isNaN(target) ? `${match[1]}${(target * t).toFixed(decimals)}${match[3]}` : value
    const after = 100 - (Number.isNaN(target) ? 0 : target) * t

    return (
        <div ref={ref} className="flex flex-col gap-3.5 border-t border-ink pt-4">
            {/* The real value for screen readers; the counting copy is decorative. */}
            <span className="sr-only">{value}</span>
            <span aria-hidden="true" className="text-[clamp(40px,5.2vw,80px)] font-medium leading-none tracking-[-0.055em] tabular-nums">
                {shown}
            </span>
            <span className="text-[15px] text-ink-muted">{label}</span>
            {fewer && (
                <div aria-hidden="true" className="flex flex-col gap-2 pt-1.5 text-[13px]">
                    <div className="grid grid-cols-[52px_1fr] items-center gap-2.5 text-ink-meta">
                        <span>Before</span>
                        <span className="h-2.5 rounded-full bg-[#c9c8d0]" />
                    </div>
                    <div className="grid grid-cols-[52px_1fr] items-center gap-2.5">
                        <span>After</span>
                        <span className="h-2.5 rounded-full bg-brand" style={{ width: `${after}%` }} />
                    </div>
                </div>
            )}
        </div>
    )
}
