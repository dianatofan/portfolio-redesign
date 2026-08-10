import { ProjectCard } from "./project-card"
import { ImageSlideGallery } from "./image-slide-gallery"

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
}

export const workProjects: readonly WorkProject[] = [
    {
        slug: "liveops-alerting",
        title: "Designing a LiveOps alerting system to reduce production incidents",
        navigationTitle: "LiveOps Alerting",
        image: "/images/project-liveops.png",
        homepageImage: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_100/v1775046661/project-liveops.png",
        tags: ["2025", "Tactile Games"],
        featured: true,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
    },
    {
        slug: "game-setup-automation",
        title: "Automating game setup for scalable releases",
        navigationTitle: "Game Setup Automation",
        image: "https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610293/game-canvas-cover.png",
        homepageImage:
            "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto,dpr_auto,c_fill,g_auto,w_1400,h_933/v1769610278/thumbnail9.png",
        tags: ["2025", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
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
    },
    {
        slug: "release-timeline",
        title: "Visualizing release impact across live games",
        navigationTitle: "Release Timeline",
        image: "/images/release-timeline-thumb.png",
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
    {
        title: "Visualizing release impact across live games",
        src: "/images/release-timeline-thumb.png",
        href: "/work/release-timeline",
        tags: ["2026", "Tactile Games"],
        subtitle: "A release timeline inside the LiveOps Dashboard, prototyped in code, to cut debugging time.",
    },
    {
        title: "Human Redundancy Terminal",
        src: "/images/fun-human-redundancy.png",
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
                        isPasswordProtected={false}
                        showCaptionTags={false}
                        eager={index < 2}
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
            <ImageSlideGallery projects={[...builtInCodeProjects]} />
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
                </div>
            </div>
        </section>
    )
}