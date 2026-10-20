"use client"

import { useRef, useState, type PointerEvent } from "react"

/*
 * The prototype library growing, as a step chart: ink line, grey grid, the
 * latest count in purple. Hovering (or arrowing through with the keyboard)
 * marks a day on the line and says which prototypes arrived then.
 *
 * Data: each prototype's first commit in the prototype-library repo. The first
 * six moved in together on 11 September from the separate repos they used to
 * live in.
 */

const ADDED: Array<{ date: string; names: string[] }> = [
    {
        date: "2026-09-11",
        names: ["Config holdout groups", "Configuration changelog", "QA resource flag", "SDK size", "Segment sync schedules", "User support inbox"],
    },
    { date: "2026-09-17", names: ["Sub-instances on the timeline"] },
    { date: "2026-09-18", names: ["Secrets on a project"] },
    { date: "2026-09-24", names: ["Instances in A/B test groups", "Player state segments"] },
    { date: "2026-09-30", names: ["In-game inbox"] },
    { date: "2026-10-02", names: ["Recurring feature schedules", "Recurring journey schedules"] },
    { date: "2026-10-09", names: ["Active project in the sidebar"] },
    { date: "2026-10-12", names: ["IAP products in app stores", "Targeting presets"] },
    { date: "2026-10-14", names: ["Aligned status states"] },
    { date: "2026-10-16", names: ["Build metadata on release details"] },
]

// Running total after each day.
const STEPS = ADDED.reduce<Array<{ date: string; names: string[]; total: number }>>((acc, step) => {
    const total = (acc.at(-1)?.total ?? 0) + step.names.length
    return [...acc, { ...step, total }]
}, [])

const W = 640
const H = 260
const L = 32
const R = 44
// Room above the top gridline for the "18" label, which used to be clipped.
const T = 28
const B = 32
const MAX = 18
const START = "2026-09-07"
const END = "2026-10-19"
const WEEKS = ["2026-09-07", "2026-09-14", "2026-09-21", "2026-09-28", "2026-10-05", "2026-10-12", "2026-10-19"]

const day = (d: string) => Date.parse(d + "T00:00:00Z") / 864e5
const x = (d: string) => L + ((day(d) - day(START)) / (day(END) - day(START))) * (W - L - R)
const y = (n: number) => T + (1 - n / MAX) * (H - T - B)
const fmt = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })

let PATH = `M${x(STEPS[0].date)} ${y(0)} V${y(STEPS[0].total)}`
STEPS.slice(1).forEach((s) => {
    PATH += ` H${x(s.date)} V${y(s.total)}`
})
PATH += ` H${x(END)}`

export function GrowthChart() {
    const svgRef = useRef<SVGSVGElement>(null)
    const [active, setActive] = useState<number | null>(null)
    const last = STEPS.length - 1
    const shown = active ?? last

    // The step whose day is closest to the pointer.
    const onMove = (e: PointerEvent<SVGSVGElement>) => {
        const svg = svgRef.current
        if (!svg) return
        const box = svg.getBoundingClientRect()
        const px = ((e.clientX - box.left) / box.width) * W
        let best = 0
        STEPS.forEach((s, i) => {
            if (Math.abs(x(s.date) - px) < Math.abs(x(STEPS[best].date) - px)) best = i
        })
        setActive(best)
    }

    const step = STEPS[shown]
    const sx = x(step.date)
    const sy = y(step.total)
    // Keep the label inside the chart near either edge.
    const anchorEnd = sx > W - 120

    return (
        <figure className="mt-8 flex max-w-[760px] flex-col gap-2.5">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="h-auto w-full touch-pan-y overflow-visible outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                role="img"
                aria-label={`Prototypes in the library grew from 6 on 11 September to ${STEPS[last].total} on 16 October. Use the arrow keys to step through the days.`}
                tabIndex={0}
                onPointerMove={onMove}
                onPointerLeave={() => setActive(null)}
                onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") setActive(Math.max(0, shown - 1))
                    else if (e.key === "ArrowRight") setActive(Math.min(last, shown + 1))
                    else return
                    e.preventDefault()
                }}
                onBlur={() => setActive(null)}
            >
                {[0, 6, 12, 18].map((n) => (
                    <g key={n}>
                        <line x1={L} x2={W - R} y1={y(n)} y2={y(n)} stroke="var(--hairline)" />
                        <text x={L - 8} y={y(n) + 4} textAnchor="end" fontSize="11" fill="var(--ink-meta)">
                            {n}
                        </text>
                    </g>
                ))}
                {WEEKS.map((w) => (
                    <text key={w} x={x(w)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--ink-meta)">
                        {fmt(w)}
                    </text>
                ))}

                <path d={PATH} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />

                {/* A wide transparent band so the whole plot area answers the pointer. */}
                <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="transparent" />

                {active !== null && (
                    <line x1={sx} x2={sx} y1={T} y2={H - B} stroke="var(--ink-meta)" strokeDasharray="2 3" strokeWidth="1" />
                )}
                <circle cx={sx} cy={sy} r="4.5" fill="var(--brand)" />
                {/*
                  At rest, the latest count sits just above its point. On hover the
                  label moves to the top of the plot, above the dashed marker, so the
                  step line can never run through it.
                */}
                {active === null ? (
                    <text x={sx - 6} y={sy - 12} textAnchor="end" fontSize="11" fontWeight="500" fill="var(--brand)">
                        {step.total}
                    </text>
                ) : (
                    <text x={sx} y={T - 12} textAnchor={anchorEnd ? "end" : sx < L + 80 ? "start" : "middle"} fontSize="11">
                        <tspan fontWeight="500" fill="var(--brand)">{step.total}</tspan>
                        <tspan fill="var(--ink-muted)">
                            {"  "}
                            {fmt(step.date)} · +{step.names.length}
                        </tspan>
                    </text>
                )}
            </svg>
            {/* One line under the chart: the caption, or on hover what arrived that day (announced). */}
            <figcaption aria-live="polite" className="text-[13px] leading-[1.5] text-ink-meta">
                {active !== null ? (
                    <span className="text-ink">{step.names.join(", ")}</span>
                ) : (
                    <>
                        <span className="text-ink [counter-increment:fig] before:content-['Fig._'_counter(fig)]" /> — Prototypes in
                        the library, from its git history. Hover the line for each day.
                    </>
                )}
            </figcaption>
        </figure>
    )
}
