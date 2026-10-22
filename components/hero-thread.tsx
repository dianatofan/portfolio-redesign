"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { YarnCat } from "./yarn-cat"

/*
 * The pull-the-thread line under the hero headline, ported from
 * `Hero Thread.dc.html`. A loose purple thread runs from the left edge into the
 * yarn ball the cat is holding. Moving the pointer across slides a "cut" point
 * along it: everything left of the cut lies straight, everything right of it
 * stays loopy, and the ball winds down a little as more is pulled.
 *
 * The path is rebuilt every frame and written straight to the DOM; React only
 * re-renders when the whole-number percentage changes.
 */

const H = 150
const Y0 = 70
const SAMPLES = 700

export function HeroThread() {
    const rootRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const midRef = useRef<SVGPathElement>(null)
    const frontRef = useRef<SVGPathElement>(null)
    const frayRef = useRef<SVGPathElement>(null)
    const catSvgRef = useRef<SVGSVGElement>(null)
    const pointer = useRef({ x: 0, on: false })

    const [pct, setPct] = useState(0)
    const [used, setUsed] = useState(false)
    const [mobile, setMobile] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 719.98px)")
        const onChange = () => setMobile(mq.matches)
        onChange()
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [])

    useEffect(() => {
        const sv = svgRef.current
        const root = rootRef.current
        if (!sv || !root) return
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

        let cut = 0,
            cv = 0,
            lastPct = -1,
            raf = 0,
            visible = true

        const draw = (t: number) => {
            const W = sv.clientWidth || 1000
            let endX = W - 60,
                endY = 70

            // End the thread exactly where it enters the ball: point (150, 492)
            // in the cat's own 800×800 drawing, mapped onto this SVG.
            const ysvg = catSvgRef.current && catSvgRef.current.isConnected ? catSvgRef.current : null
            const ctm = ysvg?.getScreenCTM()
            if (ysvg && ctm) {
                const cr = sv.getBoundingClientRect()
                const pt = ysvg.createSVGPoint()
                pt.x = 150
                pt.y = 492
                const q = pt.matrixTransform(ctm)
                endX = q.x - cr.left
                endY = q.y - cr.top
            }

            // Follow the pointer with a damped spring; idle, it drifts near the start.
            const m = pointer.current
            const target = m.on ? Math.max(0, Math.min(endX - 30, m.x)) : 40 + (Math.sin(t * 0.6) * 0.5 + 0.5) * 60
            cv = (cv + (target - cut) * 0.08) * 0.8
            cut += cv

            const P: [number, number, number, number][] = []
            for (let i = 0; i <= SAMPLES; i++) {
                const s = i / SAMPLES,
                    bx = s * endX,
                    u = Math.min(1, Math.max(0, (bx - cut) / 80)),
                    amp = u * 30 * (1 - Math.pow(Math.max(0, (s - 0.9) / 0.1), 2))
                const j = Math.sin(i * 12.9898) * 43758.5453,
                    fib = (j - Math.floor(j) - 0.5) * 0.7
                const lift = Math.pow(Math.max(0, (bx - (endX - 120)) / 120), 2) * (endY - Y0)
                P.push([
                    bx + (Math.sin(s * 80 + t * 0.6) * 0.9 + Math.sin(s * 23) * 0.4) * amp,
                    Y0 + lift + (Math.cos(s * 66 + t * 0.5) + Math.sin(s * 31) * 0.45) * amp + fib,
                    u,
                    s,
                ])
            }

            // Draw in the cat's scale, so the fibre filter and stroke widths match the ball.
            const yw = ysvg?.getBoundingClientRect().width
            const k = yw ? yw / 800 : 0.26
            sv.setAttribute("viewBox", `0 0 ${(W / k).toFixed(1)} ${(H / k).toFixed(1)}`)

            // Split the loopy part into strands passing behind (mid) and in front (front).
            const d = ["", "", ""]
            let prev = -1
            P.forEach(([x, y, u, s], i) => {
                const z = u > 0.02 ? Math.sin(s * 53 + t * 0.4) * u + (1 - u) : 1,
                    lv = z < -0.6 ? 1 : 2,
                    X = (x / k).toFixed(1),
                    Y = (y / k).toFixed(1)
                if (lv !== prev) {
                    d[lv] += i
                        ? `M${(P[i - 1][0] / k).toFixed(1)} ${(P[i - 1][1] / k).toFixed(1)}L${X} ${Y}`
                        : `M${X} ${Y}`
                    prev = lv
                } else d[lv] += `L${X} ${Y}`
            })
            midRef.current?.setAttribute("d", d[1] || "M0 0")
            frontRef.current?.setAttribute("d", d[2] || "M0 0")

            // Frayed end at the left.
            const ex = Math.max(P[0][0], 0) / k,
                ey = P[0][1] / k
            let fd = ""
            ;[
                [-1, -0.5],
                [-1, 0.1],
                [-0.9, 0.6],
                [-1, -0.15],
                [-0.8, -0.8],
            ].forEach(([dx, dy], i) => {
                const L = 26 + i * 5,
                    wv = Math.sin(t * 2 + i) * 3
                fd += `M${ex.toFixed(1)} ${ey.toFixed(1)}q${(dx * L * 0.5).toFixed(1)} ${(dy * L * 0.3 + wv).toFixed(1)} ${(dx * L).toFixed(1)} ${(dy * L).toFixed(1)}`
            })
            frayRef.current?.setAttribute("d", fd)

            const next = Math.round(Math.min(1, cut / Math.max(1, endX - 40)) * 100)
            if (next !== lastPct) {
                lastPct = next
                setPct(next)
            }
        }

        // Under reduced motion the thread stops drifting, but still follows the pointer.
        const loop = (now: number) => {
            draw(reduced.matches ? 0 : now / 1000)
            raf = requestAnimationFrame(loop)
        }
        const start = () => {
            if (!raf && visible) raf = requestAnimationFrame(loop)
        }
        const stop = () => {
            cancelAnimationFrame(raf)
            raf = 0
        }

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (visible) start()
            else stop()
        })
        io.observe(root)
        start()

        return () => {
            stop()
            io.disconnect()
        }
    }, [])

    const onMove = (event: PointerEvent<HTMLDivElement>) => {
        const r = (svgRef.current ?? event.currentTarget).getBoundingClientRect()
        pointer.current = { x: event.clientX - r.left, on: true }
        if (!used && pointer.current.x > 140) setUsed(true)
    }
    const onLeave = () => {
        pointer.current.on = false
    }

    const done = pct >= 97
    const label = done ? "Untangled." : used ? `${pct}% untangled` : "Move across to pull →"

    return (
        <div ref={rootRef} onPointerMove={onMove} onPointerLeave={onLeave} className="relative w-full">
            <div className="relative h-[150px]">
                <svg
                    ref={svgRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-[150px] w-full overflow-visible"
                >
                    <defs>
                        <filter id="hero-thread-fibre" x="-5%" y="-50%" width="110%" height="200%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n" />
                            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    </defs>
                    <g filter="url(#hero-thread-fibre)" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path ref={midRef} stroke="#937DE0" strokeWidth="2" />
                        <path ref={frontRef} stroke="#4F35B8" strokeWidth="2.6" />
                        <path ref={frayRef} stroke="#4F35B8" strokeWidth="1.6" opacity={0.85} />
                    </g>
                </svg>
                {/* On phones the cat is smaller and tucked in at the thread's end (cat-thread.html). */}
                <div
                    className={`absolute overflow-hidden mix-blend-multiply ${
                        mobile ? "top-2 -right-[18px] h-[130px] w-[130px]" : "-top-[30px] -right-[30px] h-[210px] w-[210px]"
                    }`}
                >
                    <YarnCat svgRef={catSvgRef} progress={0.9 - (pct / 100) * 0.35} lumpy pettable />
                </div>
            </div>
            <div className="flex justify-between gap-4 border-t border-hairline pt-2.5 text-[13px] text-ink-meta">
                <span>
                    <span className="text-ink">Fig. 1</span> — Pull the thread.
                </span>
                <span className={`tabular-nums ${done ? "text-brand" : ""}`}>{label}</span>
            </div>
        </div>
    )
}
