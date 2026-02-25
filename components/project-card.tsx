"use client"

import React, { useContext } from "react"
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
}

export function ProjectCard({
    title,
    image,
    tags = [],
    href = "#",
    featured = false,
    aspectClass,
    isPasswordProtected = false,
}: ProjectCardProps) {
    const { setVariant } = useContext(CursorContext)
    const aspect = aspectClass ?? (featured ? "aspect-[16/9]" : "aspect-[4/3]")

    return (
        <Link
            href={href}
            className="group block"
            onMouseEnter={() => setVariant("open")}
            onMouseLeave={() => setVariant("default")}
            onFocus={() => setVariant("open")}
            onBlur={() => setVariant("default")}
        >
            <article>
                {/* Image tile */}
                <div
                    className={["relative w-full overflow-hidden bg-card rounded-lg", aspect].join(
                        " "
                    )}
                >
                    <Image
                        src={image}
                        alt={`${title} project preview`}
                        fill
                        className="
              object-cover transform-gpu transition-transform
              duration-700 ease-[cubic-bezier(.2,.8,.2,1)]
              group-hover:scale-[1.08]
            "
                        sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                        priority={featured}
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

                    {(tags.length > 0 || isPasswordProtected) && (
                        <div className="shrink-0 flex items-center gap-2">
                            {tags.length > 0 && (
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
