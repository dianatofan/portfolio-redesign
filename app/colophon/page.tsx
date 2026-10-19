import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
    title: "Colophon - Diana Tofan",
    description:
        "How dianatofan.net was designed and built: typefaces, stack, performance decisions, and what AI did.",
}

/*
 * Same two-column grid as /about: a short label on the left (cols 1-3) and the
 * content aligned with the hero headline on the right (cols 6-12).
 */
const sections: Array<{ id: string; label: string; body: React.ReactNode }> = [
    {
        id: "type",
        label: "Type",
        body: (
            <p>
                Set in Saans by Displaay, in Regular and Medium. Icons are Material Symbols,
                subset down to the twenty glyphs the site uses and self-hosted, so no icon font
                ever blocks the first paint.
            </p>
        ),
    },
    {
        id: "stack",
        label: "Stack",
        body: (
            <ul className="list-disc pl-5 space-y-1">
                <li>Next.js 16 and React 19, styled with Tailwind CSS 4</li>
                <li>Framer Motion for layout animation in the microcomponents</li>
                <li>Canvas 2D for the untangle graph in the hero, with no 3D library</li>
                <li>Cloudinary for case-study images and video</li>
                <li>PostHog and Vercel Analytics to see what people actually open</li>
            </ul>
        ),
    },
    {
        id: "craft",
        label: "Details I sweated",
        body: (
            <ul className="list-disc pl-5 space-y-1">
                <li>
                    The Copenhagen clock is painted by a tiny inline script during HTML parse, so
                    it never flashes “...” while React loads.
                </li>
                <li>
                    Case-study covers are preloaded together. Waiting on hydration made them appear
                    over a second late on the live site.
                </li>
                <li>
                    Microcomponents, card preview videos and other heavy pieces only load once you
                    scroll or hover towards them.
                </li>
                <li>
                    Everything that moves respects your reduced-motion setting. The hero graph
                    still works, it just settles without animating.
                </li>
            </ul>
        ),
    },
    {
        id: "ai",
        label: "What AI did",
        body: (
            <>
                <p>
                    I built this site with Claude Code as a pair programmer. Around a third of the
                    commits were written together with it, mostly performance passes, refactors and
                    fixing things on phones.
                </p>
                <p className="mt-4">
                    The design, the case studies and the copy are mine. When a suggestion made the
                    site feel more generic, or traded craft for convenience, I changed it or threw
                    it out.
                </p>
            </>
        ),
    },
    {
        id: "timeline",
        label: "Timeline",
        body: (
            <p>
                This version started in February 2026 and is still changing. I ship small
                improvements as I go, instead of waiting for a finished redesign.
            </p>
        ),
    },
]

export default function ColophonPage() {
    return (
        <main>
            <Header />
            <section className="pt-28 pb-16 md:pb-24">
                <div className="w-full mx-auto px-6">
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3 mb-16 md:mb-24">
                        <div className="col-span-4 md:col-span-7 md:col-start-6">
                            <h1 className="text-4xl md:text-[36px] lg:text-[48px] font-medium leading-[1.08] text-foreground text-balance tracking-tight max-w-[840px]">
                                How this site was made
                            </h1>
                        </div>
                    </div>

                    {sections.map((section) => (
                        <div
                            key={section.id}
                            id={section.id}
                            className="grid grid-cols-4 md:grid-cols-12 gap-x-3 border-t border-[#F0F0F0] pt-12 md:pt-16 mb-12 md:mb-16"
                        >
                            <div className="col-span-4 md:col-span-3 mb-6 md:mb-0">
                                <h2 className="text-base font-medium text-foreground">
                                    {section.label}
                                </h2>
                            </div>
                            <div className="col-span-4 md:col-span-7 md:col-start-6">
                                <div className="max-w-[680px] text-base leading-relaxed text-[var(--text-secondary)]">
                                    {section.body}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </main>
    )
}
