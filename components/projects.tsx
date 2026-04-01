import { ProjectCard } from "./project-card"

type WorkProject = {
    slug: string
    title: string
    image: string
    homepageImage?: string
    tags: string[]
    featured: boolean
    aspect: string
    isPasswordProtected: boolean
}

type FunAppProject = {
    title: string
    image: string
    tags: string[]
    href?: string
    aspect: string
}

export const workProjects: readonly WorkProject[] = [
    {
        slug: "liveops-alerting",
        title: "Designing a LiveOps alerting system to reduce production incidents",
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
        image: "/images/project-game-setup.png",
        tags: ["2025", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
    },
    {
        slug: "travel-planning",
        title: "Reimagining travel planning on Google Search",
        image: "/images/project-travel.png",
        tags: ["2024", "Google"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
    },
    {
        slug: "game-setup-v2",
        title: "Building a design system to eliminate design debt",
        image: "/images/project-famly.png",
        tags: ["2024", "Famly"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
    },
] as const

export const projects = workProjects

export const funAppProjects: readonly FunAppProject[] = [
    {
        title: "Human Redundancy Terminal",
        image: "/images/fun-human-redundancy.png",
        tags: ["Data Analytics", "Kaggle", "AI"],
        href: "/fun/human-redundancy-terminal",
        aspect: "aspect-[16/10]",
    },
] as const

function ProjectSection({
    id,
    title,
    projects,
    emptyTitle,
    emptyDescription,
}: {
    id?: string
    title: string
    projects: readonly FunAppProject[]
    emptyTitle: string
    emptyDescription: string
}) {
    return (
        <section id={id} className="space-y-6 md:space-y-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                {title}
            </h2>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.title}
                            title={project.title}
                            image={project.image}
                            tags={project.tags}
                            href={project.href}
                            featured={false}
                            aspectClass={project.aspect}
                            showCaptionTags={false}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-card/40 px-6 py-10 md:px-8 md:py-12">
                    <p className="text-lg font-medium text-foreground">{emptyTitle}</p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                        {emptyDescription}
                    </p>
                </div>
            )}
        </section>
    )
}

export function Projects() {
    return (
        <section id="work" className="relative z-20 pb-16 md:pb-24">
            <div className="mx-auto w-full max-w-[1800px] px-6">
                <div className="space-y-16 md:space-y-20">
                    <ProjectSection
                        title="Work"
                        projects={workProjects.slice(0, 4).map((project) => ({
                            title: project.title,
                            image: project.homepageImage ?? project.image,
                            tags: [...project.tags],
                            href: `/work/${project.slug}`,
                            aspect: project.aspect,
                        }))}
                        emptyTitle="No work projects yet"
                        emptyDescription="Your case studies will show up here."
                    />

                    <ProjectSection
                        id="fun"
                        title="Fun"
                        projects={funAppProjects}
                        emptyTitle="Fun apps coming soon"
                        emptyDescription="This section is ready for your playful experiments, prototypes, and vibecoded side projects."
                    />
                </div>
            </div>
        </section>
    )
}