"use client"

import dynamic from "next/dynamic"
import { DeferUntilNear } from "@/components/defer-until-near"

/*
 * The heading and the section wrapper stay here, in the initial HTML: they cost
 * almost nothing, they keep `#microcomponents` a valid anchor target, and they
 * keep the section legible to crawlers.
 *
 * Everything with weight — the data array, both renderings, framer-motion's
 * layout animations, ai-composer.css — lives in ./body and arrives only once the
 * visitor is scrolling towards it.
 */
const MicrocomponentsBody = dynamic(() => import("./body"), { ssr: false })

export function Microcomponents() {
    return (
        <section id="microcomponents" className="space-y-6 md:space-y-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                Microcomponents
            </h2>

            {/* Reserve matches the measured body height at each breakpoint — 640px
                for the desktop grid, ~200px for the mobile drawer list — so the
                footer doesn't jump when the body mounts. */}
            <DeferUntilNear
                mountOnHash="microcomponents"
                className="min-h-[200px] lg:min-h-[640px]"
            >
                <MicrocomponentsBody />
            </DeferUntilNear>
        </section>
    )
}
