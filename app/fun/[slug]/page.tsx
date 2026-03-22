import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

type FunPost = {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  published: string
  readTime: string
  content: {
    intro: string
    sections: Array<{
      heading: string
      body: string[]
    }>
  }
}

const funPosts: readonly FunPost[] = [
  {
    slug: "human-redundancy-terminal",
    title: "Human Redundancy Terminal",
    excerpt:
      "An apocalyptic, tragic-comical terminal experiment asking if AI is coming for your job.",
    coverImage: "/images/fun-human-redundancy.png",
    published: "March 2026",
    readTime: "4 min read",
    content: {
      intro:
        "I built Human Redundancy Terminal as a dramatic, darkly funny interface that lets people confront a scary question: will AI replace my role?",
      sections: [
        {
          heading: "Why I made it",
          body: [
            "Most conversations around AI and jobs are either too optimistic or pure doomposting. I wanted to create something in between: honest, unsettling, but still playful.",
            "The terminal format gave me the right tone. It feels technical and serious, while the writing style keeps it tragic-comical and human.",
          ],
        },
        {
          heading: "Data and signals",
          body: [
            "I used a Kaggle dataset focused on AI impact on the job market from 2024 to 2030. It includes job status changes, automation risk, remote work ratios, salary, and projected openings.",
            "The model in this project does not claim certainty. Instead, it surfaces patterns and gives a narrative-style risk snapshot people can reflect on.",
          ],
        },
        {
          heading: "How I built it",
          body: [
            "I prototyped and generated flows using Google AI Studio, shipped implementation support with GitHub Copilot, and published the experience on GitHub Pages.",
            "The goal was speed and personality over production complexity: a compact interactive concept that communicates mood and insight quickly.",
          ],
        },
        {
          heading: "What I learned",
          body: [
            "People engage more with data when the format has a point of view. A strong narrative voice turned a standard job-risk dataset into something memorable.",
            "This project also reminded me that fun experiments can be serious design work when they make complex futures easier to feel and discuss.",
          ],
        },
      ],
    },
  },
] as const

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return funPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = funPosts.find((item) => item.slug === slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: `${post.title} - Diana Tofan`,
    description: post.excerpt,
  }
}

export default async function FunProjectPage({ params }: PageProps) {
  const { slug } = await params
  const post = funPosts.find((item) => item.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto grid grid-cols-4 md:grid-cols-12 gap-x-3 items-center">
          <div className="col-span-4 md:col-span-3 flex items-center">
            <Link
              href="/#fun"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-[var(--text-secondary)] transition-colors duration-200"
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
              Back to Fun
            </Link>
          </div>
        </div>
      </header>

      <article className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full overflow-hidden rounded-2xl bg-card aspect-[16/9]">
            <Image
              src={post.coverImage}
              alt={`${post.title} cover`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="mt-10 max-w-3xl">
            <p className="text-sm text-[var(--text-tertiary)]">
              {post.published} · {post.readTime}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-medium tracking-tight text-foreground">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
              {post.content.intro}
            </p>

            <div className="mt-12 space-y-10">
              {post.content.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-medium text-foreground">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-relaxed text-[var(--text-secondary)]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

