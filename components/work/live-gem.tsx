"use client"

import dynamic from "next/dynamic"
import { useCallback, useState } from "react"
import type { GemFinish } from "./gem/gem-shader"

/*
 * A live, turning diamond from the hub (see gem/live-gem-canvas). three.js is
 * loaded only when one of these is on the page, and the hub's still of the same
 * finish shows until the first frame is drawn.
 */

const LiveGemCanvas = dynamic(() => import("./gem/live-gem-canvas"), { ssr: false })

const STILL: Record<GemFinish, string> = {
    frosted: "/images/dianas-diamonds/finish-frosted.webp",
    clear: "/images/dianas-diamonds/finish-clear.webp",
    brilliant: "/images/dianas-diamonds/finish-brilliant.webp",
}

export function LiveGem({
    finish,
    size,
    className = "",
    rotateOffset = 0,
    label,
}: {
    finish: GemFinish
    /** Width in px; the stone keeps a 4:3 frame. Or size it with className. */
    size?: number
    className?: string
    rotateOffset?: number
    /** Spoken description; the stone is decorative without it. */
    label?: string
}) {
    const [ready, setReady] = useState(false)
    const onReady = useCallback(() => setReady(true), [])

    return (
        <div
            role={label ? "img" : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            className={`relative aspect-[4/3] ${className}`}
            style={size ? { width: size } : undefined}
        >
            {/* The still, blended into the page, until the live stone is drawn. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={STILL[finish]}
                alt=""
                className={`absolute inset-0 h-full w-full object-contain mix-blend-multiply transition-opacity duration-300 ${
                    ready ? "opacity-0" : "opacity-100"
                }`}
                style={{
                    maskImage: "radial-gradient(ellipse 50% 46% at 50% 50%, #000 62%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 50% 46% at 50% 50%, #000 62%, transparent 100%)",
                }}
            />
            <LiveGemCanvas finish={finish} rotateOffset={rotateOffset} onReady={onReady} />
        </div>
    )
}
