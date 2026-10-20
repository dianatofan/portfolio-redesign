import Image from "next/image"
import type { WorkProjectPage } from "@/lib/work-project-pages"
import { LabHero, LabIntro, LabLog, LabSection, NextInLab } from "./lab-chrome"

/*
 * A short Lab post (a WorkProjectPage with a `story`) laid out as Lab
 * Project.dc.html: title and standfirst, the hero with the spec row under it,
 * then the story as a build log, and the next Lab post.
 */
export function LabStoryPage({
    page,
    title,
    image,
    year,
    next,
}: {
    page: WorkProjectPage
    title: string
    image: string
    year?: string
    next: { title: string; href: string; image: string }
}) {
    const specs = [
        ...page.meta.map((item) => ({ label: item.label, value: item.values.join(", ") })),
        ...(year ? [{ label: "Year", value: year }] : []),
    ]

    return (
        <>
            <LabIntro title={page.displayTitle ?? title} standfirst={page.subtitle} />

            {/* The design's hero is 600px tall in the 1200px column. */}
            <LabHero specs={specs}>
                <div className="relative aspect-[2/1] w-full bg-[#111113]">
                    <Image
                        src={page.heroImage ?? image}
                        alt={`${title} cover`}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1280px) 100vw, 1200px"
                    />
                </div>
            </LabHero>

            {page.story && (
                <LabSection label="Build log" rule>
                    <LabLog
                        entries={page.story.map((step, i) => ({
                            when: String(i + 1).padStart(2, "0"),
                            title: step.title,
                            text: step.text.join(" "),
                            // The design's log pictures are all 4:3, so each visual fills that box.
                            media: step.visual ? (
                                <div className="absolute inset-0 [&>*]:h-full [&>*]:aspect-auto!">{step.visual}</div>
                            ) : undefined,
                        }))}
                    />
                </LabSection>
            )}

            <NextInLab title={next.title} href={next.href} image={next.image} />
        </>
    )
}
