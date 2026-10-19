"use client"

import { useEffect, useRef, useState } from "react"
import { trackEvent } from "@/lib/track-event"

/*
 * The hero's interactive piece: a small layered system drawn tangled, which the
 * visitor can drag apart by hand or settle with one button. It acts out the
 * headline ("untangling complex systems") instead of decorating it.
 *
 * Plain Canvas 2D, no three.js: the whole thing is a few dozen lines of geometry,
 * and it draws only when something changes, so an idle hero costs nothing.
 */

type Node = { layer: number; idx: number; x: number; y: number; tx: number; ty: number }
type Edge = [Node, Node]

// Sources -> services -> outputs. Wider in the middle, like most real systems.
const LAYERS = [3, 4, 5, 4, 3]
const LAVENDER = "#B19EEF"

function buildGraph() {
    const nodes: Node[] = []
    LAYERS.forEach((count, layer) => {
        for (let idx = 0; idx < count; idx++) nodes.push({ layer, idx, x: 0, y: 0, tx: 0, ty: 0 })
    })
    const inLayer = (layer: number) => nodes.filter((n) => n.layer === layer)

    /*
     * Each node links to the one or two nodes at the same relative height in the
     * next layer. Those links never cross once every layer is sorted top to
     * bottom, so a solved state always exists and reads as zero crossings.
     */
    const edges: Edge[] = []
    for (let layer = 0; layer < LAYERS.length - 1; layer++) {
        const from = inLayer(layer)
        const to = inLayer(layer + 1)
        from.forEach((node, i) => {
            const lo = Math.floor((i * to.length) / from.length)
            const hi = Math.min(to.length - 1, Math.ceil(((i + 1) * to.length) / from.length) - 1)
            for (let j = lo; j <= hi; j++) edges.push([node, to[j]])
        })
    }
    return { nodes, edges }
}

// Seeded so the opening tangle is the same on every visit, not a lucky or ugly roll.
function seededRandom(seed: number) {
    return () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
    }
}

function segmentsCross(a: Node, b: Node, c: Node, d: Node) {
    if (a === c || a === d || b === c || b === d) return false
    const side = (p: Node, q: Node, r: Node) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x))
    return side(a, b, c) !== side(a, b, d) && side(c, d, a) !== side(c, d, b)
}

export function UntangleGraph() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const graphRef = useRef(buildGraph())
    const solveRef = useRef<() => void>(() => {})
    const scrambleRef = useRef<() => void>(() => {})
    const [crossings, setCrossings] = useState<number | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const { nodes, edges } = graphRef.current
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        let width = 0
        let height = 0
        let frame = 0
        let dragging: Node | null = null
        let hovered: Node | null = null

        const token = (name: string, fallback: string) =>
            getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

        /*
         * The solved layout keeps to the right-hand two thirds on desktop, so the
         * settled graph sits beside the headline rather than through it. On phones
         * there is no room for that, so it spans the width and stays faint.
         */
        const layoutTargets = () => {
            const wide = width >= 768
            const left = wide ? width * 0.42 : width * 0.08
            const right = wide ? width * 0.94 : width * 0.92
            const top = height * 0.14
            const bottom = height * 0.86
            nodes.forEach((n) => {
                n.tx = left + (right - left) * (n.layer / (LAYERS.length - 1))
                n.ty = top + (bottom - top) * ((n.idx + 0.5) / LAYERS[n.layer])
            })
        }

        /*
         * Shuffles each layer's order and nudges every node off its slot. That
         * keeps the tangle inside the graph's own area and at a readable density,
         * instead of strewing lines across the whole hero and over the headline.
         */
        const scramble = () => {
            const random = seededRandom(7)
            LAYERS.forEach((_, layer) => {
                const members = nodes.filter((n) => n.layer === layer)
                const slots = members.map((n) => n.ty).sort(() => random() - 0.5)
                members.forEach((n, i) => {
                    n.x = n.tx + (random() - 0.5) * width * 0.12
                    n.y = slots[i] + (random() - 0.5) * height * 0.16
                })
            })
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height)
            const ink = token("--foreground", "#131417")
            const paper = token("--background", "#F5F5F5")
            const crossingEdges = new Set<Edge>()
            let count = 0
            for (let i = 0; i < edges.length; i++)
                for (let j = i + 1; j < edges.length; j++)
                    if (segmentsCross(...edges[i], ...edges[j])) {
                        count++
                        crossingEdges.add(edges[i])
                        crossingEdges.add(edges[j])
                    }

            // Kept quiet on purpose: the headline sits on top and must stay the
            // loudest thing in the hero.
            ctx.lineWidth = 1.25
            // On phones the graph runs behind the clock and headline, so fainter still.
            const quiet = width < 768 ? 0.6 : 1
            edges.forEach((edge) => {
                const tangled = crossingEdges.has(edge)
                ctx.strokeStyle = tangled ? LAVENDER : ink
                ctx.globalAlpha = (tangled ? 0.6 : 0.14) * quiet
                ctx.beginPath()
                ctx.moveTo(edge[0].x, edge[0].y)
                ctx.lineTo(edge[1].x, edge[1].y)
                ctx.stroke()
            })

            ctx.globalAlpha = 1
            nodes.forEach((n) => {
                const active = n === dragging || n === hovered
                ctx.beginPath()
                ctx.arc(n.x, n.y, active ? 8 : 5.5, 0, Math.PI * 2)
                ctx.fillStyle = paper
                ctx.fill()
                ctx.lineWidth = 1.5
                ctx.strokeStyle = active ? LAVENDER : ink
                ctx.globalAlpha = active ? 1 : 0.4 * quiet
                ctx.stroke()
                ctx.globalAlpha = 1
            })

            setCrossings(count)
        }

        const resize = () => {
            const rect = canvas.getBoundingClientRect()
            const prevWidth = width || rect.width
            const prevHeight = height || rect.height
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = rect.width
            height = rect.height
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            // Keep nodes where they were, proportionally, rather than re-tangling.
            nodes.forEach((n) => {
                n.x *= width / prevWidth
                n.y *= height / prevHeight
            })
            layoutTargets()
        }

        const solve = () => {
            cancelAnimationFrame(frame)
            if (reduceMotion.matches) {
                nodes.forEach((n) => {
                    n.x = n.tx
                    n.y = n.ty
                })
                draw()
                return
            }
            const from = nodes.map((n) => [n.x, n.y])
            const start = performance.now()
            const duration = 1100
            const step = (now: number) => {
                const t = Math.min(1, (now - start) / duration)
                const eased = 1 - Math.pow(1 - t, 4)
                nodes.forEach((n, i) => {
                    n.x = from[i][0] + (n.tx - from[i][0]) * eased
                    n.y = from[i][1] + (n.ty - from[i][1]) * eased
                })
                draw()
                if (t < 1) frame = requestAnimationFrame(step)
            }
            frame = requestAnimationFrame(step)
        }

        const point = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            return { x: event.clientX - rect.left, y: event.clientY - rect.top }
        }
        const nodeAt = (x: number, y: number) => nodes.find((n) => Math.hypot(n.x - x, n.y - y) < 18) ?? null

        const onPointerDown = (event: PointerEvent) => {
            const p = point(event)
            dragging = nodeAt(p.x, p.y)
            if (!dragging) return
            cancelAnimationFrame(frame)
            canvas.setPointerCapture(event.pointerId)
            canvas.style.cursor = "grabbing"
            draw()
        }
        const onPointerMove = (event: PointerEvent) => {
            const p = point(event)
            if (dragging) {
                dragging.x = Math.max(8, Math.min(width - 8, p.x))
                dragging.y = Math.max(8, Math.min(height - 8, p.y))
                draw()
                return
            }
            const over = nodeAt(p.x, p.y)
            if (over !== hovered) {
                hovered = over
                canvas.style.cursor = over ? "grab" : ""
                draw()
            }
        }
        const onPointerUp = () => {
            if (!dragging) return
            dragging = null
            canvas.style.cursor = hovered ? "grab" : ""
            draw()
            trackEvent("hero_graph_drag")
        }

        resize()
        scramble()
        draw()

        solveRef.current = solve
        scrambleRef.current = () => {
            cancelAnimationFrame(frame)
            scramble()
            draw()
        }

        canvas.addEventListener("pointerdown", onPointerDown)
        canvas.addEventListener("pointermove", onPointerMove)
        canvas.addEventListener("pointerup", onPointerUp)
        canvas.addEventListener("pointercancel", onPointerUp)
        const observer = new ResizeObserver(() => {
            resize()
            draw()
        })
        observer.observe(canvas)

        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
            canvas.removeEventListener("pointerdown", onPointerDown)
            canvas.removeEventListener("pointermove", onPointerMove)
            canvas.removeEventListener("pointerup", onPointerUp)
            canvas.removeEventListener("pointercancel", onPointerUp)
        }
    }, [])

    const solved = crossings === 0

    return (
        <>
            {/*
             * pan-y keeps vertical swipes scrolling the page on phones; there the
             * button is the main way in, and dragging is a desktop bonus.
             */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
                style={{ touchAction: "pan-y" }}
                aria-hidden="true"
            />

            <div className="absolute bottom-8 right-6 z-10 flex items-center gap-3">
                <span
                    className="text-sm font-medium text-[var(--text-tertiary)] tabular-nums"
                    aria-live="polite"
                >
                    {crossings === null ? "" : solved ? "Untangled" : `${crossings} crossings`}
                </span>
                <button
                    type="button"
                    onClick={() => {
                        if (solved) {
                            scrambleRef.current()
                            trackEvent("hero_graph_retangle")
                        } else {
                            solveRef.current()
                            trackEvent("hero_graph_untangle")
                        }
                    }}
                    className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors duration-200 hover:bg-[#B19EEF] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B19EEF]"
                >
                    {solved ? "Tangle it again" : "Untangle"}
                </button>
            </div>
        </>
    )
}
