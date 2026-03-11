import { ProjectCard } from "./project-card"

export const projects = [
    {
        slug: "liveops-alerting",
        title: "Designing a LiveOps alerting system to reduce production incidents",
        image: "/images/project-liveops.png",
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

export function Projects() {
    return (
        <section id="work" className="relative z-20 pb-16 md:pb-24">
            <div className="mx-auto w-full max-w-[1800px] px-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                    {projects.slice(0, 4).map((project) => (
                        <ProjectCard
                            key={project.slug}
                            title={project.title}
                            image={project.image}
                            tags={[...project.tags]}
                            href={`/work/${project.slug}`}
                            featured={false}
                            aspectClass={project.aspect}
                            showCaptionTags={false}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}