"use client"

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"

/*
 * A product tour: one large screen at a time, with notes beside it, a title and
 * one line, and arrows to step through. Built to be skimmed like a product page
 * rather than read like an essay.
 *
 * It plays itself like a story: each screen runs its recording (or 8s for a
 * still), the active tab's bar fills as it goes, and the next screen follows.
 * Hovering pauses it; clicking, swiping or using the keyboard pauses it for 6s.
 * It only plays while at least half of it is on screen, and never with reduced
 * motion. Behind the screen a blurred copy of the poster tints the dark panel,
 * like Apple TV's ambient mode.
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
const STILL_MS = 8000
const RESUME_MS = 6000
const SWAP_MS = 350
// Inline so it never depends on generated utility classes.
const GLOW = { opacity: 0.16, filter: "blur(80px) saturate(1.5)", transform: "scale(1.05)" } as const

// Kept here, not in globals.css, so the tour never depends on a stylesheet rebuild.
const KEYFRAMES = `
@keyframes tour-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes tour-in{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
@keyframes tour-out{from{opacity:1;transform:none}to{opacity:0;transform:scale(.98)}}
@keyframes tour-fade{from{opacity:0}to{opacity:.16}}
@keyframes tour-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(3.2);opacity:0}}
`

export function ProductTour({ slides, label }: { slides: TourSlide[]; label: string }) {
    const [index, setIndex] = useState(0)
    // The slide being swapped out, kept mounted only for the length of the swap.
    const [prev, setPrev] = useState<number | null>(null)
    const [hot, setHot] = useState<number | null>(null)
    const [reduced, setReduced] = useState(false)
    const [inView, setInView] = useState(false)
    const [hovering, setHovering] = useState(false)
    const [held, setHeld] = useState(false)

    const rootRef = useRef<HTMLDivElement>(null)
    const [arrow, setArrow] = useState<{ key: string; line: string; head: string } | null>(null)
    // For the hand-drawn arrow from a note to its dot.
    const gridRef = useRef<HTMLDivElement>(null)
    const screenRef = useRef<HTMLDivElement>(null)
    const noteRefs = useRef<(HTMLButtonElement | null)[]>([])
    const videoRef = useRef<HTMLVideoElement>(null)
    const fillRef = useRef<HTMLSpanElement>(null)
    const swipe = useRef<number | null>(null)
    const elapsed = useRef(0)
    const holdTimer = useRef(0)
    const swapTimer = useRef(0)
    const indexRef = useRef(0)

    const slide = slides[index]
    const total = slides.length
    const playing = !reduced && inView && !hovering && !held

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const onChange = () => setReduced(mq.matches)
        onChange()
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [])

    useEffect(() => {
        const el = rootRef.current
        if (!el) return
        const io = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.5), {
            threshold: [0, 0.5, 1],
        })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    useEffect(
        () => () => {
            window.clearTimeout(holdTimer.current)
            window.clearTimeout(swapTimer.current)
        },
        []
    )

    const go = useCallback(
        (next: number) => {
            const target = (next + total) % total
            const current = indexRef.current
            if (current === target) return
            indexRef.current = target
            setPrev(current)
            setIndex(target)
            window.clearTimeout(swapTimer.current)
            swapTimer.current = window.setTimeout(() => setPrev(null), SWAP_MS)
            elapsed.current = 0
            if (fillRef.current) fillRef.current.style.transform = "scaleX(0)"
            setHot(null)
        },
        [total]
    )

    // A deliberate move by the reader holds the story for a while, then lets it run on.
    const goByHand = (next: number) => {
        setHeld(true)
        window.clearTimeout(holdTimer.current)
        holdTimer.current = window.setTimeout(() => setHeld(false), RESUME_MS)
        go(next)
    }

    /*
     * One frame loop drives the active tab's bar: a recording reports its own
     * position, a still counts time only while the story is playing. Runs only
     * while the tour is on screen.
     */
    useEffect(() => {
        if (reduced || !inView) return
        let raf = 0
        let last = performance.now()
        const tick = (now: number) => {
            const dt = now - last
            last = now
            let p = 0
            const video = videoRef.current
            if (slide.video && video) {
                p = video.duration ? video.currentTime / video.duration : 0
            } else {
                if (playing) elapsed.current += dt
                p = elapsed.current / STILL_MS
                if (p >= 1 && playing) {
                    go(index + 1)
                    return
                }
            }
            if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.min(1, p).toFixed(4)})`
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [reduced, inView, playing, slide.video, index, go])

    // Recordings only play while the tour is on screen.
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (inView) video.play().catch(() => {})
        else video.pause()
    }, [inView, index])

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowRight") goByHand(index + 1)
        else if (e.key === "ArrowLeft") goByHand(index - 1)
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
        if (Math.abs(dx) > 40) goByHand(index + (dx < 0 ? 1 : -1))
    }

    const stepButton = (dir: -1 | 1) => (
        <button
            type="button"
            onClick={() => goByHand(index + dir)}
            aria-label={dir < 0 ? "Previous screen" : "Next screen"}
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline bg-transparent text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
    const outgoing = prev !== null ? slides[prev] : null

    /*
     * The arrow runs from the left edge of the hovered caption to its dot on the
     * screen, bowing upward like a quick pen stroke, with a small open head.
     * Measured in the grid's own coordinates; recomputed on hover and resize.
     */
    useEffect(() => {
        const draw = () => {
            const grid = gridRef.current
            const screen = screenRef.current
            const note = hot !== null ? slide.notes?.[hot] : undefined
            const label = hot !== null ? noteRefs.current[hot] : null
            if (!grid || !screen || !note || !label || window.innerWidth < 1100) return setArrow(null)
            const g = grid.getBoundingClientRect()
            const sc = screen.getBoundingClientRect()
            const lb = label.getBoundingClientRect()
            const x1 = lb.left - g.left - 10
            const y1 = lb.top - g.top + lb.height / 2
            const x2 = sc.left - g.left + (note.x + note.w / 2) * sc.width + 14
            const y2 = sc.top - g.top + (note.y + note.h / 2) * sc.height
            const dx = x2 - x1
            const bow = Math.min(90, Math.abs(dx) * 0.25)
            const c1x = x1 + dx * 0.3, c1y = Math.min(y1, y2) - bow
            const c2x = x1 + dx * 0.75, c2y = y2 - bow * 0.6
            // Head: two short strokes along the curve's final direction.
            const ang = Math.atan2(y2 - c2y, x2 - c2x)
            const h = 10
            const p = (a: number) => `${(x2 - h * Math.cos(ang + a)).toFixed(1)} ${(y2 - h * Math.sin(ang + a)).toFixed(1)}`
            setArrow({
                key: `${index}-${hot}`,
                line: `M${x1.toFixed(1)} ${y1.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
                head: `M${p(0.5)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${p(-0.5)}`,
            })
        }
        draw()
        window.addEventListener("resize", draw)
        return () => window.removeEventListener("resize", draw)
    }, [hot, index, slide])

    return (
        <div
            ref={rootRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            className="flex flex-col gap-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brand"
        >
            <style>{KEYFRAMES}</style>

            {/* The screens by name, so it reads as a tour at a glance; also how you jump around. */}
            <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Screens">
                {slides.map((s, i) => {
                    const active = i === index
                    return (
                        <button
                            key={s.tab}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => goByHand(i)}
                            className={`relative isolate shrink-0 overflow-hidden flex h-9 items-center rounded-full px-4 text-[15px] whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                                active
                                    ? reduced
                                        ? "bg-ink text-[var(--paper)]"
                                        : "bg-surface text-ink"
                                    : "text-ink-muted hover:bg-surface hover:text-ink"
                            }`}
                        >
                            {/*
                              The chip itself is the timer: it fills left to right as the
                              screen plays. The label uses difference blending, so it stays
                              readable on both the filled and the empty part.
                            */}
                            {active && !reduced && (
                                <span
                                    ref={fillRef}
                                    aria-hidden="true"
                                    className="absolute inset-0 -z-10 origin-left bg-ink"
                                    style={{ transform: "scaleX(0)" }}
                                />
                            )}
                            <span className={active && !reduced ? "text-white mix-blend-difference" : undefined}>{s.tab}</span>
                        </button>
                    )
                })}
            </div>

            {/* The current screen's title and line, with the arrows beside it. */}
            <div className="flex items-end justify-between gap-6">
                <div aria-live="polite" className="flex min-w-0 flex-col gap-1.5">
                    <h3 className="text-[18px] font-medium leading-[1.6] text-ink text-balance">
                        {slide.title}
                    </h3>
                    <p className="max-w-[640px] text-[18px] leading-[1.6] text-ink-muted text-pretty">{slide.text}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {stepButton(-1)}
                    <button
                        type="button"
                        onClick={() => goByHand(index + 1)}
                        className="flex h-9 items-center gap-1.5 rounded-full bg-ink pr-3 pl-4 text-[15px] text-[var(--paper)] transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
            <div ref={gridRef} className="relative grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-8">
                <div className="relative">
                    {/* Ambient glow: a blurred copy of the poster tints the panel around the screen. */}
                    <div aria-hidden="true" className="pointer-events-none absolute -inset-4 sm:-inset-6">
                        {outgoing && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={outgoing.poster}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                                style={GLOW}
                            />
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            key={`glow-${index}`}
                            src={slide.poster}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                            style={reduced ? GLOW : { ...GLOW, animation: `tour-fade ${SWAP_MS * 2}ms ${EASE} both` }}
                        />
                    </div>

                    {/* A slim charcoal bezel, so the white UI reads as a screen on the dark panel. */}
                    <div className="relative rounded-[18px] bg-[#26252b] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-2.5">
                        <div
                            ref={screenRef}
                            onPointerDown={onPointerDown}
                            onPointerUp={onPointerUp}
                            className="relative aspect-[8/5] touch-pan-y overflow-hidden rounded-[10px] bg-surface"
                        >
                            {/* The outgoing screen recedes while the new one slides in. */}
                            {outgoing && !reduced && (
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                    style={{ animation: `tour-out ${SWAP_MS}ms ${EASE} both` }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={outgoing.poster} alt="" className="h-full w-full object-cover" />
                                </div>
                            )}
                            <div
                                key={index}
                                className="absolute inset-0"
                                style={reduced ? undefined : { animation: `tour-in ${SWAP_MS}ms ${EASE} both` }}
                            >
                                {slide.video && !reduced ? (
                                    <video
                                        ref={videoRef}
                                        src={slide.video}
                                        poster={slide.poster}
                                        autoPlay
                                        muted
                                        // Loops while the story is held; plays through once while it runs.
                                        loop={!playing}
                                        playsInline
                                        onEnded={() => playing && go(index + 1)}
                                        aria-label={slide.alt}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={slide.poster} alt={slide.alt} className="h-full w-full object-cover" />
                                )}
                            </div>

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
                                    {/* Soft and dimmed at rest, in the pencil arrow's lavender; full when its note is hovered. */}
                                    {!reduced && (
                                        <span
                                            className="absolute h-4 w-4 rounded-full bg-[#a99ae6]/30"
                                            style={{ animation: "tour-pulse 3.2s ease-out infinite" }}
                                        />
                                    )}
                                    <span
                                        className={`relative h-3.5 w-3.5 rounded-full border-[1.5px] transition-[background-color,border-color,transform] duration-300 ${
                                            hot === i
                                                ? "scale-125 border-[#a99ae6] bg-[#a99ae6]"
                                                : "border-[#a99ae6]/70 bg-[#a99ae6]/25"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* The hovered note's hand-drawn arrow, from its caption to its dot. Wide screens only. */}
                {arrow && (
                    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full overflow-visible xl:block">
                        <defs>
                            <filter id="tour-pencil" x="-10%" y="-10%" width="120%" height="120%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
                                <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                        </defs>
                        <g key={arrow.key} filter="url(#tour-pencil)" fill="none" stroke="#a99ae6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path
                                d={arrow.line}
                                pathLength={1}
                                style={{ strokeDasharray: 1, animation: reduced ? undefined : `tour-draw .45s ${EASE} both` }}
                            />
                            <path
                                d={arrow.head}
                                pathLength={1}
                                style={{ strokeDasharray: 1, animation: reduced ? undefined : `tour-draw .2s .4s ${EASE} both` }}
                            />
                        </g>
                    </svg>
                )}

                <div className="relative flex flex-col justify-between gap-6">
                    <ol className="flex flex-col gap-4">
                        {slide.notes?.map((note, i) => (
                            <li key={`${index}-${i}`}>
                                <button
                                    ref={(el) => {
                                        noteRefs.current[i] = el
                                    }}
                                    type="button"
                                    onMouseEnter={() => setHot(i)}
                                    onMouseLeave={() => setHot(null)}
                                    onFocus={() => setHot(i)}
                                    onBlur={() => setHot(null)}
                                    className={`flex w-full gap-3 text-left text-[18px] leading-[1.6] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
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
