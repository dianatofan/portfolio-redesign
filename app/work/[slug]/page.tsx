import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { projects } from "@/components/projects"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title} - Diana Tofan`,
    description: project.title,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
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

          {project.tags.length > 0 && (
            <div className="flex items-center gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-[var(--text-secondary)] border border-border rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-4 md:grid-cols-12 gap-x-6">
            <div className="col-span-4 md:col-span-8 md:col-start-3">
              <h1 className="text-3xl md:text-[48px] lg:text-[56px] font-bold leading-[1.1] tracking-tight text-foreground text-balance">
                {project.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Featured image */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-card">
            <Image
              src={project.image}
              alt={`${project.title} project preview`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Content placeholder */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-4 md:grid-cols-12 gap-x-6">
            <div className="col-span-4 md:col-span-6 md:col-start-4">
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                    Overview
                  </h2>
                  <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                    This case study explores the design process and decisions made
                    during the project. More detailed content coming soon.
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                    Role
                  </h2>
                  <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                    Senior Product Designer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
