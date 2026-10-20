"use client"

import { useEffect, useState, type ReactNode } from "react"

/*
 * Underlined word with a dark tooltip explaining it. The tooltip is fixed to the
 * viewport rather than the word, so it can't be clipped by the paragraph's
 * columns; it hides on scroll instead of trying to follow.
 */
export function BmoTooltip({ children }: { children: ReactNode }) {
    const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null)

    useEffect(() => {
        if (!anchor) return
        const hide = () => setAnchor(null)
        window.addEventListener("scroll", hide, { passive: true })
        window.addEventListener("resize", hide)
        return () => {
            window.removeEventListener("scroll", hide)
            window.removeEventListener("resize", hide)
        }
    }, [anchor])

    const show = (el: HTMLElement) => {
        const r = el.getBoundingClientRect()
        setAnchor({ x: r.left + r.width / 2, y: r.top })
    }

    return (
        <span
            tabIndex={0}
            aria-describedby="bmo-tip"
            onMouseEnter={(event) => show(event.currentTarget)}
            onMouseLeave={() => setAnchor(null)}
            onFocus={(event) => show(event.currentTarget)}
            onBlur={() => setAnchor(null)}
            onClick={(event) => show(event.currentTarget)}
            className="relative cursor-default underline decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 outline-none"
            style={{ textDecorationColor: anchor ? "#4f35b8" : "#c8c7ce" }}
        >
            {children}
            <span
                id="bmo-tip"
                role="tooltip"
                className={`pointer-events-none fixed z-[100] block w-[220px] -translate-x-1/2 -translate-y-full rounded-[8px] bg-ink px-3 py-2.5 text-left text-[13px] leading-[1.45] tracking-normal text-white no-underline shadow-[0_8px_24px_-8px_rgba(22,21,26,.35)] ${
                    anchor ? "" : "hidden"
                }`}
                style={
                    anchor
                        ? { left: Math.min(Math.max(anchor.x, 126), window.innerWidth - 126), top: anchor.y - 8 }
                        : undefined
                }
            >
                <span className="font-medium">Bolle med ost</span>: a soft bun with butter and cheese. A Danish bakery
                staple.
            </span>
        </span>
    )
}
