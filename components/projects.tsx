import { ProjectCard } from "./project-card"
import { BuiltInCodeGallery } from "./built-in-code-gallery"
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
        slug: "liveops-alerting",
        title: "Designing a LiveOps alerting system to reduce production incidents",
        navigationTitle: "LiveOps Alerting",
        image: "/images/project-liveops.webp",
        homepageImage: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1775046661/project-liveops.png",
        tags: ["2025", "Tactile Games"],
        featured: true,
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
        title: "Beouf Salad Decorator",
        src: "/images/fun-boeuf-salad-decorator.webp",
        // Static build lives in public/salata-de-boeuf/. Full file path, because
        // Next serves public/ files as-is and won't resolve a folder to index.html.
        href: "/salata-de-boeuf/index.html",
        newTab: true,
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
    const caseStudies = workProjects.filter((project) => project.category !== "experiment").slice(0, 6)

    return (
        <section className="space-y-6 md:space-y-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                Case Studies
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                {caseStudies.map((project, index) => (
                    <ProjectCard
                        key={project.slug}
                        title={project.title}
                        image={project.homepageImage ?? project.image}
                        tags={[...project.tags]}
                        href={`/work/${project.slug}`}
                        featured={false}
                        aspectClass={project.aspect}
                        isPasswordProtected={project.isPasswordProtected}
                        outcome={project.outcome}
                        shipped={project.shipped}
                        previewVideo={project.previewVideo}
                        showCaptionTags={false}
                        /*
                         * All four, not the first two. These are the page's
                         * primary content, and holding two of them back meant they
                         * could not begin downloading until React had hydrated and
                         * then queued behind it — measured on the live site at
                         * ~1.4-1.8s to appear, against ~140ms of actual transfer
                         * for the two that were preloaded. Preloading them all
                         * starts every card at around 420ms instead.
                         */
                        eager
                    />
                ))}
            </div>
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