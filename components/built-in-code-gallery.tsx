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
         * Reserve is the measured height — 212px from `lg` up, 408px below, where
         * the rows wrap.
         */
        <DeferUntilNear mountOnHash="built-in-code" className="min-h-[408px] lg:min-h-[212px]">
            <ImageSlideGallery projects={projects} />
        </DeferUntilNear>
    )
}
