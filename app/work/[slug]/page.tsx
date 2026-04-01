import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { InlinePasswordGate } from "@/components/inline-password-gate"
import { workProjects } from "@/components/projects"
import { ProjectTableOfContents } from "@/components/project-table-of-contents"
import { getWorkProjectPage } from "@/lib/work-project-pages"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return workProjects.map((project) => ({
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
              Next: Game Setup Automation
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
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-card">
            <Image
              src={project.image}
              alt={`${project.title} cover`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3">
            <div className="col-span-4 md:col-span-8 md:col-start-3">
              <h1 className="text-3xl md:text-[48px] lg:text-[56px] font-medium leading-[1.08] tracking-tight text-foreground text-balance mb-12">
                {project.title}
              </h1>

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
            </div>
          </div>
        </div>
      </section>

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

      <Footer />
    </main>
  )
}
