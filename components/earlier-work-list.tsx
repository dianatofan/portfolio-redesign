"use client"

import dynamic from "next/dynamic"
import { DeferUntilNear } from "@/components/defer-until-near"

// Same hover-preview rows as the Built in Code gallery, loaded the same way:
// gsap and framer-motion stay out of the initial bundle until the visitor
// scrolls near. See built-in-code-gallery.tsx.
const ImageSlideGallery = dynamic(
    () => import("./image-slide-gallery").then((m) => m.ImageSlideGallery),
    { ssr: false }
)

type EarlierWorkRow = {
    title: string
    src: string
    href: string
    tags: readonly string[]
    subtitle?: string
}

export function EarlierWorkList({ projects }: { projects: EarlierWorkRow[] }) {
    return (
        /*
         * Reserve is the measured height of two rows: about 106px each from `lg`
         * up, taller as titles and outcomes wrap on narrower screens.
         */
        <DeferUntilNear className="min-h-[340px] sm:min-h-[260px] lg:min-h-[212px]">
            <ImageSlideGallery projects={projects} />
        </DeferUntilNear>
    )
}
