"use client"

import { useEffect, useReducer, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Tabs } from "@/components/work/liveops/illustrations"
import "./travel.css"
import { figCaption } from "@/components/work/caption"

/*
 * The Travel planning illustrations: one trip over 34 days, the three stages
 * as a route to fly, low-fidelity wireframes of the first two stages, and the
 * third stage picking up where each visit left off. Drawn in HTML so they stay
 * sharp and can move.
 */

const purple = "#4f35b8"
const ease = "cubic-bezier(.2,0,0,1)"

function Caption({ children, dark }: { children: ReactNode; dark?: boolean }) {
    return (
        <figcaption className={figCaption}>
            <span className={dark ? "text-white" : "text-ink"}>Illustration</span> — {children}
        </figcaption>
    )
}

function SearchIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path
                d="M10.4 10.4 13.5 13.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    )
}

/* ------------------------------------------------------------------ */
/* One trip, 34 days                                                   */
/* ------------------------------------------------------------------ */

const visitDays = [1, 3, 8, 12, 17, 21, 26, 30, 34]

/** Nine searches over 34 days: today each one starts over, with the framework each picks up the last. */
export function TripTimeline({ caption, dark }: { caption: ReactNode; dark?: boolean }) {
    const [mode, setMode] = useState(0)
    const fw = mode === 1
    return (
        <figure className="tp-anim m-0 flex flex-col gap-3">
            <div className="flex flex-col gap-3.5 rounded-[14px] bg-[#f1f2f4] px-[clamp(14px,4vw,48px)] py-[clamp(16px,2.4vw,32px)]">
                {/* One line even on a small phone: tighter tabs there rather than wrapping. */}
                <Tabs
                    labels={["Search today", "With the framework"]}
                    value={mode}
                    onChange={setMode}
                    className="self-start !flex-nowrap bg-white max-[400px]:[&>button]:px-2.5 [&>button]:whitespace-nowrap"
                />
                <div className="relative grid grid-cols-9 gap-[clamp(4px,1vw,12px)]">
                    <div
                        aria-hidden
                        className="absolute top-[18px] right-[5%] left-[5%] h-0.5 origin-left rounded-sm"
                        style={{
                            background: purple,
                            transform: `scaleX(${fw ? 1 : 0})`,
                            transition: `transform .7s ${ease}`,
                        }}
                    />
                    {visitDays.map((day, i) => {
                        const delay = fw ? `${i * 0.07}s` : "0s"
                        return (
                            <div
                                key={day}
                                className="relative flex min-w-0 flex-col items-center gap-2"
                            >
                                <div
                                    className="flex h-9 w-full items-center justify-center rounded-full shadow-[0_1px_2px_rgba(22,21,26,.06)]"
                                    style={{
                                        background: fw ? purple : "#fff",
                                        transition: `background .3s ${delay}`,
                                    }}
                                >
                                    <span
                                        className="flex"
                                        style={{
                                            color: fw ? "#fff" : "#a3a1ad",
                                            transition: `color .3s ${delay}`,
                                        }}
                                    >
                                        {fw && i > 0 ? (
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                aria-hidden
                                            >
                                                <path
                                                    d="M13 8a5 5 0 1 1-1.6-3.7"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                />
                                                <path
                                                    d="M12 1.8v3h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        ) : (
                                            <SearchIcon />
                                        )}
                                    </span>
                                </div>
                                {/* Nine labels don't fit a phone as "Day N": there it's the number, and "Day" once. */}
                                <span className="text-[13px] whitespace-nowrap text-ink-meta">
                                    {i === 0 ? "Day " : <span className="hidden sm:inline">Day </span>}
                                    {day}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <span className="text-[13px] text-ink-muted">
                    {fw
                        ? "With the framework: each visit picks up where you left off."
                        : "Search today: every visit starts from zero."}
                </span>
            </div>
            <Caption dark={dark}>{caption}</Caption>
        </figure>
    )
}

/* ------------------------------------------------------------------ */
/* The three stages, as a route to fly                                 */
/* ------------------------------------------------------------------ */

const route =
    "M40 300 C120 300 120 250 180 250 S 380 130 500 130 S 700 250 820 250 S 930 190 970 150"
// Where each stop sits along the route, from 0 to 1.
const stopAt = [0.146, 0.479, 0.813]
const stops = [
    {
        x: "18%",
        y: "62.5%",
        t: "Get inspired",
        bg: "#eaf6f8",
        fg: "#12a0ad",
        q: "I’m looking for some travel ideas",
        up: true,
    },
    {
        x: "50%",
        y: "32.5%",
        t: "Look into alternatives",
        bg: "#efedfd",
        fg: "#6a5bb5",
        q: "I have a destination in mind, but I’m curious if there are other better options",
        up: false,
    },
    {
        x: "82%",
        y: "62.5%",
        t: "Rediscover the journey",
        bg: "#e6f4e1",
        fg: "#4e9a3a",
        q: "I want to pick up where I left off and resume my trip planning",
        up: true,
    },
]

type Flight = {
    t: number
    drag: boolean
    target: number | null
    reached: number
    auto: boolean
    paused: boolean
    at: number
    // The current hop: target, start point, start time, duration, progress when paused.
    ft: number | null
    f0: number
    fs: number
    fd: number
    pu: number
    alt: number
    ang: number | null
    bank: number
    px: number
    py: number
    samples: [number, number][] | null
}

const fresh = (): Flight => ({
    t: 0,
    drag: false,
    target: null,
    reached: 0,
    auto: false,
    paused: false,
    at: 0,
    ft: null,
    f0: 0,
    fs: 0,
    fd: 0,
    pu: 0,
    alt: 0,
    ang: null,
    bank: 0,
    px: 40,
    py: 300,
    samples: null,
})

/**
 * Drag the plane (or autoplay it) along the route through the three stages.
 * It can't skip ahead: each stop has to be reached before the next opens.
 */
export function StagesFlight({ caption }: { caption: ReactNode }) {
    const box = useRef<HTMLDivElement>(null)
    const path = useRef<SVGPathElement>(null)
    const flight = useRef<Flight>(fresh())
    const [, render] = useReducer((n: number) => n + 1, 0)

    useEffect(() => {
        const P = flight.current
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let raf = 0
        let visible = false
        let last = ""

        const reach = () => {
            while (P.reached < 3 && P.t >= stopAt[P.reached] - 0.02) P.reached++
        }

        const tick = () => {
            raf = 0
            const now = performance.now()
            // Autoplay: wait a beat at each stop, then fly to the next.
            if (P.auto && !P.paused && P.target == null) {
                if (!P.at) P.at = now
                if (now - P.at > 1100) {
                    const next = [...stopAt, 1].find((f) => f > P.t + 0.01)
                    if (next == null) P.auto = false
                    else {
                        P.target = next
                        P.at = 0
                    }
                }
            }
            if (P.target != null && !P.paused) {
                if (P.ft !== P.target) {
                    P.ft = P.target
                    P.f0 = P.t
                    P.fs = now
                    P.fd = reduce ? 0 : Math.max(700, Math.abs(P.target - P.t) * 4200)
                }
                const u = P.fd ? Math.min(1, (now - P.fs) / P.fd) : 1
                const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2
                P.t = P.f0 + (P.target - P.f0) * e
                P.alt = Math.sin(u * Math.PI)
                if (u >= 1) {
                    P.target = null
                    P.ft = null
                    P.alt = 0
                }
                reach()
            }
            const el = path.current
            if (el) {
                const L = el.getTotalLength()
                const t = Math.min(0.996, Math.max(0, P.t))
                const p1 = el.getPointAtLength(L * t)
                const p2 = el.getPointAtLength(L * Math.min(1, t + 0.006))
                const want = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
                if (P.ang == null) P.ang = want
                const d = ((want - P.ang + 540) % 360) - 180
                // Turn gently into the curve, and lean while turning.
                P.ang += d * 0.14
                P.bank = P.bank * 0.85 + Math.max(-1, Math.min(1, d / 12)) * 0.15
                P.px = p1.x
                P.py = p1.y
            }
            if (P.target == null && !P.drag) P.alt *= 0.9
            if (P.drag) P.alt = P.alt * 0.9 + 0.06
            // Only re-render when something on screen moved.
            const sig =
                [P.t, P.px, P.py, P.ang ?? 0, P.alt, P.bank].map((v) => v.toFixed(2)).join() +
                P.reached
            if (sig !== last) {
                last = sig
                render()
            }
            if (visible) raf = requestAnimationFrame(tick)
        }

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (visible && !raf) raf = requestAnimationFrame(tick)
        })
        if (box.current) observer.observe(box.current)
        return () => {
            observer.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [])

    const P = flight.current

    // Move the plane to the point on the route nearest the pointer, but never past the next unreached stop.
    const follow = (e: React.PointerEvent) => {
        const el = path.current
        const rect = box.current?.getBoundingClientRect()
        if (!el || !rect) return
        if (!P.samples) {
            const L = el.getTotalLength()
            P.samples = Array.from({ length: 241 }, (_, i) => {
                const q = el.getPointAtLength((L * i) / 240)
                return [q.x, q.y] as [number, number]
            })
        }
        const x = ((e.clientX - rect.left) / rect.width) * 1000
        const y = ((e.clientY - rect.top) / rect.height) * 400
        let best = 0
        let bestD = Infinity
        P.samples.forEach(([sx, sy], i) => {
            const d = (sx - x) ** 2 + (sy - y) ** 2
            if (d < bestD) {
                bestD = d
                best = i
            }
        })
        const cap = P.reached < 3 ? stopAt[P.reached] + 0.01 : 1
        P.t = Math.min(cap, Math.max(P.t - 0.02, best / 240))
        while (P.reached < 3 && P.t >= stopAt[P.reached] - 0.02) P.reached++
        render()
    }

    const done = P.t > 0.985
    const idle = !(P.t > 0.02 || P.auto)
    const sc = 1 + P.alt * 0.22
    const ang = P.ang ?? 0
    const btn = "cursor-pointer rounded-full px-3.5 py-1.5 text-[13px]"

    return (
        <figure className="tp-anim m-0 flex flex-col gap-3">
            {/* On a phone the controls sit under the route; from md they float over its corner. */}
            <div className="relative flex flex-col gap-3">
                <div
                    ref={box}
                    onPointerDown={(e) => {
                        if (done) return
                        Object.assign(P, { auto: false, paused: false, target: null, drag: true })
                        try {
                            e.currentTarget.setPointerCapture(e.pointerId)
                        } catch {}
                        follow(e)
                    }}
                    onPointerMove={(e) => P.drag && follow(e)}
                    onPointerUp={() => {
                        P.drag = false
                        render()
                    }}
                    onPointerLeave={() => {
                        P.drag = false
                        render()
                    }}
                    className="relative aspect-[1000/400] w-full touch-none overflow-hidden rounded-[14px] bg-[#f4f4f4] select-none"
                    style={{ cursor: P.drag ? "grabbing" : "grab" }}
                >
                    <svg
                        aria-hidden
                        viewBox="0 0 1000 400"
                        className="absolute inset-0 block h-full w-full"
                    >
                        <defs>
                            <linearGradient id="tpGrad" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0" stopColor="#12a0ad" />
                                <stop offset=".5" stopColor="#6a5bb5" />
                                <stop offset="1" stopColor="#4e9a3a" />
                            </linearGradient>
                        </defs>
                        <path
                            ref={path}
                            d={route}
                            fill="none"
                            stroke="#c9c8d0"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray="6 7"
                        />
                        <path
                            d={route}
                            fill="none"
                            stroke="url(#tpGrad)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            pathLength={1}
                            strokeDasharray="1 1"
                            strokeDashoffset={(1 - P.t).toFixed(4)}
                        />
                        <circle
                            cx="40"
                            cy="300"
                            r="4"
                            fill="#fff"
                            stroke="#16151a"
                            strokeWidth="1.5"
                        />
                        <circle cx="970" cy="150" r="4" fill="#16151a" />
                        <g transform={`translate(${P.px.toFixed(1)},${P.py.toFixed(1)})`}>
                            <circle r="24" fill="transparent" />
                            <g
                                transform={`rotate(${ang.toFixed(1)}) scale(${sc.toFixed(3)},${(sc * (1 - Math.abs(P.bank) * 0.35)).toFixed(3)})`}
                            >
                                <g transform="rotate(90) scale(1.35) translate(-12,-12)">
                                    <path
                                        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                                        fill="#16151a"
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>

                    {stops.map((o, i) => {
                        const on = !done && Math.abs(P.t - stopAt[i]) < 0.05
                        const gap = "clamp(22px,2.4vw,30px)"
                        return (
                            <div
                                key={o.t}
                                className="absolute h-0 w-0"
                                style={{ left: o.x, top: o.y }}
                            >
                                <span
                                    className="absolute -top-2.5 -left-2.5 h-5 w-5 rounded-full"
                                    style={{
                                        background: o.fg,
                                        opacity: on ? 0 : 0.5,
                                        transform: `scale(${on ? 2.6 : 0.6})`,
                                        transition: "transform .6s ease-out, opacity .6s ease-out",
                                    }}
                                />
                                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
                                    <button
                                        type="button"
                                        onPointerDown={(e) => {
                                            e.stopPropagation()
                                            if (i <= P.reached) {
                                                P.target = stopAt[i]
                                                render()
                                            }
                                        }}
                                        className="max-w-[104px] cursor-pointer rounded-full px-2.5 py-1.5 text-center text-[11px] leading-[1.2] font-medium md:max-w-none md:px-[18px] md:py-2.5 md:text-[clamp(13px,1.6vw,20px)] md:whitespace-nowrap"
                                        style={{
                                            background: o.bg,
                                            color: o.fg,
                                            boxShadow: `0 0 0 ${on ? "1px" : "0px"} ${o.fg}59`,
                                            transform: `scale(${on ? 1.08 : 1})`,
                                            transition:
                                                "box-shadow .35s ease-out, transform .35s cubic-bezier(.34,1.56,.64,1)",
                                        }}
                                    >
                                        {o.t}
                                    </button>
                                </div>
                                <div
                                    className="pointer-events-none absolute left-0 w-[clamp(150px,24vw,260px)] -translate-x-1/2"
                                    style={o.up ? { bottom: gap } : { top: gap }}
                                >
                                    <div
                                        className="rounded-xl bg-white px-3.5 py-2.5 text-center text-[clamp(12px,1.3vw,15px)] leading-[1.4] text-balance italic shadow-[0_8px_24px_-10px_rgba(22,21,26,.3),0_0_0_1px_rgba(22,21,26,.05)]"
                                        style={{
                                            opacity: on ? 1 : 0,
                                            transform: on
                                                ? "none"
                                                : `translateY(${o.up ? 8 : -8}px) scale(.94)`,
                                            transition:
                                                "opacity .3s ease-out, transform .3s ease-out",
                                        }}
                                    >
                                        “{o.q}”
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {done && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[3px]">
                            <div className="flex max-w-[360px] flex-col items-start gap-2.5 rounded-2xl bg-white px-7 py-6 shadow-[0_18px_50px_-14px_rgba(22,21,26,.3)]">
                                <span className="text-[clamp(20px,2vw,24px)] leading-[1.2] font-medium tracking-[-0.02em]">
                                    Trip planned.
                                </span>
                                <span className="text-[15px] leading-[1.45] text-ink-muted">
                                    Inspired, compared and picked up again, without starting from
                                    zero.
                                </span>
                                <button
                                    type="button"
                                    onPointerDown={(e) => {
                                        e.stopPropagation()
                                        Object.assign(P, fresh(), {
                                            px: P.px,
                                            py: P.py,
                                            ang: P.ang,
                                        })
                                        render()
                                    }}
                                    className="mt-1.5 cursor-pointer rounded-full bg-ink px-4 py-2 text-[14px] text-white"
                                >
                                    ↻ Plan another trip
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2.5 text-[13px] text-ink-meta md:absolute md:bottom-3 md:left-4">
                    {idle ? (
                        <>
                            <button
                                type="button"
                                onPointerDown={(e) => {
                                    e.stopPropagation()
                                    Object.assign(P, {
                                        t: 0,
                                        drag: false,
                                        target: null,
                                        reached: 0,
                                        auto: true,
                                        paused: false,
                                        at: performance.now() - 800,
                                    })
                                    render()
                                }}
                                className={`${btn} bg-ink text-white transition-colors hover:bg-brand`}
                            >
                                ▶ Autoplay
                            </button>
                            <span>or drag the plane</span>
                        </>
                    ) : P.auto && !done ? (
                        <button
                            type="button"
                            onPointerDown={(e) => {
                                e.stopPropagation()
                                if (P.paused) {
                                    P.paused = false
                                    if (P.ft != null) P.fs = performance.now() - P.pu * P.fd
                                    P.at = 0
                                } else {
                                    P.paused = true
                                    P.pu =
                                        P.ft != null && P.fd ? (performance.now() - P.fs) / P.fd : 0
                                }
                                render()
                            }}
                            className={`${btn} border border-hairline bg-white text-ink hover:border-ink`}
                        >
                            {P.paused ? "▶ Resume" : "❚❚ Pause"}
                        </button>
                    ) : !done ? (
                        <span>Keep dragging</span>
                    ) : null}
                </div>
            </div>
            <Caption>{caption}</Caption>
        </figure>
    )
}

/* ------------------------------------------------------------------ */
/* Low-fidelity wireframes of stages I and II                          */
/* ------------------------------------------------------------------ */

const Bone = ({ w = "100%" }: { w?: string }) => (
    <span className="block h-3.5 rounded-md bg-[#efeff1]" style={{ width: w }} />
)

/** The top of a Google results page on a phone: menu, logo, avatar, search box and filter chips. */
function PhoneTop({ query }: { query: string }) {
    return (
        <div className="flex h-[150px] flex-col justify-between border-b border-[#e4e3e8] pt-1 pb-2.5">
            <div className="flex items-center justify-between">
                <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
                    <path
                        d="M1 1h14M1 6h14M1 11h14"
                        stroke="#5f6368"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </svg>
                <span className="text-[22px] leading-none font-medium tracking-[-0.02em]">
                    {(
                        [
                            ["G", "#4285f4"],
                            ["o", "#ea4335"],
                            ["o", "#fbbc05"],
                            ["g", "#4285f4"],
                            ["l", "#34a853"],
                            ["e", "#ea4335"],
                        ] as const
                    ).map(([ch, c], i) => (
                        <span key={i} style={{ color: c }}>
                            {ch}
                        </span>
                    ))}
                </span>
                <span className="h-6 w-6 rounded-full bg-[linear-gradient(135deg,#c9a38a,#6b4a3a)] shadow-[0_0_0_2px_#fff,0_0_0_3px_#34a853]" />
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[13px] leading-[1.2] text-ink shadow-[0_1px_4px_rgba(22,21,26,.16)]">
                <span className="text-[#5f6368]">
                    <SearchIcon size={12} />
                </span>
                <span className="flex-1">{query}</span>
                <span className="text-[#5f6368]">✕</span>
            </div>
            <div className="flex gap-1.5 overflow-hidden">
                {["Images", "Cheap", "Underrated", "Best", "Holiday"].map((chip) => (
                    <span
                        key={chip}
                        className="flex-none rounded-full border border-[#dadce0] px-2.5 py-[5px] text-[11px] leading-[1.2]"
                    >
                        {chip}
                    </span>
                ))}
            </div>
        </div>
    )
}

const tileColors = {
    video: ["#fce3f7", "#c79bbf"],
    photo: ["#e4e9fb", "#9aa3c2"],
    gif: ["#e2f8e7", "#93bb9c"],
    map: ["#fdf7e3", "#c4b88f"],
} as const

function Tile({
    kind,
    label,
    tag,
    style,
}: {
    kind: keyof typeof tileColors
    label: string
    tag?: boolean
    style?: CSSProperties
}) {
    const [bg, fg] = tileColors[kind]
    return (
        <div
            className="relative flex min-h-0 items-center justify-center rounded-[10px] text-[13px] leading-[1.2]"
            style={{ background: bg, color: fg, ...style }}
        >
            {label}
            {tag && (
                <span className="absolute right-1.5 bottom-1.5 rounded-full bg-white px-1.5 py-0.5 text-[8px] leading-[1.2] text-ink-muted">
                    Category
                </span>
            )}
        </div>
    )
}

/** A note beside the phone, with a rule marking the part of the screen it's about. */
type Note = { text: ReactNode; top: number }
type Rule = { top: number; height: number }

function Notes({
    side,
    height,
    rules,
    notes,
}: {
    side: "left" | "right"
    height: number
    rules: Rule[]
    notes: Note[]
}) {
    const left = side === "left"
    return (
        <div className="relative hidden md:block" style={{ height }}>
            {rules.map((r) => (
                <span
                    key={r.top}
                    className="absolute w-px bg-ink"
                    style={{ top: r.top, height: r.height, [left ? "right" : "left"]: 0 }}
                />
            ))}
            {notes.map((n) => (
                <span
                    key={n.top}
                    className={`absolute -translate-y-1/2 text-[15px] leading-[1.45] text-balance ${left ? "right-5 w-full text-right" : "left-5 w-[calc(100%-20px)]"}`}
                    style={{ top: n.top }}
                >
                    {n.text}
                </span>
            ))}
        </div>
    )
}

function Wireframe({
    height,
    frame,
    left,
    right,
    children,
}: {
    height: number
    frame: number
    left: ReactNode
    right: ReactNode
    children: ReactNode
}) {
    return (
        <div className="grid items-start justify-center gap-[clamp(20px,3vw,40px)] overflow-hidden rounded-[14px] bg-[#f4f4f4] px-[clamp(16px,3vw,40px)] py-[clamp(28px,4vw,56px)] md:grid-cols-[minmax(0,1fr)_230px_minmax(0,1fr)]">
            {left}
            <div className="relative w-[230px]" style={{ height }}>
                <div
                    aria-hidden
                    className="absolute -top-3.5 -right-3 -left-3 rounded-[40px] border-[3px] border-ink bg-white"
                    style={{ height: frame }}
                />
                <div className="relative flex flex-col">{children}</div>
            </div>
            {right}
        </div>
    )
}

/** Stage I, Get inspired: a visual results page of videos, photos, GIFs and a map. */
export function InspireWireframe({ caption }: { caption: ReactNode }) {
    const row4 = { gridTemplateRows: "repeat(4,40px)" }
    return (
        <figure className="m-0 flex flex-col gap-3">
            <Wireframe
                height={870}
                frame={550}
                left={
                    <Notes
                        side="left"
                        height={870}
                        rules={[{ top: 184, height: 431 }]}
                        notes={[
                            {
                                top: 260,
                                text: "Rich and diverse content types: images, slideshows, GIFs",
                            },
                            { top: 400, text: "Algorithmically curated places" },
                            {
                                top: 540,
                                text: "Content sourced from TikTok, YouTube and Instagram Reels",
                            },
                        ]}
                    />
                }
                right={
                    <Notes
                        side="right"
                        height={870}
                        rules={[
                            { top: 184, height: 181 },
                            { top: 434, height: 181 },
                        ]}
                        notes={[
                            {
                                top: 275,
                                text: "Category tagging for easy comparison and filtering",
                            },
                            { top: 525, text: "Interactive, expandable map" },
                        ]}
                    />
                }
            >
                <PhoneTop query="weekend getaway" />
                <div className="flex h-[34px] items-center text-[15px] leading-[1.2] font-medium">
                    Title
                </div>
                <div className="flex flex-col gap-[7px]">
                    <div className="grid grid-cols-[1.45fr_1fr] gap-[7px]" style={row4}>
                        <Tile kind="video" label="Video" style={{ gridRow: "span 4" }} />
                        <Tile kind="photo" label="Photo" tag style={{ gridRow: "span 2" }} />
                        <Tile kind="photo" label="Photo" tag style={{ gridRow: "span 2" }} />
                    </div>
                    <div className="grid h-[55px] grid-cols-[.6fr_1.85fr] gap-[7px]">
                        <Tile kind="photo" label="Photo" />
                        <Tile kind="gif" label="GIF / Slideshow" />
                    </div>
                    <div className="grid grid-cols-[1fr_1.45fr] gap-[7px]" style={row4}>
                        <Tile kind="photo" label="Photo" style={{ gridRow: "span 2" }} />
                        <Tile
                            kind="map"
                            label="Map"
                            style={{ gridColumn: 2, gridRow: "1 / span 4" }}
                        />
                        <Tile
                            kind="photo"
                            label="Photo"
                            style={{ gridColumn: 1, gridRow: "span 2" }}
                        />
                    </div>
                    <div className="grid h-[55px] grid-cols-[1.85fr_.6fr] gap-[7px]">
                        <Tile kind="gif" label="GIF / Slideshow" />
                        <Tile kind="photo" label="Photo" />
                    </div>
                    <div className="grid grid-cols-[1fr_1.45fr] gap-[7px]" style={row4}>
                        <Tile kind="photo" label="Photo" style={{ gridRow: "span 2" }} />
                        <Tile
                            kind="video"
                            label="Video"
                            style={{ gridColumn: 2, gridRow: "1 / span 4" }}
                        />
                        <Tile
                            kind="photo"
                            label="Photo"
                            style={{ gridColumn: 1, gridRow: "span 2" }}
                        />
                    </div>
                </div>
            </Wireframe>
            <Caption>{caption}</Caption>
        </figure>
    )
}

const priceBars = [30, 52, 66, 70, 56, 66, 48, 48, 48, 56, 48, 56, 56, 48, 48]

/** Stage II, Look into alternatives: flight prices with suggestions to compare. */
export function AlternativesWireframe({ caption }: { caption: ReactNode }) {
    const city =
        "flex items-center justify-center rounded-[10px] bg-[#efeafd] text-[13px] leading-[1.2] text-[#a49cc4]"
    return (
        <figure className="m-0 flex flex-col gap-3">
            <Wireframe
                height={700}
                frame={550}
                left={
                    <Notes
                        side="left"
                        height={700}
                        rules={[{ top: 498, height: 188 }]}
                        notes={[
                            { top: 592, text: "Suggestions based on price and search history" },
                        ]}
                    />
                }
                right={
                    <Notes
                        side="right"
                        height={700}
                        rules={[{ top: 498, height: 202 }]}
                        notes={[
                            {
                                top: 600,
                                text: (
                                    <>
                                        Sustainable suggestions to travel nearby
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 16 16"
                                            aria-hidden
                                            className="ml-1 inline-block align-[-2px]"
                                        >
                                            <path
                                                d="M14 2C7 2 3 5 3 10c0 1.4.4 2.6 1 3.5C5 9 8 6.5 12 5c-3.2 2-5.6 4.8-6.8 9 .8.4 1.6.6 2.6.6C12 14.6 14 10 14 2Z"
                                                fill="#4e9a3a"
                                            />
                                        </svg>
                                    </>
                                ),
                            },
                        ]}
                    />
                }
            >
                <PhoneTop query="flights to $city" />
                <div className="flex h-[34px] items-center text-[15px] leading-[1.2] font-medium">
                    Flights to $city
                </div>
                <div className="flex flex-col gap-1.5 pt-3">
                    <Bone />
                    <Bone />
                    <div className="flex gap-3">
                        <Bone w="45%" />
                        <Bone w="55%" />
                    </div>
                </div>
                <div className="mx-[-6px] mt-3 flex h-[60px] items-end gap-[3px]">
                    {priceBars.map((h, i) => (
                        <span
                            key={i}
                            className="flex-1 rounded-t-[3px]"
                            style={{ height: h, background: i === 8 ? "#a9a9ad" : "#efeff1" }}
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-2 pt-3.5">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="flex h-[30px] items-center gap-3">
                            <span className="h-[30px] w-[30px] flex-none rounded-full bg-[#efeff1]" />
                            <Bone w="22%" />
                            <Bone w="22%" />
                            <Bone w="34%" />
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex h-7 items-center text-[15px] leading-[1.2] font-medium">
                    Suggestions
                </div>
                <div className="mt-2 grid grid-cols-2 grid-rows-[66px_66px] gap-2">
                    <div className={`${city} row-span-2`}>City A</div>
                    <div className={city}>City B</div>
                    <div className={city}>City C</div>
                </div>
                <div className="mt-3 flex h-9 items-center justify-center rounded-full bg-[#d9cffb] text-[13px] leading-[1.2] text-[#8f84b8]">
                    More to compare
                </div>
            </Wireframe>
            <Caption>{caption}</Caption>
        </figure>
    )
}

/* ------------------------------------------------------------------ */
/* Stage III: each visit picks up where the last left off              */
/* ------------------------------------------------------------------ */

const visits = [
    {
        d: 1,
        e: "◎",
        t: "Things to do you looked at",
        s: "Camden Market, Harry Potter Studio Tour",
        ic: "#eaf6f8",
    },
    {
        d: 8,
        e: "▦",
        t: "Your dates, remembered",
        s: "Search results from Aug 20–30",
        ic: "#efedfd",
    },
    {
        d: 17,
        e: "⌂",
        t: "Hotels, flights and restaurants",
        s: "Picked up from your past searches",
        ic: "#fdf7e3",
    },
    {
        d: 26,
        e: "★",
        t: "Suggested from your searches",
        s: "100 years of Disney · tickets selling fast",
        ic: "#fdecea",
    },
    {
        d: 34,
        e: "↻",
        t: "Continue exploring London",
        s: "13 new things to do since your last visit",
        ic: "#16151a",
    },
]

const chipNames = ["Things to do", "Dates", "Hotels", "Events"]

// Per visit: the strongest pick's colour, the others' colour, the ink, and three picks.
const tileSets: [string, string, string, string[]][] = [
    ["#d8f1f4", "#e9f7f9", "#0f7f8a", ["Camden Market", "Tower Bridge", "Borough Market"]],
    ["#dcd7fb", "#eeebfd", "#4a3c99", ["Aug 20 · CHF 89", "Aug 22 · CHF 120", "Aug 25 · CHF 140"]],
    ["#fbefc4", "#fdf7e3", "#8a6a12", ["Hotel near Camden", "Soho hotel", "King’s Cross stay"]],
    ["#fbd9d3", "#fdecea", "#a3392a", ["100 years of Disney", "West End show", "Sky Garden"]],
    ["#c8f0bc", "#e6f5e0", "#2f6b22", ["Harry Potter Studio Tour", "Camden Market", "Hotels map"]],
]

/** Five visits to the same trip. It steps through them on its own until you pick a day. */
export function ResumeJourney({ caption }: { caption: ReactNode }) {
    const [k, setK] = useState(0)
    const [picked, setPicked] = useState(false)

    useEffect(() => {
        if (picked || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const id = setInterval(() => setK((v) => (v + 1) % visits.length), 2600)
        return () => clearInterval(id)
    }, [picked])

    const cur = visits[k]
    const last = k === visits.length - 1
    const [strong, weak, ink, picks] = tileSets[k]
    const up = `tpUp .45s ${ease} both`

    return (
        <figure className="tp-anim m-0 flex flex-col gap-3">
            <div className="flex flex-col items-center gap-7 rounded-[14px] bg-[#f4f4f4] p-[clamp(20px,4vw,48px)]">
                <div className="relative grid w-[min(100%,440px)] grid-cols-5 gap-2">
                    <div
                        aria-hidden
                        className="absolute top-[15px] right-[10%] left-[10%] h-0.5 rounded-sm bg-[#dcdde2]"
                    />
                    <div
                        aria-hidden
                        className="absolute top-[15px] left-[10%] h-0.5 w-[80%] origin-left rounded-sm"
                        style={{
                            background: purple,
                            transform: `scaleX(${k / 4})`,
                            transition: `transform .5s ${ease}`,
                        }}
                    />
                    {visits.map((v, i) => (
                        <button
                            key={v.d}
                            type="button"
                            aria-pressed={i === k}
                            aria-label={`Day ${v.d}`}
                            onClick={() => {
                                setK(i)
                                setPicked(true)
                            }}
                            className="relative flex cursor-pointer flex-col items-center gap-2"
                        >
                            <span
                                className="h-8 w-8 rounded-full"
                                style={{
                                    background: i <= k ? purple : "#fff",
                                    boxShadow: `0 0 0 ${i === k ? "6px" : "0px"} rgba(79,53,184,.18)`,
                                    transition: "background .3s, box-shadow .3s",
                                }}
                            />
                            <span
                                className={`text-[13px] whitespace-nowrap ${i === k ? "text-ink" : "text-ink-meta"}`}
                            >
                                Day {v.d}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex w-[min(100%,360px)] flex-col gap-3.5 rounded-[20px] bg-white p-[18px] shadow-[0_1px_2px_rgba(22,21,26,.06),0_18px_40px_-20px_rgba(22,21,26,.25)]">
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-[18px] leading-[1.2] font-medium">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                aria-hidden
                                className="block"
                            >
                                <path
                                    d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9"
                                    fill="none"
                                    stroke="#16151a"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M2 2.5v3h3"
                                    fill="none"
                                    stroke="#16151a"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 5v3.2l2 1.3"
                                    fill="none"
                                    stroke="#16151a"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />
                            </svg>
                            London
                        </span>
                        <span className="text-[12px] leading-[1.45] text-ink-muted">
                            Suggested based on previous search
                        </span>
                    </div>
                    <div className="flex min-h-[26px] flex-wrap gap-1.5">
                        {chipNames.slice(0, k).map((chip) => (
                            <span
                                key={chip}
                                className="rounded-full bg-[#f1f2f4] px-2.5 py-1 text-[12px] leading-[1.45] text-ink-muted"
                            >
                                {chip}
                            </span>
                        ))}
                    </div>
                    <div
                        key={`row-${k}`}
                        className="flex items-center gap-3 rounded-xl bg-[#f4f2ff] p-3"
                        style={{ animation: up }}
                    >
                        <span
                            className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] text-[16px] leading-none"
                            style={{ background: cur.ic, color: last ? "#fff" : "#16151a" }}
                        >
                            {cur.e}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="text-[15px] leading-[1.3] font-medium">{cur.t}</span>
                            <span
                                className="text-[13px] leading-[1.3]"
                                style={{ color: last ? purple : "#6f6d78" }}
                            >
                                {cur.s}
                            </span>
                        </span>
                    </div>
                    <div className="grid grid-cols-[1.3fr_1fr] grid-rows-[58px_58px] gap-1.5">
                        {picks.map((t, i) => (
                            <div
                                key={`${k}-${t}`}
                                className="flex min-w-0 flex-col justify-between rounded-[10px] px-2.5 py-2"
                                style={{
                                    gridRow: i === 0 ? "1 / span 2" : "auto",
                                    background: i === 0 ? strong : weak,
                                    color: ink,
                                    animation: up,
                                    animationDelay: `${i * 0.08}s`,
                                }}
                            >
                                <span className="self-start rounded-full bg-white/75 px-1.5 py-0.5 text-[10px] leading-[1.3]">
                                    {i === 0 ? "High engaging" : "Low engaging"}
                                </span>
                                <span
                                    className={`overflow-hidden text-[12px] leading-[1.3] text-ellipsis ${i === 0 ? "font-medium" : ""}`}
                                >
                                    {t}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Caption>{caption}</Caption>
        </figure>
    )
}
