import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { InlinePasswordGate } from "@/components/inline-password-gate"
import { workProjects } from "@/components/projects"
import { ProjectTableOfContents } from "@/components/project-table-of-contents"
import { getWorkProjectPage } from "@/lib/work-project-pages"
import { HeroImage } from "@/components/hero-image"
import { ScrollFade } from "@/components/scroll-fade"
import { LabStoryPage } from "@/components/work/lab-story-page"
import { withSectionLabels } from "@/components/case-study-sections"
import type { WorkProjectHighlight } from "@/lib/work-project-pages/types"

/*
 * The stat band shows a big figure over a short label ("16" / "AI-built
 * prototypes in one library"). Highlights are written as one line, so the
 * band takes the ones that lead with a number and splits it off: "35% faster
 * UI development" becomes "35%" over "faster UI development". The rest are
 * still in each study's Impact section.
 */
function toStats(highlights: WorkProjectHighlight[]) {
  return highlights
    .flatMap((item) => {
      const match = item.title.match(/^([~+]?\d[\d.,]*(?:%|x|\+)?)\s+(.+)$/)
      return match ? [{ value: match[1], label: match[2] }] : []
    })
    .slice(0, 3)
}

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

  const isLab = project.category === "experiment"
  // Next of the same kind: case studies lead to case studies, Lab posts to Lab posts.
  const siblings = workProjects.filter((item) => (item.category === "experiment") === isLab)
  const siblingIndex = siblings.findIndex((item) => item.slug === slug)
  const nextProject = siblings[(siblingIndex + 1) % siblings.length]
  const prevProject = siblings[(siblingIndex - 1 + siblings.length) % siblings.length]
  const postGateContent = projectPage.renderAfterGate?.()
  const shortTitle = project.navigationTitle ?? project.title
  const metaLine = [
    isLab ? "Lab" : "Case study",
    project.tags.find((tag) => !/^\d{4}$/.test(tag)),
    projectPage.published,
    projectPage.readTime,
  ]
    .filter(Boolean)
    .join(" · ")
  const stats = toStats(projectPage.highlights ?? [])
  // Case Study v3 (Diana's Diamonds): see WorkProjectPage.layout.
  const v3 = projectPage.layout === "v3"
  // LiveOps layout: see WorkProjectPage.layout.
  const v4 = projectPage.layout === "v4"
  const COL = "px-[max(var(--gutter),calc((100%-1200px)/2))]"

  // Short Lab posts have their own layout (Lab Project.dc.html).
  if (projectPage.story) {
    return (
      <main className="min-h-screen bg-white text-ink">
        <Header />
        <LabStoryPage
          page={projectPage}
          title={project.title}
          image={project.image}
          year={project.tags.find((tag) => /^\d{4}$/.test(tag))}
          next={{ title: nextProject.title, href: `/work/${nextProject.slug}`, image: nextProject.image }}
        />
        <Footer />
      </main>
    )
  }

  return (
    // The hero is Fig. 1; figures in the body count on from there. A v4 hero has
    // no caption, so its body starts at Fig. 1.
    <main className={`min-h-screen bg-white text-ink ${v4 ? "[counter-reset:fig_0]" : "[counter-reset:fig_1]"}`}>
      <Header />

      {/* The work first: back link, then the hero, then the headline as its caption. */}
      <div className={`flex flex-col gap-6 px-gutter ${v3 ? "pt-6" : "pt-8 min-[720px]:pt-10"}`}>
        {/* Case studies go back through the header breadcrumb; Lab posts keep their link. */}
        {isLab && (
          <Link href="/#lab" className="self-start text-[13px] text-ink-meta transition-colors hover:text-brand">
            ← Lab
          </Link>
        )}
        <figure className={`flex flex-col ${v3 ? "gap-3" : "gap-2.5"}`}>
          <HeroImage
            src={projectPage.heroImage ?? project.image}
            video={projectPage.heroVideo}
            alt={`${project.title} cover`}
            radius={v3 || v4 ? "rounded-[20px]" : undefined}
            className={v4 ? "max-h-[88vh]" : ""}
          />
          {!v4 && (
          <figcaption className={`${v3 ? "" : "max-w-[640px] "}text-[13px] text-ink-meta`}>
            {projectPage.heroCaptionLabel ? (
              <>
                <span className="text-ink">{projectPage.heroCaptionLabel}</span> {projectPage.heroCaption}
              </>
            ) : (
              <>
                <span className="text-ink">Fig. 1</span> — {projectPage.heroCaption ?? shortTitle}
              </>
            )}
          </figcaption>
          )}
        </figure>
      </div>

      {v4 ? (
        // v4 title block: eyebrow back to the work with the read time, the title over 9 columns, a hairline meta row.
        <section className={`${COL} flex flex-col gap-10 pt-10`}>
          <div className="flex flex-col gap-[18px] xl:max-w-[75%]">
            <span className="flex flex-wrap items-baseline gap-3 text-[13px] text-ink-meta">
              <Link href="/#work" className="transition-colors hover:text-brand">
                ← Case study · {project.tags.find((tag) => !/^\d{4}$/.test(tag))}
              </Link>
              {projectPage.readTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{projectPage.readTime}</span>
                </>
              )}
            </span>
            <h1 className="m-0 text-[clamp(40px,5.2vw,80px)] font-medium leading-none tracking-[-0.045em] text-balance">
              {projectPage.displayTitle ?? project.title}
            </h1>
            {projectPage.subtitle ? (
              <p className="m-0 max-w-[760px] text-[24px] leading-[1.3] tracking-[-0.015em] text-[#3d3c44] text-pretty">
                {projectPage.subtitle}
              </p>
            ) : null}
          </div>
          <dl className="grid grid-cols-2 gap-6 border-t border-hairline pt-4 min-[720px]:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
            {projectPage.meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-[13px] text-ink-meta">{item.label}</dt>
                <dd className="text-[15px] leading-[1.45]">{item.values.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : v3 ? (
        // Case Study v3 title block: linked eyebrow, title and standfirst over 9 columns, then a hairline meta row.
        <section className={`${COL} grid grid-cols-12 gap-6 pt-14`}>
          <div className="col-span-12 flex flex-col gap-4 xl:col-span-9">
            <h1 className="m-0 text-[clamp(52px,7vw,104px)] font-medium leading-[0.96] tracking-[-0.05em] text-balance">
              {projectPage.displayTitle ?? project.title}
            </h1>
            {projectPage.subtitle ? (
              <p className="m-0 text-[24px] leading-[1.3] tracking-[-0.015em] text-[#3d3c44] text-pretty">
                {projectPage.subtitle}
              </p>
            ) : null}
          </div>
          <dl className="col-span-12 mt-4 grid grid-cols-2 gap-6 border-t border-hairline pt-6 min-[720px]:grid-cols-4">
            {projectPage.meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-[13px] text-ink-meta">{item.label}</dt>
                <dd className="text-[15px] leading-[1.45]">
                  {item.values.map((value, index) => (
                    <span key={`${item.label}-${value}`}>
                      {index > 0 && <br />}
                      {value}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : (
      <section className="flex flex-col gap-7 px-[max(var(--gutter),calc((100%-1200px)/2))] pt-12 pb-4 min-[720px]:pt-16">
          <div className="flex flex-col gap-5">
            <span className="text-[13px] text-ink-meta">{metaLine}</span>
            <h1
              className={
                isLab
                  ? "max-w-[900px] text-[clamp(40px,5vw,64px)] font-medium leading-none tracking-[-0.04em] text-balance"
                  : "max-w-[1100px] text-[clamp(48px,6.5vw,96px)] font-medium leading-[0.95] tracking-[-0.05em] text-balance"
              }
            >
              {projectPage.displayTitle ?? project.title}
            </h1>
            {projectPage.subtitle ? (
              // The standfirst: one lead paragraph under the title, as in a newspaper.
              <p className="mt-2 max-w-[760px] text-[24px] leading-[1.35] tracking-[-0.015em] text-pretty">
                {projectPage.subtitle}
              </p>
            ) : null}
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink pt-4 min-[720px]:grid-cols-4">
            {projectPage.meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-[13px] text-ink-meta">{item.label}</dt>
                <dd className="text-[18px]">
                  {item.values.map((value, index) => (
                    <span key={`${item.label}-${value}`}>
                      {index > 0 && <br />}
                      {value}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {v4 && stats.length > 0 ? (
        // v4 stats: the figure over an ink rule, with bars for how much it moved.
        <section aria-label="Results" className={`${COL} grid grid-cols-1 gap-6 pt-[72px] min-[720px]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]`}>
          {stats.map((item) => {
            const pct = parseFloat(item.value)
            const fewer = item.value.endsWith("%") && /fewer|faster|less|reduc/i.test(item.label)
            return (
              <div key={item.value + item.label} className="flex flex-col gap-3.5 border-t border-ink pt-4">
                <span className="text-[clamp(40px,5.2vw,80px)] font-medium leading-none tracking-[-0.055em]">{item.value}</span>
                <span className="text-[15px] text-ink-muted">{item.label}</span>
                {fewer && (
                  <div aria-hidden="true" className="flex flex-col gap-2 pt-1.5 text-[13px]">
                    <div className="grid grid-cols-[52px_1fr] items-center gap-2.5 text-ink-meta">
                      <span>Before</span>
                      <span className="h-2.5 rounded-full bg-[#c9c8d0]" />
                    </div>
                    <div className="grid grid-cols-[52px_1fr] items-center gap-2.5">
                      <span>After</span>
                      <span className="h-2.5 rounded-full bg-brand" style={{ width: `${100 - pct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </section>
      ) : null}
      {v4 && projectPage.glance ? (
        <section aria-label="At a glance" className={`${COL} pt-[72px]`}>
          <dl className="grid grid-cols-1 gap-6 rounded-[20px] bg-[#f1f2f4] p-7 min-[720px]:grid-cols-3">
            {(
              [
                ["Problem", projectPage.glance.problem],
                ["What I did", projectPage.glance.did],
                ["Outcome", projectPage.glance.outcome],
              ] as const
            ).map(([label, text]) => (
              <div key={label} className="flex flex-col gap-2">
                <dt className="text-[13px] text-ink-meta">{label}</dt>
                <dd className="text-[18px] leading-[1.45] text-pretty">{text}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      {stats.length > 0 && v3 ? (
        // Case Study v3 stats: big figures under an ink rule, no cards.
        <section aria-label="At a glance" className={`${COL} pt-[72px]`}>
          <dl className="grid grid-cols-1 gap-6 min-[720px]:grid-cols-3">
            {stats.map((item) => (
              <div key={item.value + item.label} className="flex flex-col gap-2 border-t border-ink pt-4">
                <dt className="order-2 text-[15px] text-ink-muted">{item.label}</dt>
                <dd className="order-1 text-[clamp(48px,5vw,72px)] font-medium leading-none tracking-[-0.05em]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      {stats.length > 0 && !v3 && !v4 ? (
        <section aria-label="At a glance" className="px-[max(var(--gutter),calc((100%-1200px)/2))] pt-12 pb-16 min-[720px]:pb-24">
          <dl className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-3">
            {stats.map((item) => (
              <div key={item.value + item.label} className="flex flex-col-reverse justify-end gap-2 rounded-2xl bg-surface p-6">
                <dt className="text-[18px] text-ink-muted">{item.label}</dt>
                <dd className="text-[36px] font-medium leading-[1.1] tracking-[-0.04em]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* With no stat band, the band's bottom padding moves here. */}
      <section
        className={`px-[max(var(--gutter),calc((100%-1200px)/2))] pb-24 ${
          v4 ? "" : v3 ? "pt-14" : stats.length > 0 ? "" : "pt-16 min-[720px]:pt-24"
        }`}
      >
          {/* Ruler-style contents, fixed to the right edge of the viewport. */}
          <ProjectTableOfContents
            sections={projectPage.sections}
            projectSlug={project.slug}
            isPasswordProtected={project.isPasswordProtected}
          />

          {/*
            Each top-level section opens with its headline, stacked above its
            text; see case-study-sections. Sections vary their own shape.
          */}
          <div className={`cs-article flex min-w-0 flex-col ${v4 ? "" : v3 ? "gap-28" : "gap-24"} [&_section[id]]:scroll-mt-24 [&_[data-cs-head]_h2]:mb-6`}>
            {withSectionLabels(projectPage.renderBeforeGate(), projectPage.sections)}

            {postGateContent &&
              (project.isPasswordProtected ? (
                <InlinePasswordGate enabled projectSlug={project.slug} correctPassword="pixies">
                  {withSectionLabels(postGateContent, projectPage.sections)}
                </InlinePasswordGate>
              ) : (
                withSectionLabels(postGateContent, projectPage.sections)
              ))}
          </div>
      </section>

      {v4 ? (
        // v4: the previous and next study side by side, each under an ink rule.
        <nav aria-label="More case studies" className={`${COL} grid grid-cols-1 gap-6 pt-6 min-[720px]:grid-cols-2`}>
          {[
            { label: "← Previous", project: prevProject, end: false },
            { label: "Next →", project: nextProject, end: true },
          ].map((item) => (
            <Link
              key={item.label}
              href={`/work/${item.project.slug}`}
              className={`flex flex-col gap-2 border-t border-ink py-6 transition-colors hover:text-brand ${
                item.end ? "min-[720px]:items-end min-[720px]:text-right" : ""
              }`}
            >
              <span className="text-[13px] text-ink-meta">{item.label}</span>
              <span className="text-[clamp(24px,2.4vw,32px)] font-medium leading-[1.15] tracking-[-0.03em] text-balance">
                {item.project.title}
              </span>
            </Link>
          ))}
        </nav>
      ) : v3 ? (
        // Case Study v3: the next study under one hairline; the footer follows with its own rule.
        // Full width at the page gutter, like the header and footer.
        <section className="px-gutter">
          <Link
            href={`/work/${nextProject.slug}`}
            className="flex items-end justify-between gap-6 border-t border-hairline pt-8 pb-4 text-ink transition-colors hover:text-brand"
          >
            <span className="flex flex-col gap-2">
              <span className="text-[13px] text-ink-meta">Next case study</span>
              <span className="max-w-[760px] text-[clamp(28px,3vw,44px)] font-medium leading-[1.08] tracking-[-0.035em] text-balance">
                {nextProject.title}
              </span>
            </span>
            <span aria-hidden="true" className="text-[24px]">
              →
            </span>
          </Link>
        </section>
      ) : (
      <Link href={`/work/${nextProject.slug}`} className="group block px-[max(var(--gutter),calc((100%-1200px)/2))]">
          <div className="flex items-end justify-between gap-8 border-t border-hairline pt-7 pb-10 transition-colors group-hover:text-brand">
            <div className="flex flex-col gap-2.5">
              <span className="text-[13px] text-ink-meta">{isLab ? "Next in the Lab" : "Next case study"}</span>
              <span className="max-w-[900px] text-[24px] font-medium leading-[1.35] tracking-[-0.03em] text-balance sm:text-[36px] sm:leading-[1.1]">
                {nextProject.title}
              </span>
            </div>
            <span aria-hidden="true" className="text-[24px]">
              →
            </span>
          </div>
        </Link>
      )}

      <ScrollFade root=".cs-article" />
      <Footer />
    </main>
  )
}
