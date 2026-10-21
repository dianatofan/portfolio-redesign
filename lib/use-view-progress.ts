"use client"

import { useEffect, useState, type RefObject } from "react"

/*
 * Scroll progress through a stretch of an element's trip across the window,
 * 0 to 1, in the terms of a CSS view timeline's animation-range: `entry X%`
 * (as the element comes in at the bottom) to `cover Y%` (of its whole trip
 * from entering to leaving at the top). The designs use those ranges, but
 * view timelines aren't in every browser, so this works them out from the
 * scroll position instead. Reduced motion reads as 1, the finished state.
 */
export function useViewProgress(ref: RefObject<HTMLElement | null>, entry: number, cover: number) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setProgress(1)
            return
        }
        let raf = 0
        const update = () => {
            raf = 0
            const vh = window.innerHeight
            const { top, height } = el.getBoundingClientRect()
            const start = vh - (entry / 100) * height
            const end = vh - (cover / 100) * (vh + height)
            setProgress(Math.min(1, Math.max(0, (start - top) / (start - end))))
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update)
        }
        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
            cancelAnimationFrame(raf)
        }
    }, [ref, entry, cover])

    return progress
}
