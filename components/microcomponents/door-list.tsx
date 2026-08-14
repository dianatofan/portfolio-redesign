"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { appleEase, STAGE_BG, type Microcomponent } from "./types"

/**
 * The touch-sized reading of the same data: a stack of drawers that expand in
 * place, rather than a shrunken grid.
 *
 * The satellite cells are dropped entirely. They exist to make the desktop
 * composition feel deliberate, and at 375px they'd be meaningless — the same
 * call release-timeline-scroll.tsx makes when it swaps its pinned annotation
 * brackets for a plain list on mobile.
 */
export function DoorList({ items }: { items: Microcomponent[] }) {
    const [openId, setOpenId] = useState<string | null>(null)
    const reduceMotion = useReducedMotion()

    return (
        <div>
            {items.map((item) => {
                const isOpen = openId === item.id

                return (
                    <div key={item.id} className="border-t border-[#F0F0F0] last:border-b">
                        <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : item.id)}
                            aria-expanded={isOpen}
                            aria-controls={`${item.id}-drawer`}
                            className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2"
                        >
                            <span className="flex items-baseline gap-3">
                                <span className="font-mono text-sm tabular-nums text-[var(--text-tertiary)]">
                                    {item.num}
                                </span>
                                <span className="font-medium text-foreground">{item.name}</span>
                            </span>
                            <span
                                aria-hidden
                                className="shrink-0 text-lg leading-none text-[var(--text-tertiary)]"
                            >
                                {isOpen ? "−" : "+"}
                            </span>
                        </button>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    id={`${item.id}-drawer`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: reduceMotion ? 0 : 0.35,
                                        ease: appleEase,
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div
                                        className={`h-[260px] overflow-hidden rounded-lg border border-border ${STAGE_BG}`}
                                    >
                                        {item.render()}
                                    </div>
                                    {/* The note, not the blurb: there's no room for a
                                        side rail here, and the blurb is a repeat of
                                        what the closed row already said. */}
                                    {(item.note ?? item.blurb) && (
                                        <p className="pt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                                            {item.note ?? item.blurb}
                                        </p>
                                    )}
                                    <div className="pb-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}
