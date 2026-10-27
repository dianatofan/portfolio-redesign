"use client"

import { useEffect, useRef, useState } from "react"
import "./targeting-order.css"

/**
 * Microcomponent — the targeting order.
 *
 * From the prototype library's "Configuration targeting order" (DSH-4020). A
 * configuration's targetings are checked left to right and a player gets only the
 * first one they match, Default if none. Overlaps can't be detected, so the order
 * has to be obvious in the editor. Two of the prototype's three answers are here,
 * the two that move, switched like the prototype's banner switches them:
 *
 *   - 3b: "Evaluated left to right" and a ? that opens a looping mini demo
 *     (miss, match, skip) on hover or focus; a click keeps it open.
 *   - 3c: Show me, which walks a dot along the real tabs in their order: each
 *     one before "Lapsed Payers" is no match, and "Lapsed Payers" matches.
 *     (The prototype matched the 2nd and skipped the rest.)
 *
 * The targetings are the ones from the ticket's screenshot, in the same order.
 *
 * Dragging to reorder is left out: here it's the motion that's being shown.
 */

const DEFAULT_ID = "default"
/** The targeting the walkthrough's player matches. */
const MATCH_ID = "lapsed"
const VARIANTS = [
    { id: "help", label: "Hover hint" },
    { id: "show-me", label: "Walkthrough" },
] as const
type Variant = (typeof VARIANTS)[number]["id"]
const TARGETINGS = [
    { id: "lapsed-ios", name: "Lapsed Payers · iOS · LTV ≥ $100" },
    { id: "payers", name: "Payers" },
    { id: "non-payers", name: "Non Payers" },
    { id: "lapsed", name: "Lapsed Payers" },
]

type DemoState = "check" | "miss" | "hit" | "skip"

type Step = {
    /** Where the dot sits, in the row's coordinates. */
    x: number
    y: number
    visible: boolean
    states: Record<string, DemoState>
    bubble?: string
    tone?: "miss" | "hit"
}

const BOUNCE = "cubic-bezier(.34,1.56,.64,1)"

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** 3c, ported from the prototype's useOrderWalkthrough. About five seconds; toggling again stops it. */
function useOrderWalkthrough(ids: string[], matchId: string) {
    const [step, setStep] = useState<Step | null>(null)
    const rowRef = useRef<HTMLDivElement>(null)
    const tokenRef = useRef<HTMLSpanElement>(null)
    const timer = useRef<number>(undefined)
    const stopped = useRef(false)

    useEffect(
        () => () => {
            stopped.current = true
            window.clearTimeout(timer.current)
        },
        []
    )

    const wait = (ms: number) =>
        new Promise<void>((resolve, reject) => {
            timer.current = window.setTimeout(() => (stopped.current ? reject() : resolve()), ms)
        })
    const tab = (id: string) => rowRef.current?.querySelector<HTMLElement>(`[data-tab="${id}"]`) ?? null
    const at = (id: string, dx = 0) => {
        const el = tab(id)
        return el ? { x: el.offsetLeft + el.offsetWidth / 2 + dx, y: el.offsetTop } : { x: 0, y: 0 }
    }
    const animate = (el: HTMLElement | null, frames: Keyframe[], options: KeyframeAnimationOptions) => {
        if (el && !reducedMotion()) el.animate(frames, options)
    }
    const hop = () =>
        animate(
            tokenRef.current,
            [{ transform: "translateY(0)" }, { transform: "translateY(-12px)" }, { transform: "translateY(0)" }],
            { duration: 460, easing: BOUNCE }
        )
    const shake = (id: string) =>
        animate(
            tab(id),
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-4px)" },
                { transform: "translateX(4px)" },
                { transform: "translateX(-3px)" },
                { transform: "translateX(0)" },
            ],
            { duration: 380, easing: "ease-out" }
        )

    const running = step !== null

    async function toggle() {
        if (running) {
            stopped.current = true
            window.clearTimeout(timer.current)
            setStep(null)
            return
        }
        stopped.current = false
        const order = [...ids]
        const target = matchId
        try {
            const states: Record<string, DemoState> = {}
            setStep({ ...at(order[0], -40), visible: false, states: {} })
            await wait(60)
            setStep({ ...at(order[0], -40), visible: true, states: {} })
            await wait(400)
            let hit: string | null = null
            for (let i = 0; i < order.length; i++) {
                const id = order[i]
                states[id] = "check"
                setStep({ ...at(id), visible: true, states: { ...states } })
                hop()
                await wait(700)
                if (id === target) {
                    hit = id
                    states[id] = "hit"
                    order.slice(i + 1).forEach((rest) => (states[rest] = "skip"))
                    break
                }
                states[id] = "miss"
                shake(id)
                setStep({ ...at(id), visible: true, states: { ...states }, bubble: "No match", tone: "miss" })
                await wait(800)
            }
            if (hit) {
                setStep({ ...at(hit), visible: true, states: { ...states }, bubble: "Match", tone: "hit" })
            }
            await wait(2400)
            setStep((current) => current && { ...current, visible: false, states: {}, bubble: undefined })
            await wait(450)
        } catch {
            // Stopped.
        }
        setStep(null)
    }

    return { step, running, toggle, rowRef, tokenRef }
}

/** 3b's demo: A, B, C after Default. A misses, B matches, C is skipped. Loops. */
function MiniDemo() {
    return (
        <div aria-hidden className="to-mini">
            <span className="to-mini-token" />
            <span className="to-mini-tab to-mini-skip" style={{ left: 0, width: 58 }}>
                Default
            </span>
            <span className="to-mini-div" />
            <span className="to-mini-tab to-mini-miss" style={{ left: 72 }}>
                A
            </span>
            <span className="to-mini-tab to-mini-hit" style={{ left: 140 }}>
                B
            </span>
            <span className="to-mini-tab to-mini-skip" style={{ left: 208 }}>
                C
            </span>
        </div>
    )
}

/**
 * The ? and its popover. Opens on hover or focus; a click pins it open until the
 * ? is clicked again, Escape is pressed, or the reader clicks somewhere else.
 */
function EvaluationOrderHelp() {
    const [hovered, setHovered] = useState(false)
    const [pinned, setPinned] = useState(false)
    const open = hovered || pinned
    const anchorRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (!pinned) return
        const closeOutside = (e: PointerEvent) => {
            if (!anchorRef.current?.contains(e.target as Node)) setPinned(false)
        }
        const closeOnEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPinned(false)
        }
        document.addEventListener("pointerdown", closeOutside)
        document.addEventListener("keydown", closeOnEscape)
        return () => {
            document.removeEventListener("pointerdown", closeOutside)
            document.removeEventListener("keydown", closeOnEscape)
        }
    }, [pinned])

    return (
        // Not positioned itself, so the popover lines up with the start of the line above the tabs.
        <span
            ref={anchorRef}
            className="flex"
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
        >
            <button
                type="button"
                className="to-help"
                aria-label="How targetings are evaluated"
                aria-expanded={open}
                aria-describedby={open ? "to-help-popover" : undefined}
                onClick={() => setPinned((p) => !p)}
            >
                <span aria-hidden className="material-symbols-outlined to-icon">
                    help
                </span>
            </button>
            {open && (
                <span id="to-help-popover" role="tooltip" className="to-pop">
                    <MiniDemo />
                    <span className="to-pop-text">
                        Players get the <strong>first</strong> targeting they match, so order matters. If none
                        match, they get Default.
                    </span>
                </span>
            )}
        </span>
    )
}

/** Inert rendering for the closed frame: 3b's demo, looping on its own. */
export function TargetingOrderPreview() {
    return (
        <div className="to">
            <MiniDemo />
        </div>
    )
}

export function TargetingOrder() {
    const [variant, setVariant] = useState<Variant>("help")
    const [selected, setSelected] = useState(DEFAULT_ID)

    return (
        // The switch sits in the frame's corner like a toolbar, so the tabs can sit in the middle.
        <div className="to relative flex h-full w-full items-center justify-center px-6 pt-10 pb-4">
            <div role="group" aria-label="Variant" className="to-variants">
                {VARIANTS.map((v) => (
                    <button
                        key={v.id}
                        type="button"
                        aria-pressed={variant === v.id}
                        onClick={() => setVariant(v.id)}
                        className="to-variant"
                    >
                        {v.label}
                    </button>
                ))}
            </div>
            <div className="to w-full max-w-[640px]">
                {/* Keyed, so switching away stops a walkthrough that's running. */}
                <TargetingRow key={variant} variant={variant} selected={selected} onSelect={setSelected} />
            </div>
        </div>
    )
}

function TargetingRow({
    variant,
    selected,
    onSelect,
}: {
    variant: Variant
    selected: string
    onSelect: (id: string) => void
}) {
    const walkthrough = useOrderWalkthrough(TARGETINGS.map((t) => t.id), MATCH_ID)
    const { step } = walkthrough

    return (
        <>
            {variant === "help" ? (
                <div className="to-head">
                    <span className="to-head-text">Evaluated left to right</span>
                    <EvaluationOrderHelp />
                </div>
            ) : (
                <div className="to-head">
                    <span aria-hidden className="material-symbols-outlined to-icon to-head-text">
                        info
                    </span>
                    <span className="to-head-text">Evaluated left to right. First match wins, Default if none match.</span>
                    <button type="button" className="to-chip" data-running={walkthrough.running} onClick={() => walkthrough.toggle()}>
                        <span aria-hidden className="material-symbols-outlined to-icon">
                            {walkthrough.running ? "stop" : "play_arrow"}
                        </span>
                        {walkthrough.running ? "Stop" : "Show me"}
                    </button>
                </div>
            )}

            <div ref={walkthrough.rowRef} className="to-row">
                <span
                    ref={walkthrough.tokenRef}
                    aria-hidden
                    className="to-token"
                    style={{ top: (step?.y ?? 0) - 14, left: step?.x ?? 0, opacity: step?.visible ? 1 : 0 }}
                >
                    {step?.bubble && (
                        <span className="to-bubble" data-tone={step.tone}>
                            {step.bubble}
                        </span>
                    )}
                </span>

                <button
                    type="button"
                    data-tab={DEFAULT_ID}
                    title="Used when no targeting matches."
                    aria-pressed={selected === DEFAULT_ID}
                    onClick={() => onSelect(DEFAULT_ID)}
                    className="to-tab"
                >
                    Default
                </button>
                <span aria-hidden className="to-divider" />
                {TARGETINGS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        data-tab={t.id}
                        data-demo={step?.states[t.id]}
                        aria-pressed={selected === t.id}
                        onClick={() => onSelect(t.id)}
                        className="to-tab"
                    >
                        {t.name}
                    </button>
                ))}
            </div>
        </>
    )
}
