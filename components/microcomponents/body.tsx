"use client"

// Client-side because each entry carries a `render` function, and functions
// can't cross the server/client boundary as props.
//
// Split out of index.tsx so it can be loaded with `next/dynamic`: this module
// pulls in framer-motion's layout machinery, ai-composer.css and three preview
// component trees, none of which are visible when the homepage opens. Keeping
// them out of the initial bundle is what lets the hero's renderer start sooner.

import { AiComposer, AiComposerPreview } from "./ai-composer"
import { DoorGrid } from "./door-grid"
import { DoorList } from "./door-list"
import { HoldoutDiagram, HoldoutDiagramPreview } from "./holdout-diagram"
import { SwitchboardFilter, SwitchboardPreview } from "./switchboard-filter"
import type { Microcomponent } from "./types"

/*
 * Desktop placement, on a 5 x 3 grid. The three components tile it completely,
 * so there are no empty cells and nothing reads as padding:
 *
 *   ┌──────────────────────┬──────┬──────┐
 *   │                      │      │  ·01 │   01  3 wide x 2 tall
 *   │          01          │  02  ├──────┤   02  1 wide x 3 tall
 *   │                      │      │  ·02 │   03  3 wide x 1 tall
 *   ├──────────────────────┤      ├──────┤   ·   numbered satellites, col 5
 *   │          03          │      │  ·03 │
 *   └──────────────────────┴──────┴──────┘
 *
 * The narrow 02 wedged between the two large blocks is what keeps this from
 * settling into a card grid. Array order drives both the numbering and the
 * satellite rows, so reordering here renumbers everything and still reads
 * left-to-right, top-to-bottom.
 */
export const microcomponents: Microcomponent[] = [
    {
        id: "pulsing-conversation",
        num: "01",
        name: "Animated conversation",
        blurb: "A drafted reply that breathes while it thinks.",
        note: "An AI suggested response above an agent's reply box. I wanted a moving, breathing gradient underneath it to draw attention without competing for it.",
        area: { row: [1, 3], col: [1, 4] },
        // The draft text wraps to seven lines on a narrow phone, and the panel
        // grows again when the body expands, so 260px clipped both the header and
        // the reply box. Measured peak including the stage's own padding: 533px at
        // 320px, 491px at 390px, 470px at 430px, 408px from 608px up (where the
        // panel stops widening).
        mobileStageClass: "h-[540px] min-[430px]:h-[480px] sm:h-[420px]",
        render: () => <AiComposer />,
        preview: () => <AiComposerPreview />,
    },
    {
        id: "switchboard-filter",
        num: "02",
        name: "Switchboard filter",
        // Kept general: statuses are just the instance that shipped, the pattern
        // works for any small set. Short, too, since this cell is one column wide.
        blurb: "Multi-select you can read at a glance.",
        note: "An alternative to a multi-select dropdown, which collapses your choices into a count chip and hides which ones. Inspired by lights switching on and off.",
        area: { row: [1, 4], col: [4, 5] },
        render: () => <SwitchboardFilter />,
        preview: () => <SwitchboardPreview />,
    },
    {
        id: "illustrated-tutorial",
        num: "03",
        name: "Illustrated tutorial",
        // No jargon: holdout / control / treatment mean nothing outside A/B
        // testing, and this caption has to land with someone who has never seen
        // the product. Describe what it does instead of what it shows.
        blurb: "An animated illustration that replaces hefty text.",
        note: "An illustrated tutorial explaining how players in a game are divided during an AB test, to replace hefty text no one reads.",
        area: { row: [3, 4], col: [1, 4] },
        render: () => <HoldoutDiagram />,
        preview: () => <HoldoutDiagramPreview />,
    },
]

/**
 * One dataset, two renderings — a grid of doors with room to hover, a stack of
 * drawers where there isn't.
 *
 * Default export so `next/dynamic` can pick it up without a selector.
 */
export default function MicrocomponentsBody() {
    return (
        <>
            <div className="hidden lg:block">
                <DoorGrid items={microcomponents} />
            </div>
            <div className="lg:hidden">
                <DoorList items={microcomponents} />
            </div>
        </>
    )
}
