"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import "./holdout-diagram.css"

/**
 * Microcomponent 03 — the illustrated tutorial.
 *
 * A port of the explainer from the Tactile A/B-test creation dialog. A holdout
 * group is carved out of the player base and never treated — the same players
 * every test — while everyone else reshuffles into control and treatment. That's
 * hard to say in a sentence and obvious as a diagram, so the diagram animates
 * itself once: one bar, break off the holdout, label it, split the rest.
 *
 * The interesting part is that all of it is driven by a single `data-phase`
 * number on the root; every movement is a CSS transition keyed off that
 * attribute (see holdout-diagram.css). React only counts 0 → 4.
 *
 * Two deliberate changes from the original:
 *
 *   - The original gated the animation behind a localStorage "seen once" flag,
 *     which is right in a dialog you meet repeatedly and wrong here — in a
 *     portfolio the animation is the point, so it plays on every open.
 *   - The original had its own dismiss button; here the door already provides
 *     Close, so a second one would just be confusing.
 */

/** [phase, ms from start] — absolute offsets, not deltas. */
const BEATS: Array<[number, number]> = [
    [1, 900], // break the holdout off the test groups
    [2, 1120], // label both blocks
    [3, 1780], // split test groups into control | treatment
    [4, 2000], // label those, then the seed captions land last
]
const FINAL_PHASE = 4

const pct = (share: number) => `${Math.round(share * 100)}%`

function Pct({ share }: { share: number }) {
    return <span className="hd-mono">{pct(share)}</span>
}

function LockGlyph() {
    return (
        <span
            aria-hidden
            className="material-symbols-outlined leading-none"
            style={{
                fontSize: 14,
                color: "#767676",
                fontVariationSettings: '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 20',
            }}
        >
            lock
        </span>
    )
}

type BarProps = {
    holdout: number
    /** Seed captions are dropped in the compact closed-door preview. */
    showSeeds?: boolean
}

/** The bar itself — identical in the live and preview renderings. */
function Bar({ holdout, showSeeds = true }: BarProps) {
    const testGroups = 1 - holdout
    const groupShare = testGroups / 2

    /*
     * The holdout block is sized by its share, so at 5-10% the full label can't
     * fit. Measure the rendered block and step the label down: full text, then
     * lock + percentage, then just the lock. Thresholds tuned so a typical ~20%
     * holdout keeps the whole label.
     */
    const holdoutRef = useRef<HTMLDivElement>(null)
    const [holdoutWidth, setHoldoutWidth] = useState(0)

    useLayoutEffect(() => {
        const el = holdoutRef.current
        if (!el) return
        setHoldoutWidth(el.getBoundingClientRect().width)
        const observer = new ResizeObserver((entries) =>
            setHoldoutWidth(entries[0].contentRect.width)
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // Thresholds are measured against Saans at 11px, which runs wider than the
    // font in the original — at 82px the full label lost its trailing "%".
    const holdoutLabel =
        holdoutWidth >= 112 ? (
            <>
                <LockGlyph />
                Holdout <Pct share={holdout} />
            </>
        ) : holdoutWidth >= 56 ? (
            <>
                <LockGlyph />
                <Pct share={holdout} />
            </>
        ) : (
            <LockGlyph />
        )

    return (
        <>
            <div className="hd-bar">
                <div
                    ref={holdoutRef}
                    className="hd-holdout"
                    style={{ flex: `${Math.round(holdout * 100)} 1 0`, minWidth: 0 }}
                >
                    <div className="hd-hatch" />
                    <div className="hd-lbl hd-lbl-holdout hd-lbl-abs">{holdoutLabel}</div>
                </div>

                <div
                    className="hd-pool"
                    style={{ flex: `${Math.round(testGroups * 100)} 1 0`, minWidth: 0 }}
                >
                    <div
                        className="hd-seg hd-seg-control"
                        style={{ flex: `${Math.round(groupShare * 100)} 1 0`, minWidth: 0 }}
                    >
                        <div className="hd-seg-fill" />
                        <div className="hd-lbl hd-lbl-seg hd-lbl-abs">
                            control <Pct share={groupShare} />
                        </div>
                    </div>
                    <div
                        className="hd-seg hd-seg-treatment"
                        style={{ flex: `${Math.round(groupShare * 100)} 1 0`, minWidth: 0 }}
                    >
                        <div className="hd-seg-fill" />
                        <div className="hd-lbl hd-lbl-seg hd-lbl-abs">
                            treatment <Pct share={groupShare} />
                        </div>
                    </div>
                    <div className="hd-lbl hd-lbl-pool hd-lbl-abs">
                        Test groups <Pct share={testGroups} />
                    </div>
                </div>

                <div className="hd-lbl-all">
                    All players <Pct share={1} />
                </div>
            </div>

            {showSeeds && (
                <div className="hd-seeds">
                    <div
                        className="hd-seed-cell"
                        style={{
                            flex: `${Math.round(holdout * 100)} 1 0`,
                            minWidth: "max-content",
                        }}
                    >
                        Source seed
                    </div>
                    <div
                        className="hd-seed-cell hd-seed-groups"
                        style={{
                            flex: `${Math.round(testGroups * 100)} 1 0`,
                            minWidth: "max-content",
                        }}
                    >
                        New seed · assigned on creation
                    </div>
                </div>
            )}
        </>
    )
}

/**
 * Inert, compact final-state rendering for the closed door: the settled bar only.
 * A glimpse, not the whole component — the cell is one grid row tall, and the
 * title and seed captions belong to the opened version.
 */
export function HoldoutDiagramPreview({ holdout = 0.2 }: { holdout?: number }) {
    return (
        <div className="hd w-full max-w-[520px]" data-phase={FINAL_PHASE}>
            <Bar holdout={holdout} showSeeds={false} />
        </div>
    )
}

export function HoldoutDiagram({ holdout = 0.2 }: { holdout?: number }) {
    const reduceMotion = useReducedMotion()
    const [phase, setPhase] = useState(reduceMotion ? FINAL_PHASE : 0)
    const timers = useRef<number[]>([])

    const clearTimers = useCallback(() => {
        timers.current.forEach((t) => window.clearTimeout(t))
        timers.current = []
    }, [])

    const play = useCallback(() => {
        clearTimers()
        setPhase(0)
        timers.current = BEATS.map(([p, ms]) => window.setTimeout(() => setPhase(p), ms))
    }, [clearTimers])

    useEffect(() => {
        if (reduceMotion) {
            setPhase(FINAL_PHASE)
            return
        }
        play()
        return clearTimers
    }, [reduceMotion, play, clearTimers])

    return (
        <div className="flex h-full w-full items-center justify-center px-6 py-4">
            <div className="hd w-full max-w-[640px]" data-phase={phase}>
                <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">How players are divided</p>
                    {!reduceMotion && (
                        <button
                            type="button"
                            onClick={play}
                            aria-label="Replay animation"
                            title="Replay animation"
                            className="inline-flex shrink-0 items-center text-[var(--text-tertiary)] transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2"
                        >
                            <span
                                aria-hidden
                                className="material-symbols-outlined leading-none"
                                style={{
                                    fontSize: 16,
                                    fontVariationSettings:
                                        '"FILL" 0, "wght" 500, "GRAD" 0, "opsz" 20',
                                }}
                            >
                                replay
                            </span>
                        </button>
                    )}
                </div>
                <Bar holdout={holdout} />
            </div>
        </div>
    )
}
