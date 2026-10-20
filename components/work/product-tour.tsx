"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"

/*
 * A product tour: one large screen at a time, with numbered notes pinned to the
 * parts that matter, a title and one line, and arrows to step through. Built to
 * be skimmed like a product page rather than read like an essay.
 *
 * Keyboard: ← → when the tour has focus. Touch: swipe. Only the current slide's
 * video is mounted, so the page never downloads the whole tour up front.
 */

export type TourNote = {
    /** The region the note is about: top-left corner and size, as fractions of the screen. */
    x: number
    y: number
    w: number
    h: number
    label: string
}

export type TourSlide = {
    /** A word or two for the row of screens above the tour. */
    tab: string
    title: string
    text: string
    video?: string
    poster: string
    /** Read by screen readers in place of the moving picture. */
    alt: string
    notes?: TourNote[]
}

const EASE = "cubic-bezier(.2,0,0,1)"

export function ProductTour({ slides, label }: { slides: TourSlide[]; label: string }) {
    const [index, setIndex] = useState(0)
    const [hot, setHot] = useState<number | null>(null)
    const [reduced, setReduced] = useState(false)
    const swipe = useRef<number | null>(null)
    const slide = slides[index]
    const total = slides.length
    const pad = (n: number) => String(n).padStart(2, "0")

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const onChange = () => setReduced(mq.matches)
        onChange()
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [])

    const go = (next: number) => {
        setIndex((next + total) % total)
        setHot(null)
    }

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowRight") go(index + 1)
        else if (e.key === "ArrowLeft") go(index - 1)
        else return
        e.preventDefault()
    }
    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse") swipe.current = e.clientX
    }
    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        if (swipe.current === null) return
        const dx = e.clientX - swipe.current
        swipe.current = null
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    }

    const arrow = (dir: -1 | 1) => (
        <button
            type="button"
            onClick={() => go(index + dir)}
            aria-label={dir < 0 ? "Previous screen" : "Next screen"}
            className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-transparent text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                    d={dir < 0 ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    )

    const next = slides[(index + 1) % total]

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brand"
        >
            {/* The screens by name, so it reads as a tour at a glance; also how you jump around. */}
            <div className="-mx-1 flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Screens">
                {slides.map((s, i) => (
                    <button
                        key={s.tab}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        onClick={() => go(i)}
                        className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                            i === index ? "bg-ink text-[var(--paper)]" : "text-ink-muted hover:bg-surface hover:text-ink"
                        }`}
                    >
                        {s.tab}
                    </button>
                ))}
            </div>

            {/* The current screen's title and line, with the arrows beside it. */}
            <div className="flex items-end justify-between gap-6">
                <div aria-live="polite" className="flex min-w-0 flex-col gap-1.5">
                    <h3 className="text-[clamp(22px,2vw,28px)] font-medium leading-[1.15] tracking-[-0.025em] text-ink text-balance">
                        {slide.title}
                    </h3>
                    <p className="max-w-[640px] text-[15px] leading-[1.45] text-ink-muted text-pretty">{slide.text}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {arrow(-1)}
                    <button
                        type="button"
                        onClick={() => go(index + 1)}
                        className="flex h-11 items-center gap-2 rounded-full bg-ink pr-4 pl-5 text-[15px] text-[var(--paper)] transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                        {next.tab}
                        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/*
              The screen, with its notes beside it rather than on it, so nothing
              covers the recording. Each note is a short purple bar and a caption;
              hovering or focusing one rings the spot it means on the screen.
            */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-8">
                {/* A slim charcoal bezel, so the white UI reads as a screen on the dark panel. */}
                <div className="rounded-[18px] bg-[#26252b] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-2.5">
                <div
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    className="relative aspect-[8/5] touch-pan-y overflow-hidden rounded-[10px] bg-surface"
                >
                    <div
                        key={index}
                        className={reduced ? "absolute inset-0" : "absolute inset-0 animate-[tour-in_.35s_both]"}
                        style={{ animationTimingFunction: EASE }}
                    >
                        {slide.video && !reduced ? (
                            <video
                                src={slide.video}
                                poster={slide.poster}
                                autoPlay
                                muted
                                loop
                                playsInline
                                aria-label={slide.alt}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={slide.poster} alt={slide.alt} className="h-full w-full object-cover" />
                        )}
                    </div>
                    {/* The hovered note's spot gets a purple ring with a soft halo. */}
                    {hot !== null && slide.notes?.[hot] && (
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand shadow-[0_0_0_6px_rgba(79,53,184,0.15)]"
                            style={{
                                left: `${(slide.notes[hot].x + slide.notes[hot].w / 2) * 100}%`,
                                top: `${(slide.notes[hot].y + slide.notes[hot].h / 2) * 100}%`,
                            }}
                        />
                    )}

                    {/* A pulsing dot on each region, always there, so you know where to look. */}
                    {slide.notes?.map((note, i) => (
                        <button
                            key={`${index}-dot-${i}`}
                            type="button"
                            onMouseEnter={() => setHot(i)}
                            onMouseLeave={() => setHot(null)}
                            onFocus={() => setHot(i)}
                            onBlur={() => setHot(null)}
                            aria-label={note.label}
                            className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-brand"
                            style={{ left: `${(note.x + note.w / 2) * 100}%`, top: `${(note.y + note.h / 2) * 100}%` }}
                        >
                            {!reduced && (
                                <span className="absolute h-3 w-3 animate-[tour-pulse_2.2s_ease-out_infinite] rounded-full bg-brand/50" />
                            )}
                            <span
                                className={`relative h-3 w-3 rounded-full bg-brand shadow-[0_0_0_2px_#fff,0_2px_6px_rgba(22,21,26,0.35)] transition-transform duration-200 ${
                                    hot === i ? "scale-150" : ""
                                }`}
                            />
                        </button>
                    ))}
                </div>

                </div>

                <div className="flex flex-col justify-between gap-6">
                    <ol className="flex flex-col gap-4">
                        {slide.notes?.map((note, i) => (
                            <li key={`${index}-${i}`}>
                                <button
                                    type="button"
                                    onMouseEnter={() => setHot(i)}
                                    onMouseLeave={() => setHot(null)}
                                    onFocus={() => setHot(i)}
                                    onBlur={() => setHot(null)}
                                    className={`flex w-full gap-3 text-left text-[15px] leading-[1.4] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                                        hot === i ? "text-ink" : "text-ink-muted"
                                    }`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`w-0.5 shrink-0 self-stretch rounded-full transition-colors ${hot === i ? "bg-brand" : "bg-brand/35"}`}
                                    />
                                    {note.label}
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    )
}
