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
        homepageImage: "/images/project-game-setup.png",
        tags: ["2025", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
    },
    {
        slug: "travel-planning",
        title: "Reimagining travel planning on Google Search",
        navigationTitle: "Google Travel",
        image: "/images/project-travel.png",
        tags: ["2024", "Google"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
    },
    {
        slug: "game-setup-v2",
        title: "Building a design system to eliminate design debt",
        navigationTitle: "Design System",
        image: "/images/project-famly.png",
        tags: ["2024", "Famly"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
    },
] as const

export const projects = workProjects

const funGalleryProjects = [
    {
        title: "Human Redundancy Terminal",
        src: "/images/fun-human-redundancy.png",
        href: "https://dianatofan.github.io/risk-assessment-terminal",
        year: "2026",
        subtitle: "Will AI take my job? An apocalyptic, glitchy CRT terminal with dark humor, built with Kaggle data and Google AI Studio.",
    },
] as const

function WorkSection() {
    return (
        <section className="space-y-6 md:space-y-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                Work
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                {workProjects.slice(0, 4).map((project) => (
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
                    />
                ))}
            </div>
        </section>
    )
}

export function Projects() {
    return (
        <section id="work" className="relative z-20 pb-16 md:pb-24">
            <div className="mx-auto w-full max-w-[1800px] px-6">
                <div className="space-y-16 md:space-y-20">
                    <WorkSection />

                    <section id="fun" className="space-y-6 md:space-y-8">
                        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                            Fun
                        </h2>
                        <ImageSlideGallery projects={[...funGalleryProjects]} />
                    </section>
                </div>
            </div>
        </section>
    )
}