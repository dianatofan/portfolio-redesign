"use client"

import dynamic from "next/dynamic"
import { DeferUntilNear } from "@/components/defer-until-near"

/*
 * ImageSlideGallery is the heaviest thing below the fold: it pulls in gsap *and*
 * framer-motion, portals a hover preview, and owns two of the six images the
 * homepage requests. None of that is visible on arrival, so it loads when the
 * visitor approaches it instead of competing with the hero for the main thread.
 */
const ImageSlideGallery = dynamic(
    () => import("./image-slide-gallery").then((m) => m.ImageSlideGallery),
    { ssr: false }
)

type GalleryProject = {
    title: string
    src: string
    href?: string
    newTab?: boolean
    year?: string
    tags?: readonly string[]
    subtitle?: string
}

export function BuiltInCodeGallery({ projects }: { projects: GalleryProject[] }) {
    return (
        /*
         * mountOnHash is load-bearing here, not a nicety: #built-in-code is the
         * "Back" target for /prototypes/* and /fun/*, so someone returning from
         * those pages must land on the gallery rather than on its reserved space.
         *
         * Reserve is the measured height of the three rows: 318px from `lg` up,
         * then taller as titles wrap — 378px at `md`, 430px at `sm`, and ~520px
         * on phones, where each row's year/tags drop onto their own line.
         */
        <DeferUntilNear
            mountOnHash="built-in-code"
            className="min-h-[520px] sm:min-h-[430px] md:min-h-[378px] lg:min-h-[318px]"
        >
            <ImageSlideGallery projects={projects} />
        </DeferUntilNear>
    )
}
