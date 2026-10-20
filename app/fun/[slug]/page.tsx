import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LabHero, LabIntro, LabSection, labBody } from "@/components/work/lab-chrome"

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
    coverImage: "/images/fun-human-redundancy.webp",
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
    <main className="min-h-screen bg-white text-ink">
      <Header />

      <LabIntro title={post.title} standfirst={post.content.intro} />

      {/* The design's hero is 600px tall in the 1200px column. */}
      <LabHero>
        <div className="relative aspect-[2/1] w-full bg-[#111113]">
          <Image
            src={post.coverImage}
            alt={`${post.title} cover`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </LabHero>

      {post.content.sections.map((section) => (
        <LabSection key={section.heading} label={section.heading}>
          <div className={`space-y-4 ${labBody}`}>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </LabSection>
      ))}

      <Footer />
    </main>
  )
}
