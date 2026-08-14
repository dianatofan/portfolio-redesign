"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Holds a subtree unmounted until the visitor is close to it.
 *
 * The homepage's two lower sections cost real time on arrival even though they
 * are ~2,000px below the fold: they sit in the prerendered HTML, and React
 * hydrates the whole tree in one pass, so nothing that runs in an effect — the
 * hero's WebGL renderer above all — can start until that pass has walked past
 * them. Measured on the production build, 698ms of the hero's 751ms to first
 * frame was spent getting to and through hydration; the shader itself was 53ms.
 *
 * Pair it with `next/dynamic` so the deferred subtree's JavaScript leaves the
 * initial bundle too, and give it a `className` that reserves the real content's
 * height so the page doesn't shift when it arrives.
 *
 * Deliberately a one-way latch: once mounted it stays mounted. This is not a
 * virtualisation primitive, and unmounting on scroll-away would throw away
 * component state (an opened microcomponent, a scroll position) and re-run every
 * mount animation on the way back.
 */
export function DeferUntilNear({
    children,
    className,
    /**
     * How much earlier than "visible" to mount, so the content is ready before
     * it is looked at. Generous by default — the cost of being early is a chunk
     * fetched slightly sooner; the cost of being late is a visible pop-in.
     */
    rootMargin = "600px",
    /**
     * Hash that forces an immediate mount, without the `#`. Set it for sections
     * that are anchor targets: a visitor arriving at `/#built-in-code` must land
     * on real content, not on the reserved space.
     */
    mountOnHash,
}: {
    children: ReactNode
    className?: string
    rootMargin?: string
    mountOnHash?: string
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        if (mounted) return

        if (mountOnHash && window.location.hash === `#${mountOnHash}`) {
            setMounted(true)
            return
        }

        // No observer (very old browsers, some crawlers): show everything rather
        // than hide content behind a capability check.
        if (typeof IntersectionObserver === "undefined") {
            setMounted(true)
            return
        }

        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return
                setMounted(true)
                observer.disconnect()
            },
            { rootMargin }
        )
        observer.observe(element)
        return () => observer.disconnect()
    }, [mounted, mountOnHash, rootMargin])

    // The reserve is only needed while empty; once mounted the content sets its
    // own height, and a leftover min-height could fight a shorter layout.
    return (
        <div ref={ref} className={mounted ? undefined : className}>
            {mounted ? children : null}
        </div>
    )
}
