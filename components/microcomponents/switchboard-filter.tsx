"use client"

import { useState } from "react"

/**
 * Microcomponent 01 — the status "switchboard".
 *
 * A port of the filter shipped in the Tactile LiveOps dashboard. The original is
 * MUI + the Tactile design system; this rebuilds the *interaction* on this site's
 * own tokens, which is the part worth showing:
 *
 *   - the toggles overlap (-9px) so they read as one connected switchboard
 *     rather than five separate checkboxes
 *   - each carries a 2px card-coloured ring, which is what bites the crescent
 *     notch out of its neighbour and keeps overlapping circles legible
 *   - hover lifts a toggle above its neighbours (z-index) so that ring never
 *     gets clipped by the next circle along
 *   - deselected desaturates but keeps the glyph, so the set stays countable
 *     and identifiable — the same call `variant='gray'` makes in the original
 *
 * Glyphs come from Material Symbols, already loaded globally in app/layout.tsx
 * and used the same way in components/hero.tsx. The five status colours are
 * specific to this control and don't exist elsewhere in the palette.
 *
 * Two exports, because the closed door on the homepage shows this control but
 * must not be interactive there — a real button inside the door's cover button
 * would be invalid HTML and would swallow the click that opens the door. So
 * `SwitchboardPreview` renders the same chrome with spans instead of buttons.
 */

type Status = {
    id: string
    label: string
    color: string
    /** Material Symbols glyph name. */
    icon: string
}

const STATUSES: Status[] = [
    { id: "running", label: "Running", color: "#43915F", icon: "play_arrow" },
    { id: "paused", label: "Paused", color: "#DA9030", icon: "pause" },
    { id: "stopped", label: "Stopped", color: "#D13B2A", icon: "stop" },
    { id: "completed", label: "Completed", color: "#6F4EE3", icon: "check" },
    { id: "draft", label: "Draft", color: "#5F6773", icon: "edit" },
]

const ALL = STATUSES.map((s) => s.id)

const RING = "relative z-[1] flex rounded-full border-2 border-card"
const OFF_COLOR = "#C7CBD1"

/** Still overlapping, so the row reads as one switchboard — just less tightly. */
const overlap = (i: number) => (i === 0 ? "" : "-ml-[4px]")

/**
 * Coloured disc with its white glyph; grey when deselected.
 *
 * One shared `fontVariationSettings` across all five glyphs is what keeps their
 * stroke weight identical — Material Symbols varies weight per-axis, so setting
 * FILL and wght once here rather than per icon is the thing that makes the row
 * look consistent.
 */
const GLYPH_AXES = '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 24'

function StatusDot({ status, on }: { status: Status; on: boolean }) {
    return (
        <span
            className="flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-200"
            style={{ backgroundColor: on ? status.color : OFF_COLOR }}
        >
            <span
                aria-hidden
                className="material-symbols-outlined leading-none text-white"
                style={{ fontSize: 14, fontVariationSettings: GLYPH_AXES }}
            >
                {status.icon}
            </span>
        </span>
    )
}

/** The pill's label, divider and toggle rail — shared by both states. */
function SwitchboardChrome({
    children,
    interactive,
}: {
    children: React.ReactNode
    interactive?: boolean
}) {
    return (
        <div
            className={`flex h-8 items-center gap-2 rounded-[8px] border border-border bg-card p-1 ${
                interactive
                    ? "transition-colors duration-200 hover:border-[var(--text-tertiary)]"
                    : ""
            }`}
        >
            <span className="pl-1 text-sm text-foreground">Status</span>
            <span aria-hidden className="h-4 w-px bg-border" />
            <span className="flex items-center pr-1">{children}</span>
        </div>
    )
}

/**
 * The pattern this replaced, drawn faithfully: a dropdown trigger with a count
 * badge, as in `filter-trigger` / `filter-trigger__count` in the LiveOps
 * prototype. Inert, and its count tracks the live selection on purpose — toggle
 * the switchboard and this collapses to "2 of 5" while the switchboard still
 * says *which* two. That contrast is the whole argument.
 */
function CountChipDropdown({ count, total }: { count: number; total: number }) {
    return (
        <div
            aria-hidden
            className="pointer-events-none flex h-8 items-center gap-2 rounded-[8px] border border-border bg-card pl-3 pr-2 opacity-70"
        >
            <span className="text-sm text-foreground">Status</span>
            <span className="rounded-full bg-[#eeeff2] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                {count} of {total}
            </span>
            <span
                className="material-symbols-outlined leading-none text-[var(--text-tertiary)]"
                style={{
                    fontSize: 18,
                    fontVariationSettings: '"FILL" 0, "wght" 500, "GRAD" 0, "opsz" 20',
                }}
            >
                expand_more
            </span>
        </div>
    )
}

/**
 * `strong` carries the comparison. Same colour as the quiet label on purpose —
 * the emphasis comes from size and weight, so the pair still reads as one set of
 * captions rather than two competing voices.
 */
function RowLabel({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
    return (
        <span
            className={
                strong
                    ? "text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]"
                    : "text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]"
            }
        >
            {children}
        </span>
    )
}

/** Inert rendering for the closed door: real markup, no interactivity. */
export function SwitchboardPreview() {
    return (
        <SwitchboardChrome>
            {STATUSES.map((status, i) => (
                <span key={status.id} className={`${RING} ${overlap(i)}`}>
                    <StatusDot status={status} on />
                </span>
            ))}
        </SwitchboardChrome>
    )
}

export function SwitchboardFilter() {
    const [selected, setSelected] = useState<string[]>(ALL)

    const toggle = (id: string) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))

    const selectedLabels = STATUSES.filter((s) => selected.includes(s.id)).map((s) => s.label)

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-7 px-6">
            {/* The rejected pattern, for contrast. */}
            <div className="flex flex-col items-center gap-2">
                <RowLabel strong>Instead of</RowLabel>
                <CountChipDropdown count={selected.length} total={STATUSES.length} />
            </div>

            <div className="flex flex-col items-center gap-2">
                <RowLabel>This</RowLabel>
                <SwitchboardChrome interactive>
                    {STATUSES.map((status, i) => {
                        const isSelected = selected.includes(status.id)

                        return (
                            <button
                                key={status.id}
                                type="button"
                                onClick={() => toggle(status.id)}
                                aria-pressed={isSelected}
                                title={status.label}
                                className={`${RING} ${overlap(i)} transition-[border-color] duration-200 hover:z-[2] hover:border-[var(--text-tertiary)] focus-visible:z-[2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40`}
                            >
                                <span className="sr-only">{status.label}</span>
                                <StatusDot status={status} on={isSelected} />
                            </button>
                        )
                    })}
                </SwitchboardChrome>
            </div>

            {/* A readout, so the control's effect is visible in isolation. The real
                one filters a table instead. */}
            <p
                aria-live="polite"
                className="min-h-[1.25rem] max-w-[38ch] text-center text-xs text-[var(--text-tertiary)]"
            >
                {selectedLabels.length === 0
                    ? "Nothing selected. The list would come back empty."
                    : selectedLabels.length === STATUSES.length
                      ? "Showing all statuses"
                      : `Showing ${selectedLabels.join(", ")}`}
            </p>
        </div>
    )
}
