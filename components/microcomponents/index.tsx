"use client"

import dynamic from "next/dynamic"
import { DeferUntilNear } from "@/components/defer-until-near"

/*
 * The heading and the section wrapper live in components/projects.tsx, in the
 * initial HTML, so `#microcomponents` stays a valid anchor target.
 *
 * Everything with weight — the data array, both renderings, framer-motion's
 * layout animations, ai-composer.css — lives in ./body and arrives only once the
 * visitor is scrolling towards it.
 */
const MicrocomponentsBody = dynamic(() => import("./body"), { ssr: false })

export function Microcomponents() {
    return (
        // Reserves the board's height so the footer doesn't jump when it mounts.
        <DeferUntilNear mountOnHash="microcomponents" className="min-h-[760px] min-[62.5rem]:min-h-[584px]">
            <MicrocomponentsBody />
        </DeferUntilNear>
    )
}
