import type React from "react"

export type Microcomponent = {
    id: string
    /** Zero-padded, matching the step-number idiom in release-timeline-scroll.tsx. */
    num: string
    name: string
    /** One line on the closed door. Shown only where the cell has room. */
    blurb?: string
    /**
     * A few words shown beside the component once the door is open — what it
     * solved, or the decision worth pointing at. Omitted where there's nothing
     * honest to say yet, in which case the opened panel is all component.
     */
    note?: string
    /** Desktop placement as CSS grid line numbers: [start, end]. */
    area: { row: [number, number]; col: [number, number] }
    /** The live, interactive component, rendered inside the opened door. */
    render: () => React.ReactNode
    /**
     * Optional inert rendering shown on the *closed* door, so a finished
     * component is visible on the homepage without opening anything. Must not
     * contain interactive elements: the cover it sits inside is itself a button.
     */
    preview?: () => React.ReactNode
}

/**
 * The house easing curve — fast start, long soft landing. Duplicated from
 * components/release-timeline-scroll.tsx rather than imported, so this section
 * doesn't pull in that 600-line module for four numbers.
 */
export const appleEase = [0.32, 0.72, 0, 1] as const

/**
 * The surface an opened component sits on. Owned here so the components don't
 * each paint their own background, and so the whole set changes in one place.
 */
export const STAGE_BG = "bg-[#f4f4f5]"
