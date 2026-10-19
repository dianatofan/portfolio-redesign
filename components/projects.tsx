import { ProjectCard } from "./project-card"
import { BuiltInCodeGallery } from "./built-in-code-gallery"
import { EarlierWorkList } from "./earlier-work-list"
import { Microcomponents } from "./microcomponents"

type WorkProject = {
    slug: string
    title: string
    navigationTitle?: string
    image: string
    homepageImage?: string
    tags: string[]
    featured: boolean
    aspect: string
    isPasswordProtected: boolean
    category?: "work" | "experiment"
    // Older studies drop out of the tile grid into compact hover rows under
    // "Earlier work", so current work gets the visual weight.
    earlier?: boolean
    // Headline result shown under the card title. Taken from the case study's own
    // Impact section, so the number on the card always matches the page.
    outcome?: string
    // Only for work that went out to real users. Concept and research work leaves
    // it unset rather than claiming a launch it didn't have.
    shipped?: boolean
    // Looping interface clip that plays over the cover on hover, so the card shows
    // the product running instead of a still.
    previewVideo?: string
}

export const workProjects: readonly WorkProject[] = [
    {
        slug: "dianas-diamonds",
        title: "Building a prototype library to scale AI-driven design",
        navigationTitle: "Diana's Diamonds",
        image: "/images/dianas-diamonds/field-13-card@2x.webp",
        // Full-width card on the homepage, so it uses the 21:9 hub capture.
        homepageImage: "/images/dianas-diamonds/hero-13-21x9@2x.webp",
        tags: ["2026", "Tactile Games"],
        featured: true,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
        outcome: "16 AI-built prototypes in one library, with handoff to developers built in",
        shipped: true,
        previewVideo: "/images/dianas-diamonds/field-real.mp4",
    },
    {
        slug: "liveops-alerting",
        title: "Designing a LiveOps alerting system to reduce production incidents",
        navigationTitle: "LiveOps Alerting",
        image: "/images/project-liveops.webp",
        homepageImage: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1775046661/project-liveops.png",
        tags: ["2025", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
        outcome: "22% fewer production incidents, critical failures caught in minutes",
        shipped: true,
        previewVideo: "https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610317/homepage-video.mp4",
    },
    {
        slug: "game-setup-automation",
        title: "Automating game setup for scalable releases",
        navigationTitle: "Game Setup Automation",
        image: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1769610293/game-canvas-cover.png",
        homepageImage:
            "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto,dpr_auto,c_fill,g_auto,w_1400,h_933/v1769610278/thumbnail9.png",
        tags: ["2025", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
        outcome: "About 2x faster game setup and 3 more games launched per quarter",
        shipped: true,
        previewVideo: "https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610262/step1-demo.mp4",
    },
    {
        slug: "travel-planning",
        title: "Reimagining travel planning on Google Search",
        navigationTitle: "Google Travel",
        image:
            "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto,dpr_auto,c_fill,g_auto,w_1400,h_933/v1769610291/thumbnail5.png",
        tags: ["2024", "Google"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
        earlier: true,
        outcome: "Concepts adopted into the 2024 Google Search roadmap",
    },
    {
        slug: "design-system",
        title: "Building a design system to eliminate design debt",
        navigationTitle: "Design System",
        image:
            "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto,dpr_auto,c_fill,g_auto,w_1400,h_933/v1769610306/famlyThumbnail.png",
        tags: ["2024", "Famly"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
        earlier: true,
        outcome: "35% faster UI development and 18% fewer support calls",
        shipped: true,
    },
    {
        slug: "release-timeline",
        title: "Visualizing release impact across live games",
        navigationTitle: "Release Timeline",
        image: "/images/release-timeline-thumb.webp",
        tags: ["2026", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
        category: "experiment",
    },
    // Side projects use the case-study template but stay out of the Case Studies
    // grid (category "experiment"); the Built in Code list links to them.
    {
        slug: "money-jenga",
        title: "Money Jenga",
        image: "/images/money-jenga-screens.webp",
        tags: ["2026", "Side project"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
        category: "experiment",
    },
    {
        slug: "golden-goose-museum",
        title: "Golden Goose Digital Museum",
        image: "/images/golden-goose-hero.webp",
        tags: ["2026", "Side project"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
        category: "experiment",
    },
] as const

export const projects = workProjects

// Rows for the "Built in Code" gallery. `src` is the image that follows the
// cursor on hover, so every entry needs a real screenshot — a placeholder would
// show up as the dashed "missing image" box mid-hover.
const builtInCodeProjects = [
    // `tags` rather than `year`: the gallery's right-hand column joins tags when
    // no year is set, which is how each row states its context — client work vs
    // a personal side project.
    //
    // Newest first: add new projects at the top.
    {
        title: "Golden Goose Digital Museum",
        src: "/images/golden-goose-colourways.webp",
        href: "/work/golden-goose-museum",
        tags: ["2026", "Side project"],
        subtitle: "Seven 3D Superstar sneakers for a digital museum, and the AI-assisted part painter I built to make them.",
    },
    {
        title: "Money Jenga",
        src: "/images/money-jenga-screens.webp",
        href: "/work/money-jenga",
        tags: ["2026", "Side project"],
        subtitle: "An iPhone budget app where every purchase pulls a block out of a tower of cash. Built in SwiftUI with Claude Code.",
    },
    {
        title: "Beouf Salad Decorator",
        src: "/images/fun-boeuf-salad-decorator.webp",
        href: "/work/boeuf-salad-decorator",
        tags: ["2026", "Side project"],
        subtitle: "A playful web app that turns the Romanian tradition of over-decorated Christmas salads into shareable retro holiday cards.",
    },
    {
        title: "Visualizing release impact across live games",
        src: "/images/release-timeline-thumb.webp",
        href: "/work/release-timeline",
        tags: ["2026", "Tactile Games"],
        subtitle: "A release timeline inside the LiveOps Dashboard, prototyped in code, to cut debugging time.",
    },
    {
        title: "Human Redundancy Terminal",
        src: "/images/fun-human-redundancy.webp",
        href: "https://dianatofan.github.io/risk-assessment-terminal",
        tags: ["2026", "Side project"],
        subtitle: "An apocalyptic, glitchy CRT terminal with dark humor, built with Kaggle data and Google AI Studio.",
    },
] as const

function WorkSection() {
    const caseStudies = workProjects.filter((project) => project.category !== "experiment")
    const currentStudies = caseStudies.filter((project) => !project.earlier)
    const earlierStudies = caseStudies.filter((project) => project.earlier)

    return (
        <section className="space-y-6 md:space-y-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                Case Studies
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                {currentStudies.map((project) => (
                    /*
                     * The featured study spans both columns, which also keeps an odd
                     * number of case studies from leaving one card alone on a row.
                     */
                    <div key={project.slug} className={project.featured ? "md:col-span-2" : undefined}>
                        <ProjectCard
                            title={project.title}
                            image={project.homepageImage ?? project.image}
                            tags={[...project.tags]}
                            href={`/work/${project.slug}`}
                            featured={project.featured}
                            aspectClass={project.featured ? "aspect-[3/2] md:aspect-[21/9]" : project.aspect}
                            isPasswordProtected={project.isPasswordProtected}
                            outcome={project.outcome}
                            shipped={project.shipped}
                            previewVideo={project.previewVideo}
                            showCaptionTags={false}
                            /*
                             * All of them, not the first two. These are the page's
                             * primary content, and holding two of them back meant they
                             * could not begin downloading until React had hydrated and
                             * then queued behind it — measured on the live site at
                             * ~1.4-1.8s to appear, against ~140ms of actual transfer
                             * for the two that were preloaded. Preloading them all
                             * starts every card at around 420ms instead.
                             */
                            eager
                        />
                    </div>
                ))}
            </div>

            {earlierStudies.length > 0 ? (
                <div className="space-y-2 pt-6 md:pt-10">
                    <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                        Earlier work
                    </h3>
                    <EarlierWorkList
                        projects={earlierStudies.map((project) => ({
                            title: project.title,
                            src: project.image,
                            href: `/work/${project.slug}`,
                            // Company first: "Google · 2024" reads as context at a glance.
                            tags: [...project.tags].reverse(),
                            subtitle: project.outcome,
                        }))}
                    />
                </div>
            ) : null}
        </section>
    )
}

function BuiltInCodeSection() {
    return (
        // id kept in sync with the "Back" links on /prototypes/* and /fun/*.
        <section id="built-in-code" className="space-y-6 md:space-y-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                Built in Code
            </h2>
            <BuiltInCodeGallery projects={[...builtInCodeProjects]} />
        </section>
    )
}

export function Projects() {
    return (
        <section id="work" className="relative z-20 pb-16 md:pb-24">
            <div className="mx-auto w-full max-w-[1800px] px-6">
                <div className="space-y-16 md:space-y-20">
                    <WorkSection />

                    <BuiltInCodeSection />

                    <Microcomponents />
                </div>
            </div>
        </section>
    )
}