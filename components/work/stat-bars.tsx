"use client"

import { useRef } from "react"
import { useViewProgress } from "@/lib/use-view-progress"

/*
 * A result figure, as in the Project Pages design: the figure and its label
 * fade up as they scroll in, and for a "fewer / faster" percentage the Before
 * and After bars grow out from the left with the scroll, After stopping short
 * by the percentage saved. Scrolling back runs it in reverse; reduced motion
 * shows it finished.
 */
export function StatBars({ value, label }: { value: string; label: string }) {
    const ref = useRef<HTMLDivElement>(null)
    // The design's ranges: the block reveals over entry 0% → cover 22%, the
    // bars grow over entry 10% → cover 40%.
    const reveal = useViewProgress(ref, 0, 22)
    const grow = useViewProgress(ref, 10, 40)

    const n = parseFloat(value.replace(/[^\d.,]/g, "").replace(",", "."))
    const fewer = value.endsWith("%") && /fewer|faster|less|reduc/i.test(label) && !Number.isNaN(n)

    return (
        <div
            ref={ref}
            className="flex flex-col gap-3.5 border-t border-ink pt-4"
            style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 14}px)` }}
        >
            <span className="text-[clamp(40px,5.2vw,80px)] font-medium leading-none tracking-[-0.055em] tabular-nums">{value}</span>
            <span className="text-[15px] text-ink-muted">{label}</span>
            {fewer && (
                <div aria-hidden="true" className="flex flex-col gap-2 pt-1.5 text-[13px]">
                    <div className="grid grid-cols-[52px_1fr] items-center gap-2.5 text-ink-meta">
                        <span>Before</span>
                        <span className="h-2.5 origin-left rounded-full bg-[#c9c8d0]" style={{ transform: `scaleX(${grow})` }} />
                    </div>
                    <div className="grid grid-cols-[52px_1fr] items-center gap-2.5">
                        <span>After</span>
                        <span
                            className="h-2.5 origin-left rounded-full bg-brand"
                            style={{ width: `${100 - n}%`, transform: `scaleX(${grow})` }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
