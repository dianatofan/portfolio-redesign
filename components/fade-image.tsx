"use client"

import { useState } from "react"
import Image from "next/image"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

type FadeImageProps = ComponentProps<typeof Image>

export function FadeImage({ className, onLoad, ...props }: FadeImageProps) {
    const [loaded, setLoaded] = useState(false)

    /*
     * `onLoad` never fires for an image the browser already had — a cached one, or
     * one the preload scanner finished before React hydrated — which left those
     * images sitting at opacity 0 with nothing left to trigger the reveal.
     * Checking `complete` as the element attaches covers that case.
     */
    const revealIfReady = (img: HTMLImageElement | null) => {
        if (img?.complete && img.naturalWidth > 0) setLoaded(true)
    }

    return (
        <Image
            {...props}
            ref={revealIfReady}
            className={cn("transition-opacity duration-200 ease-out", className)}
            style={{ opacity: loaded ? 1 : 0, ...props.style }}
            onLoad={(e) => {
                setLoaded(true)
                if (typeof onLoad === "function") onLoad(e)
            }}
        />
    )
}
