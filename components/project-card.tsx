"use client"

import React, { useContext, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CursorContext } from "@/context/CursorContext"

interface ProjectCardProps {
    title: string
    image: string
    tags?: string[]
    href?: string
    featured?: boolean
    aspectClass?: string
    isPasswordProtected?: boolean
    showCaptionTags?: boolean
    eager?: boolean
}

export function ProjectCard({
    title,
    image,
    tags = [],
    href = "#",
    featured = false,
    aspectClass,
    isPasswordProtected = false,
    showCaptionTags = true,
    eager = false,
}: ProjectCardProps) {
    const { setVariant } = useContext(CursorContext)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const aspect = aspectClass ?? (featured ? "aspect-[16/9]" : "aspect-[4/3]")

    /*
     * `onLoad` never fires for an image the browser already had — a cached one, or
     * one the preload scanner finished before React hydrated. Measured on the live
     * site, the card images were fully downloaded by 900ms but stayed at opacity 0
     * until 1300-2000ms, because the reveal waited on a React event that had
     * already happened and then ran a 700ms fade on top. Reading `complete` off
     * the element as soon as it is attached closes that gap: an image that is
     * already there is shown immediately, and only a genuinely slow one fades in.
     */
    const revealIfReady = (img: HTMLImageElement | null) => {
        if (img?.complete && img.naturalWidth > 0) setIsImageLoaded(true)
    }

    return (
        <Link
            href={href}
            className="group block"
            onMouseEnter={() => setVariant("open")}
            onMouseLeave={() => setVariant("default")}
            onFocus={() => setVariant("open")}
            onBlur={() => setVariant("default")}
            onClick={() => setVariant("default")}
        >
            <article>
                {/* Image tile */}
                <div
                    className={[
                        "relative w-full overflow-hidden bg-card rounded-lg",
                        isImageLoaded ? "" : "animate-pulse",
                        aspect,
                    ].join(" ")}
                >
                    <Image
                        ref={revealIfReady}
                        src={image}
                        alt={`${title} project preview`}
                        fill
                        className="object-cover transform-gpu group-hover:scale-[1.08]"
                        /*
                         * Inline rather than Tailwind utilities because the two
                         * transitions need different durations, and conflicting
                         * `duration-*` classes resolve by stylesheet order, not by
                         * the order they appear in the class list.
                         *
                         * The hover scale keeps its long, soft 700ms curve. The
                         * reveal is 200ms: a card that has finished downloading
                         * should look present, not spend another two thirds of a
                         * second arriving.
                         */
                        style={{
                            opacity: isImageLoaded ? 1 : 0,
                            /*
                             * `scale`, not `transform`: Tailwind v4 compiles
                             * `scale-[1.08]` to the standalone `scale` property
                             * (`scale:1.08`), and `transform-gpu` only ever holds a
                             * constant `translateZ(0)`. Transitioning `transform`
                             * therefore animated nothing and the hover snapped.
                             */
                            transition:
                                "opacity 200ms ease-out, scale 700ms cubic-bezier(.2,.8,.2,1)",
                        }}
                        sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                        priority={featured || eager}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMic+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI2Y0ZjRmNScvPjwvc3ZnPg=="
                        onLoad={() => setIsImageLoaded(true)}
                    />

                    {/* Glass chips (appear on hover, animate top->down) */}
                    {tags.length > 0 && (
                        <div
                            className="
                absolute left-4 top-4
                flex flex-wrap gap-2
                pointer-events-none
                opacity-0 -translate-y-3
                transform-gpu
                transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]
                group-hover:opacity-100 group-hover:translate-y-0
              "
                        >
                            {tags.map((tag, idx) => (
                                <span
                                    key={tag}
                                    className="
    relative inline-flex items-center
    rounded-full px-3 py-1
    text-sm font-sans tracking-wide text-white
    bg-black/35 border border-white/15
    shadow-[0_10px_24px_rgba(0,0,0,0.35)]
    overflow-hidden

    transform-gpu will-change-[transform,opacity]
    transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]
    opacity-0 -translate-y-2
    group-hover:opacity-100 group-hover:translate-y-0
  "
                                    style={{ transitionDelay: `${80 + idx * 60}ms` }}
                                >
                                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                                    <span className="relative">{tag}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Caption row under image */}
                <div className="mt-3 flex items-baseline justify-between gap-6">
                    <h3 className="font-medium text-foreground leading-snug max-w-[60ch]">
                        {title}
                    </h3>

                    {((showCaptionTags && tags.length > 0) || isPasswordProtected) && (
                        <div className="shrink-0 flex items-center gap-2">
                            {showCaptionTags && tags.length > 0 && (
                                <div className="text-xs md:text-sm text-[var(--text-tertiary)] tracking-wide uppercase">
                                    {tags.join(" \u00A0\u2022\u00A0 ")}
                                </div>
                            )}

                            {isPasswordProtected && (
                                <span
                                    className="
                      inline-flex items-center gap-1
                    rounded-full
                    px-2.5 py-1
                    text-xs md:text-sm
                    tracking-wide uppercase
                    text-[var(--text-tertiary)]
                    border border-[color:rgba(0,0,0,0.12)]
                    dark:border-white/15
                  "
                                    aria-label="Password protected"
                                    title="Password protected"
                                >
                                    <span
                                        className="material-symbols-outlined text-[16px] leading-none"
                                        aria-hidden="true"
                                    >
                                        lock
                                    </span>
                                    <span className="sr-only">Password protected</span>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    )
}
