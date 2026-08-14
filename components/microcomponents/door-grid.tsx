"use client"

import { memo, useCallback, useContext, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CursorContext } from "@/context/CursorContext"
import { appleEase, STAGE_BG, type Microcomponent } from "./types"

/** The opened door covers the whole grid: every row, every column. */
const OPEN_AREA = "1 / 1 / -1 / -1"

const toGridArea = (area: Microcomponent["area"]) =>
    `${area.row[0]} / ${area.col[0]} / ${area.row[1]} / ${area.col[1]}`

const COLS = 5
const ROWS = 3
/** Grid line numbers of the outer right and bottom edges. */
const OUTER_COL = COLS + 1
const OUTER_ROW = ROWS + 1

/**
 * Cells draw only the lines *inside* the grid; the container owns all four outer
 * edges. Necessary once the container is rounded: a cell border running to the
 * outer edge is a straight line, and the rounded clip slices its corner off.
 */
const innerBorders = (rowEnd: number, colEnd: number) =>
    [colEnd === OUTER_COL ? "" : "border-r", rowEnd === OUTER_ROW ? "" : "border-b"]
        .filter(Boolean)
        .join(" ")

type DoorProps = {
    item: Microcomponent
    isOpen: boolean
    isGroupActive: boolean
    /** Only ever true for the open door — see the note at the call site. */
    hintUsed: boolean
    reduceMotion: boolean
    onOpen: (id: string) => void
    onClose: () => void
    onEnter: (id: string) => void
    onHover: (id: string | null) => void
    onHintUsed: () => void
    registerTrigger: (id: string, el: HTMLButtonElement | null) => void
}

/*
 * Memoised per cell, which matters more than it looks: every door is a
 * framer-motion `layout` node, and a layout node re-measures itself whenever it
 * re-renders. Without this, moving the pointer across the grid re-measured all
 * three doors and all three satellites — a forced reflow of the whole document,
 * repeatedly, while the visitor was mid-scroll. Now a hover re-renders only the
 * cell being entered and the one being left.
 */
const Door = memo(function Door({
    item,
    isOpen,
    isGroupActive,
    hintUsed,
    reduceMotion,
    onOpen,
    onClose,
    onEnter,
    onHover,
    onHintUsed,
    registerTrigger,
}: DoorProps) {
    return (
        <motion.div
            layout={!reduceMotion}
            transition={{ duration: 0.5, ease: appleEase }}
            style={{
                gridArea: isOpen ? OPEN_AREA : toGridArea(item.area),
                zIndex: isOpen ? 20 : isGroupActive ? 10 : 1,
            }}
            className={`relative overflow-hidden border-border transition-colors duration-200 ${
                // Opened, the cell spans the whole grid, so it has no
                // internal edges left to draw.
                isOpen ? "" : innerBorders(item.area.row[1], item.area.col[1])
            } ${isGroupActive ? "bg-[#f4f4f5]" : "bg-card"}`}
        >
            {/* The cover stays mounted and fades out, so the crossfade
                has something to cross from and the focus target survives. */}
            <button
                ref={(el) => {
                    registerTrigger(item.id, el)
                }}
                type="button"
                onClick={() => onOpen(item.id)}
                onMouseEnter={() => onEnter(item.id)}
                onFocus={() => onHover(item.id)}
                onBlur={() => onHover(null)}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                tabIndex={isOpen ? -1 : 0}
                style={{
                    opacity: isOpen ? 0 : 1,
                    pointerEvents: isOpen ? "none" : "auto",
                }}
                className="absolute inset-0 z-[1] flex flex-col justify-between p-5 text-left transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/40 motion-reduce:transition-none"
            >
                <span className="font-mono text-sm tabular-nums text-[var(--text-tertiary)]">
                    {item.num}
                </span>

                {/* A finished component shows itself here rather than
                    hiding behind the door. Inert by necessity — see the
                    note in switchboard-filter.tsx. */}
                {item.preview && (
                    <span
                        aria-hidden
                        className="pointer-events-none flex flex-1 items-center justify-center pb-6 pt-4"
                    >
                        {item.preview()}
                    </span>
                )}

                <span>
                    <span className="block font-medium text-foreground">{item.name}</span>
                    {item.blurb && (
                        <span className="mt-1 block max-w-[52ch] text-sm text-[var(--text-secondary)]">
                            {item.blurb}
                        </span>
                    )}
                </span>
            </button>

            {isOpen && (
                <div
                    id={`${item.id}-panel`}
                    role="group"
                    aria-label={item.name}
                    className="absolute inset-0 flex flex-col"
                >
                    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-3.5">
                        <span className="flex items-baseline gap-3">
                            <span className="font-mono text-sm tabular-nums text-[var(--text-tertiary)]">
                                {item.num}
                            </span>
                            <span className="font-medium text-foreground">{item.name}</span>
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2"
                        >
                            Close
                        </button>
                    </div>
                    {/* A text rail beside the component, using the width
                        the opened panel suddenly has. Skipped entirely
                        when there's no note, so nothing empty appears. */}
                    <div className="flex min-h-0 flex-1">
                        {item.note && (
                            <div className="w-[300px] shrink-0 overflow-y-auto border-r border-border px-5 py-5">
                                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                                    {item.note}
                                </p>
                            </div>
                        )}
                        {/* Interaction listeners sit on this column
                            only, so using the header's Close button
                            doesn't count as "they figured it out". */}
                        <div
                            className={`relative min-h-0 min-w-0 flex-1 ${STAGE_BG}`}
                            onPointerDown={onHintUsed}
                            onKeyDown={onHintUsed}
                        >
                            {item.render()}

                            {/* Click affordance, tucked bottom-right so it
                                never sits in the component's way, and
                                gone the moment the visitor interacts. */}
                            <span
                                className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-2.5 py-1 text-[11px] text-[var(--text-tertiary)] backdrop-blur-sm transition-opacity duration-500 motion-reduce:transition-none"
                                style={{ opacity: hintUsed ? 0 : 1 }}
                            >
                                <span
                                    aria-hidden
                                    className="material-symbols-outlined leading-none"
                                    style={{
                                        fontSize: 14,
                                        fontVariationSettings:
                                            '"FILL" 0, "wght" 500, "GRAD" 0, "opsz" 20',
                                    }}
                                >
                                    ads_click
                                </span>
                                Interactive
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
})

/*
 * Satellites: a second way into the same component, and the filler that makes
 * the composition feel deliberate rather than padded. They're aria-hidden and
 * not focusable on purpose — the main door is the keyboard-reachable control, so
 * these would only add duplicate tab stops and repeated announcements.
 */
const Satellite = memo(function Satellite({
    item,
    row,
    isGroupActive,
    onOpen,
    onEnter,
}: {
    item: Microcomponent
    row: number
    isGroupActive: boolean
    onOpen: (id: string) => void
    onEnter: (id: string) => void
}) {
    return (
        <div
            aria-hidden
            onClick={() => onOpen(item.id)}
            onMouseEnter={() => onEnter(item.id)}
            style={{ gridArea: `${row} / ${COLS} / ${row + 1} / ${OUTER_COL}` }}
            className={`flex items-center justify-center border-border transition-colors duration-200 ${innerBorders(
                row + 1,
                OUTER_COL
            )} ${isGroupActive ? "bg-[#f4f4f5]" : "bg-card"}`}
        >
            <span
                className={`font-mono text-2xl tabular-nums transition-colors duration-200 ${
                    isGroupActive ? "text-foreground" : "text-[var(--text-tertiary)]"
                }`}
            >
                {item.num}
            </span>
        </div>
    )
})

/**
 * A modular grid of numbered compartments. Clicking one expands it in place to
 * fill the grid and reveals the component inside.
 *
 * Two details worth knowing:
 *
 * 1. Opening works by swapping the cell's `gridArea` to span everything and
 *    raising its z-index. Because grid items are allowed to overlap, the other
 *    cells don't reflow — they're simply covered — and framer-motion's `layout`
 *    animates the size change for free.
 *
 * 2. Each component owns two cells: its main door and a small numbered
 *    satellite. Hover is therefore tracked in state rather than with CSS
 *    `:hover`, so hovering either cell highlights *both* and the grouping is
 *    never ambiguous.
 */
export function DoorGrid({ items }: { items: Microcomponent[] }) {
    const [openId, setOpenId] = useState<string | null>(null)
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    // Whether the visitor has touched the opened component yet. Reset on every
    // open, so the hint greets each door but never nags after you've acted.
    const [hintUsed, setHintUsed] = useState(false)
    const reduceMotion = useReducedMotion() ?? false
    const { setVariant } = useContext(CursorContext)
    const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    // Read by the stable `close` callback below, so closing doesn't have to
    // depend on openId — a changing callback identity would defeat the memo on
    // every cell.
    const openIdRef = useRef<string | null>(null)
    openIdRef.current = openId

    const registerTrigger = useCallback((id: string, el: HTMLButtonElement | null) => {
        triggerRefs.current[id] = el
    }, [])

    const open = useCallback(
        (id: string) => {
            setOpenId(id)
            setHintUsed(false)
            // Drop the big "Open" disc — it shouldn't linger over an opened panel.
            setVariant("default")
        },
        [setVariant]
    )

    const close = useCallback(() => {
        const id = openIdRef.current
        const trigger = id ? triggerRefs.current[id] : null
        setOpenId(null)
        setVariant("default")
        // Hand focus back to the door that was opened, so keyboard users aren't
        // dumped at the top of the document. Wait a frame for it to be tabbable.
        requestAnimationFrame(() => trigger?.focus())
    }, [setVariant])

    useEffect(() => {
        if (!openId) return
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") close()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [openId, close])

    const enter = useCallback(
        (id: string) => {
            setHoveredId(id)
            if (!openIdRef.current) setVariant("open")
        },
        [setVariant]
    )

    const leave = useCallback(() => {
        setHoveredId(null)
        setVariant("default")
    }, [setVariant])

    const markHintUsed = useCallback(() => setHintUsed(true), [])

    return (
        <div
            // No max-width: the grid fills the section container so its left and
            // right edges line up with the Case Studies cards above. `rounded-lg`
            // matches those cards' corner radius, and the container carries the
            // full border so every corner follows the arc.
            className="relative grid h-[640px] w-full grid-cols-5 overflow-hidden rounded-lg border border-border [grid-template-rows:repeat(3,minmax(0,1fr))]"
            onMouseLeave={leave}
        >
            {items.map((item) => (
                <Door
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    isGroupActive={hoveredId === item.id && !openId}
                    // Passed as false for closed doors: only the open one renders
                    // the hint, so the others stay out of this state's re-renders.
                    hintUsed={openId === item.id ? hintUsed : false}
                    reduceMotion={reduceMotion}
                    onOpen={open}
                    onClose={close}
                    onEnter={enter}
                    onHover={setHoveredId}
                    onHintUsed={markHintUsed}
                    registerTrigger={registerTrigger}
                />
            ))}

            {items.map((item, i) => (
                <Satellite
                    key={`satellite-${item.id}`}
                    item={item}
                    row={i + 1}
                    isGroupActive={hoveredId === item.id && !openId}
                    onOpen={open}
                    onEnter={enter}
                />
            ))}
        </div>
    )
}
