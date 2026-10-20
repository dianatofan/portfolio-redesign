"use client"

import { useEffect } from "react"

/*
 * Case-study blocks fade up once as they scroll into view: a short rise and a
 * fade, then they stay put. Styles are set inline so the effect never depends
 * on a stylesheet being rebuilt. With reduced motion nothing moves.
 */

const BLOCKS = "h2, h3, p, li, blockquote, figure, dl"
const SKIP = "[aria-roledescription=carousel] *, [data-no-reveal]"

export function ScrollFade({ root }: { root: string }) {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const container = document.querySelector<HTMLElement>(root)
        if (!container) return

        // Only blocks not already on screen, so nothing above the fold flickers.
        const blocks = [...container.querySelectorAll<HTMLElement>(BLOCKS)].filter(
            (el) => !el.matches(SKIP) && el.getBoundingClientRect().top > window.innerHeight
        )
        blocks.forEach((el) => {
            el.style.opacity = "0"
            el.style.transform = "translateY(12px)"
            el.style.transition = "opacity .6s cubic-bezier(.2,0,0,1), transform .6s cubic-bezier(.2,0,0,1)"
        })

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    const el = entry.target as HTMLElement
                    el.style.opacity = "1"
                    el.style.transform = "none"
                    observer.unobserve(el)
                })
            },
            { rootMargin: "0px 0px -10% 0px" }
        )
        blocks.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [root])

    return null
}
