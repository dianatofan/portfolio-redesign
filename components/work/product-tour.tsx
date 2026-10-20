"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"

/*
 * A product tour, ported from Case Study v3: one screen at a time on a dark
 * panel, the screens by name, a title and one line, a Notes toggle and
 * ← n / 8 → to step through. With Notes on, each pin gets a hand-drawn note:
 * a loose ring around the target, a curved arrow from a white label, and a
 * two-stroke arrowhead, drawing on one after another.
 *
 * Keyboard: ← → when the tour has focus. Touch: swipe. Only the current slide's
 * recording is mounted, and it only plays while the tour is on screen.
 */

export type TourPin = {
    /** The target's centre, in percent of the 16:10 recording. Edit these to move a note. */
    x: number
    y: number
    label: string
    /** false = just the arrow, no ring: for a spread-out target like the whole pile. */
    ring?: boolean
    /** Where the label sits, in percent, when the automatic spot covers something. */
    lx?: number
    ly?: number
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
    pins?: TourPin[]
    /** The recording is a dark UI: note labels turn white so they still stand out. */
    dark?: boolean
}

const INK = "#7b5cff"
// The screen keeps the recordings' own 16:10, so the drawing space is 160 × 100
// (v3 draws on 160 × 90 for a 16:9 screen); one user unit is square either way.
const VB_W = 160
const VB_H = 100

// Kept here, not in globals.css, so the tour never depends on a stylesheet rebuild.
const KEYFRAMES = `
@keyframes cs3draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes cs3pop{from{opacity:0;scale:.85}to{opacity:1;scale:1}}
`

type Anno = {
    d0: string
    d1: string
    d2: string
    d3: string
    t: string
    lxn: number
    lyn: number
    lx: string
    ly: string
    rot: number
    d: string
    head: string
    ring: string
}

/*
 * v3's anno(), as written, with its y scale changed from .9 to 1 for the 16:10
 * screen. The label goes on the target's side, toward the edge; if it lands
 * within 34% × 18% of an earlier one it moves up or down.
 */
function anno(x: number, y: number, t: string, i: number, prev: Anno[], withRing = true, at?: { lx?: number; ly?: number }): Anno {
    const c = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    const kx = VB_W / 100
    const ky = VB_H / 100
    const lx = at?.lx ?? c(x + (x < 50 ? -18 : 18), 16, 84)
    let ly = c(y + (y < 50 ? 26 : -24), 10, 90)
    for (const p of prev) if (Math.abs(p.lxn - lx) < 34 && Math.abs(p.lyn - ly) < 18) ly = c(p.lyn + (p.lyn < 50 ? 20 : -20), 10, 90)
    if (at?.ly !== undefined) ly = at.ly
    const X = x * kx,
        Y = y * ky,
        LX = lx * kx,
        LY = ly * ky
    const dx = X - LX,
        dy = Y - LY,
        len = Math.hypot(dx, dy) || 1,
        ux = dx / len,
        uy = dy / len
    const ex = X - ux * 8,
        ey = Y - uy * 6,
        sx = LX + ux * 10,
        sy = LY + uy * 4
    const bend = (i % 2 ? -1 : 1) * len * 0.22,
        mx = (sx + ex) / 2 - uy * bend,
        my = (sy + ey) / 2 + ux * bend
    const ang = Math.atan2(ey - my, ex - mx),
        h = 4.5,
        a1 = ang + 2.6,
        a2 = ang - 2.6
    const f = (n: number) => n.toFixed(1)
    const ring = !withRing ? "" : `M${f(X - 7)} ${f(Y + 1)} C${f(X - 7.5)} ${f(Y - 5)} ${f(X + 7)} ${f(Y - 5.5)} ${f(X + 7.5)} ${f(Y)} S${f(X - 2)} ${f(Y + 6)} ${f(X - 6)} ${f(Y - 1.5)}`
    const b = i * 0.45
    return {
        d0: b + "s",
        d1: b + 0.15 + "s",
        d2: b + 0.5 + "s",
        d3: b + 0.98 + "s",
        t,
        lxn: lx,
        lyn: ly,
        lx: lx + "%",
        ly: ly + "%",
        rot: i % 2 ? 1.5 : -2,
        d: `M${f(sx)} ${f(sy)} Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`,
        head: `M${f(ex + Math.cos(a1) * h)} ${f(ey + Math.sin(a1) * h)} L${f(ex)} ${f(ey)} L${f(ex + Math.cos(a2) * h)} ${f(ey + Math.sin(a2) * h)}`,
        ring,
    }
}

function annotate(pins: TourPin[] = []) {
    const out: Anno[] = []
    pins.forEach((p, i) => out.push(anno(p.x, p.y, p.label, i, out, p.ring !== false, p)))
    return out
}

export function ProductTour({ slides, label, title = "Take the tour" }: { slides: TourSlide[]; label: string; title?: string }) {
    const [index, setIndex] = useState(0)
    const [notesOn, setNotesOn] = useState(true)
    const [reduced, setReduced] = useState(false)
    const [inView, setInView] = useState(false)

    const rootRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const swipe = useRef<number | null>(null)

    const slide = slides[index]
    const total = slides.length
    const notes = annotate(slide.pins)

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
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
        io.observe(el)
        return () => io.disconnect()
    }, [])

    // Recordings only play while the tour is on screen.
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (inView) video.play().catch(() => {})
        else video.pause()
    }, [inView, index])

    const go = (next: number) => setIndex((next + total) % total)

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

    const stepButton = (dir: -1 | 1) => (
        <button
            type="button"
            onClick={() => go(index + dir)}
            aria-label={dir < 0 ? "Previous" : "Next"}
            className="h-8 w-8 cursor-pointer rounded-full border border-[#3d3c44] bg-transparent text-[15px] text-white transition-colors outline-none hover:border-white"
        >
            {dir < 0 ? "←" : "→"}
        </button>
    )

    // Each annotation draws on in turn; with reduced motion the drawing is just there.
    const anim = (name: "cs3draw" | "cs3pop", dur: string, delay: string, ease: string) =>
        reduced ? undefined : { animation: `${name} ${dur} ${delay} ${ease} both` }

    return (
        <div
            ref={rootRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-6 rounded-[24px] bg-ink p-5 text-white outline-none sm:p-8"
        >
            <style>{KEYFRAMES}</style>

            {/* Title on the left, the screens by name on the right. */}
            <div className="flex flex-wrap items-baseline justify-between gap-6">
                <span className="text-[24px] font-medium tracking-[-0.015em]">{title}</span>
                <div className="flex flex-wrap gap-1" role="tablist" aria-label="Screens">
                    {slides.map((s, i) => {
                        const active = i === index
                        return (
                            <button
                                key={s.tab}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => go(i)}
                                className={`cursor-pointer rounded-full px-3 py-1.5 text-[13px] outline-none ${
                                    active ? "bg-white text-ink" : "bg-transparent text-[#a3a1ad]"
                                }`}
                            >
                                {s.tab}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* The screen's headline and line; Notes, then ← n / 8 →. */}
            {/* Stacked on phones, so the headline keeps the full width. */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <div aria-live="polite" className="flex max-w-[620px] min-w-0 flex-col gap-1.5">
                    <span className="text-[18px] font-medium">{slide.title}</span>
                    <span className="text-[15px] leading-[1.5] text-[#a3a1ad]">{slide.text}</span>
                </div>
                <div className="-ml-1.5 flex shrink-0 items-center gap-2 sm:ml-0">
                    <button
                        type="button"
                        onClick={() => setNotesOn((on) => !on)}
                        aria-pressed={notesOn}
                        className="mr-2 flex cursor-pointer items-center gap-2 rounded-full border-none bg-transparent py-1.5 pr-3 pl-1.5 text-[13px] text-white outline-none hover:bg-white/[0.08]"
                    >
                        <span
                            className="relative h-4 w-7 rounded-full transition-[background] duration-200"
                            style={{ background: notesOn ? INK : "#3d3c44" }}
                        >
                            <span
                                className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-[left] duration-200"
                                style={{ left: notesOn ? 14 : 2 }}
                            />
                        </span>
                        Notes
                    </button>
                    {stepButton(-1)}
                    <span className="min-w-[44px] text-center text-[13px] text-[#a3a1ad] tabular-nums">
                        {index + 1} / {total}
                    </span>
                    {stepButton(1)}
                </div>
            </div>

            {/* The screen, full width, with its notes drawn over it. */}
            <div
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                className="relative aspect-[16/10] touch-pan-y overflow-hidden rounded-[14px] bg-[#2a2930] [--lab-half:22%] sm:[--lab-half:0%]"
            >
                {slide.video && !reduced ? (
                    <video
                        key={index}
                        ref={videoRef}
                        src={slide.video}
                        poster={slide.poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-label={slide.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={index} src={slide.poster} alt={slide.alt} className="absolute inset-0 h-full w-full object-cover" />
                )}

                {notesOn && (
                    // Keyed by slide, so the drawing replays on every screen and every time Notes turns on.
                    <div key={`notes-${index}`} aria-hidden="true">
                        <svg
                            viewBox={`0 0 ${VB_W} ${VB_H}`}
                            preserveAspectRatio="none"
                            className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible"
                        >
                            {notes.map((p) => (
                                <g key={p.t} fill="none" stroke={INK} strokeWidth=".38" strokeLinecap="round" strokeLinejoin="round">
                                    {p.ring && <path d={p.ring} pathLength={1} strokeDasharray="1" style={anim("cs3draw", ".45s", p.d1, "ease-out")} />}
                                    <path d={p.d} pathLength={1} strokeDasharray="1" style={anim("cs3draw", ".5s", p.d2, "ease-in-out")} />
                                    <path d={p.head} pathLength={1} strokeDasharray="1" style={anim("cs3draw", ".2s", p.d3, "ease-out")} />
                                </g>
                            ))}
                        </svg>
                        {notes.map((p) => (
                            <span
                                key={p.t}
                                className={`pointer-events-none absolute z-[3] w-max max-w-[min(210px,44%)] rounded-[8px] px-[11px] py-[7px] text-[13px] leading-[1.35] shadow-[0_6px_18px_-8px_rgba(0,0,0,.5)] ${
                                    // Dark labels on the light UI, white ones on a dark recording.
                                    slide.dark ? "bg-white text-ink" : "bg-ink text-white"
                                }`}
                                style={{
                                    // On phones the label's centre stays clear of the edges, so it never clips.
                                    left: `clamp(var(--lab-half), ${p.lx}, calc(100% - var(--lab-half)))`,
                                    top: p.ly,
                                    transform: `translate(-50%,-50%) rotate(${p.rot}deg)`,
                                    ...anim("cs3pop", ".3s", p.d0, "cubic-bezier(.34,1.56,.64,1)"),
                                }}
                            >
                                {p.t}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
