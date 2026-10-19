import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { InlinePasswordGate } from "@/components/inline-password-gate"
import { workProjects } from "@/components/projects"
import { ProjectTableOfContents } from "@/components/project-table-of-contents"
import { getWorkProjectPage } from "@/lib/work-project-pages"
import { HeroImage } from "@/components/hero-image"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return workProjects
    // /work/release-timeline is served by its own static route (the scroll page).
    // Money Jenga is a static route too, for its scroll story.
    .filter((project) => project.slug !== "release-timeline" && project.slug !== "money-jenga")
    .map((project) => ({
      slug: project.slug,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = workProjects.find((item) => item.slug === slug)
  const projectPage = getWorkProjectPage(slug)

  if (!project || !projectPage) {
    return { title: "Project Not Found" }
  }

  return {
    title: `${project.title} - Diana Tofan`,
    description: projectPage.description,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = workProjects.find((item) => item.slug === slug)
  const projectPage = getWorkProjectPage(slug)

  if (!project || !projectPage) {
    notFound()
  }

  const currentIndex = workProjects.findIndex((item) => item.slug === slug)
  const nextProject = workProjects[(currentIndex + 1) % workProjects.length]
  const nextProjectLabel = nextProject.navigationTitle ?? nextProject.title
  const postGateContent = projectPage.renderAfterGate?.()

  return (
    <main className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto grid grid-cols-12 gap-x-6 items-center">
          <div className="col-span-6 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[var(--text-secondary)] transition-colors duration-200"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </Link>
          </div>

          <div className="col-span-6 md:col-span-4 md:col-start-9 flex justify-end">
            <Link
              href={`/work/${nextProject.slug}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[var(--text-secondary)] transition-colors duration-200"
            >
              {`Next: ${nextProjectLabel}`}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-28">
        <div className="max-w-[1800px] mx-auto px-6">
          <HeroImage
            src={projectPage.heroImage ?? project.image}
            alt={`${project.title} cover`}
          />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3">
            <div className="col-span-4 md:col-span-8 md:col-start-3">
              {projectPage.readTime ? (
                <p className="mb-4 text-sm text-[var(--text-tertiary)]">
                  {[projectPage.published, projectPage.readTime].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <h1 className="text-3xl md:text-[48px] lg:text-[56px] font-medium leading-[1.08] tracking-tight text-foreground mb-12">
                {projectPage.displayTitle ?? project.title}
              </h1>

              {projectPage.subtitle ? (
                <p className="-mt-6 mb-12 max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
                  {projectPage.subtitle}
                </p>
              ) : null}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-border">
                {projectPage.meta.map((item) => (
                  <div key={item.label}>
                    <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                      {item.label}
                    </p>
                    <p className="text-base font-medium text-foreground">
                      {item.values.map((value, index) => (
                        <span key={`${item.label}-${value}`}>
                          {index > 0 && <br />}
                          {value}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>

              {!projectPage.story && projectPage.highlights && projectPage.highlights.length > 0 ? (
                <div className="pt-10">
                  <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)] mb-6">
                    At a glance
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {projectPage.highlights.map((item) => (
                      <div key={item.title} className="border-l-2 border-accent pl-4">
                        <dt className="text-lg font-medium text-foreground leading-snug">
                          {item.title}
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {item.description}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {projectPage.story ? (
        <section className="pb-24 md:pb-32">
          <div className="max-w-[1800px] mx-auto px-6">
            <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3">
              <ol className="col-span-4 md:col-span-8 md:col-start-3 space-y-16 md:space-y-24">
                {projectPage.story.map((step, index) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12"
                  >
                    <div className={step.visual ? "" : "lg:col-span-2 max-w-2xl"}>
                      <span className="font-mono text-sm tabular-nums text-[var(--text-tertiary)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                        {step.title}
                      </h2>
                      <div className="mt-4 space-y-3">
                        {step.text.map((paragraph) => (
                          <p key={paragraph} className="text-base leading-relaxed text-[var(--text-secondary)]">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                    {step.visual ? <div className="min-w-0">{step.visual}</div> : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : (
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3">
            <div className="hidden md:block col-span-3">
              <ProjectTableOfContents
                sections={projectPage.sections}
                projectSlug={project.slug}
                isPasswordProtected={project.isPasswordProtected}
              />
            </div>

            <div className="col-span-4 md:col-span-7 md:col-start-5 space-y-16">
              {projectPage.renderBeforeGate()}

              {postGateContent &&
                (project.isPasswordProtected ? (
                  <InlinePasswordGate enabled projectSlug={project.slug} correctPassword="pixies">
                    {postGateContent}
                  </InlinePasswordGate>
                ) : (
                  postGateContent
                ))}
            </div>
          </div>
        </div>
      </section>
      )}

      <Footer />
    </main>
  )
}
