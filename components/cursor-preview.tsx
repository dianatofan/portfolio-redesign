"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import Image from "next/image"
import gsap from "gsap"

/*
 * A preview that trails the pointer while a list row is hovered, from the
 * production "Built in Code" list. Every image sits in one tall strip inside a
 * fixed window; changing rows slides the strip, so moving down the list wipes
 * from one project to the next instead of swapping. The glass cursor's "open"
 * state sits on top of it.
 *
 * The isolate + mask pair keeps the rounded clip while the window is scaling:
 * without it Safari draws the children square for the length of the transform.
 */

// 16:10, about 30vw and never wider than 440px, so it shows the work without
// covering the row being read.
const W = "min(440px, 30vw)"
const H = `calc(${W} * 0.625)`

const scale = {
    initial: { scale: 0, x: "-50%", y: "-50%" },
    enter: {
        scale: 1,
        x: "-50%",
        y: "-50%",
        transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
    },
    closed: {
        scale: 0,
        x: "-50%",
        y: "-50%",
        transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] },
    },
}

export function CursorPreview({
    images,
    videos = [],
    active,
    index,
}: {
    images: string[]
    /** Optional clip per image; plays in place of the still. */
    videos?: (string | undefined)[]
    active: boolean
    index: number
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (!mounted || !ref.current) return
        const xMove = gsap.quickTo(ref.current, "left", { duration: 0.8, ease: "power3" })
        const yMove = gsap.quickTo(ref.current, "top", { duration: 0.8, ease: "power3" })
        const onMove = (e: MouseEvent) => {
            xMove(e.clientX)
            yMove(e.clientY)
        }
        window.addEventListener("mousemove", onMove)
        return () => window.removeEventListener("mousemove", onMove)
    }, [mounted])

    if (!mounted) return null

    return createPortal(
        <motion.div
            ref={ref}
            aria-hidden
            variants={scale}
            initial="initial"
            animate={active ? "enter" : "closed"}
            className="pointer-events-none fixed z-[9998] hidden overflow-hidden rounded-[8px] isolate [-webkit-mask-image:-webkit-radial-gradient(white,black)] md:block"
            style={{ width: W, height: H, top: "50%", left: "50%" }}
        >
            <div
                className="relative w-full"
                style={{ top: `calc(${H} * ${-index})`, transition: "top 0.5s cubic-bezier(0.76, 0, 0.24, 1)" }}
            >
                {images.map((src, i) => (
                    <div key={src} className="relative w-full" style={{ height: H }}>
                        {videos[i] ? (
                            <video src={videos[i]} poster={src} autoPlay muted playsInline className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                            <Image src={src} fill alt="" className="object-cover" sizes="(min-width: 1467px) 440px, 30vw" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>,
        document.body
    )
}
