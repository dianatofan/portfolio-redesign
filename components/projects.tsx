import { SelectedWork, type SelectedWorkRow } from "./selected-work"
import { LabGrid, type LabItem } from "./lab-grid"
import { Microcomponents } from "./microcomponents"

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
    // Headline result shown under the card title. Taken from the case study's own
    // Impact section, so the number on the card always matches the page.
    outcome?: string
    // Only for work that went out to real users. Concept and research work leaves
    // it unset rather than claiming a launch it didn't have.
    shipped?: boolean
    // Looping interface clip that plays over the cover on hover, so the card shows
    // the product running instead of a still.
    previewVideo?: string
    // The homepage row: a shorter title, the status line, one short line saying
    // what it is, and the year. Only projects with one are listed under Selected work.
    // Looping clip for the homepage row's thumbnail.
    rowVideo?: string
    row?: { title: string; outcome: string; status: string; year: string }
}

export const workProjects: readonly WorkProject[] = [
    {
        slug: "dianas-diamonds",
        title: "Building a prototype library to scale AI-driven design",
        navigationTitle: "Diana's Diamonds",
        image: "/images/dianas-diamonds/field-13-card@2x.webp",
        // Full-width card on the homepage, so it uses the 21:9 hub capture.
        homepageImage: "/images/dianas-diamonds/hero-13-21x9@2x.webp",
        tags: ["2026", "Tactile Games"],
        featured: true,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
        outcome: "16 AI-built prototypes in one library, with handoff to developers built in",
        shipped: true,
        previewVideo: "/images/dianas-diamonds/field-real.mp4",
        rowVideo: "/images/dianas-diamonds/field-18.webm",
        row: {
            title: "Diana's Diamonds",
            outcome: "A tool I built so designers can share AI-made prototypes", status: "Shipped · Tactile", year: "2026" },
    },
    {
        slug: "liveops-alerting",
        title: "Designing a LiveOps alerting system to reduce production incidents",
        navigationTitle: "LiveOps Alerting",
        image: "/images/project-liveops.webp",
        homepageImage: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1775046661/project-liveops.png",
        tags: ["2025", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
        outcome: "22% fewer production incidents, critical failures caught in minutes",
        shipped: true,
        previewVideo: "https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610317/homepage-video.mp4",
        row: {
            title: "Production alerting",
            outcome: "Real-time alerts for production failures in live games", status: "Shipped · Tactile", year: "2025" },
    },
    {
        slug: "game-setup-automation",
        title: "Automating game setup for scalable releases",
        navigationTitle: "Game Setup Automation",
        image: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1769610293/game-canvas-cover.png",
        homepageImage:
            "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto,dpr_auto,c_fill,g_auto,w_1400,h_933/v1769610278/thumbnail9.png",
        tags: ["2025", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: true,
        outcome: "About 2x faster game setup and 3 more games launched per quarter",
        shipped: true,
        previewVideo: "https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610262/step1-demo.mp4",
        row: {
            title: "Game setup automation",
            outcome: "A guided flow that lets teams set up new games on their own",
            status: "Shipped · Tactile",
            year: "2025",
        },
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
        outcome: "Concepts adopted into the 2024 Google Search roadmap",
        row: {
            title: "Travel on Google Search",
            outcome: "A three-stage trip-planning framework for Google Search", status: "Concept · Google", year: "2023" },
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
        outcome: "35% faster UI development and 18% fewer support calls",
        shipped: true,
    },
    {
        slug: "release-timeline",
        title: "Visualizing release impact across live games",
        navigationTitle: "Release Timeline",
        image: "/images/release-timeline-thumb.webp",
        tags: ["2026", "Tactile Games"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
        category: "experiment",
    },
    // Side projects use the case-study template but stay out of the Case Studies
    // grid (category "experiment"); the Built in Code list links to them.
    {
        slug: "money-jenga",
        title: "Money Jenga",
        image: "/images/money-jenga-screens.webp",
        tags: ["2026", "Side project"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
        category: "experiment",
    },
    {
        slug: "golden-goose-museum",
        title: "Golden Goose Digital Museum",
        image: "/images/golden-goose-hero.webp",
        tags: ["2026", "Side project"],
        featured: false,
        aspect: "aspect-[3/2]",
        isPasswordProtected: false,
        category: "experiment",
    },
] as const

export const projects = workProjects

// Lab cards on the homepage, newest first. Each sets its screenshot in a device frame.
const labItems: LabItem[] = [
    {
        title: "Golden Goose Digital Museum",
        description: "3D sneakers and the tool to paint them",
        frame: { type: "powerbook", src: "/images/golden-goose-painter.webp" },
        href: "/work/golden-goose-museum",
    },
    {
        title: "Human Redundancy Terminal",
        description: "A glitchy CRT with dark humour",
        frame: { type: "mac", src: "/images/lab/terminal.webm" },
        href: "https://dianatofan.github.io/risk-assessment-terminal",
    },
    {
        title: "Money Jenga",
        description: "A budget app shaped like a Jenga tower",
        frame: { type: "phone", src: "/images/money-jenga/setup.webp" },
        href: "/work/money-jenga",
    },
    {
        title: "Boeuf Salad Decorator",
        description: "Retro Christmas cards from salads",
        frame: { type: "crt", src: "/images/lab/boeuf-1986.jpg" },
        href: "/work/boeuf-salad-decorator",
    },
]

/*
 * The Google Maps prototypes live on their own route, not the case-study
 * template, so their row is added here rather than coming from workProjects.
 * Its thumbnail is the Travel cover until a still from the recordings exists.
 */

const mapsPrototypesRow: SelectedWorkRow = {
    title: "Prototyping at Google",
    outcome: "Exploring product directions for Maps and Search",
    status: "Concept · Google",
    year: "2023",
    href: "/prototypes/google-maps",
    image: "/images/project-travel.png",
}

const caseStudyRows: SelectedWorkRow[] = workProjects.flatMap((project) =>
    project.row
        ? [
              {
                  ...project.row,
                  href: `/work/${project.slug}`,
                  image: project.homepageImage ?? project.image,
                  video: project.rowVideo,
              },
          ]
        : []
)

const selectedWork: SelectedWorkRow[] = [...caseStudyRows, mapsPrototypesRow]

function SectionHead({ title, note }: { title: string; note: string }) {
    return (
        <div className="flex items-baseline justify-between gap-6 border-b border-ink pb-4 text-[15px]">
            <h2 className="font-medium">{title}</h2>
            <span className="text-right text-ink-meta">{note}</span>
        </div>
    )
}

export function Projects() {
    return (
        <>
            <section id="work" className="scroll-mt-16 px-gutter py-6">
                <SectionHead title="Selected work" note="2023 — now" />
                <SelectedWork rows={selectedWork} />
            </section>

            {/* id kept in sync with the "Back" links on the Lab pages. */}
            <section id="lab" className="scroll-mt-16 px-gutter pt-14 pb-6 sm:pt-20">
                <SectionHead title="Lab" note="Built for fun, mostly with AI" />
                <LabGrid items={labItems} />
            </section>

            <section id="microcomponents" className="scroll-mt-16 px-gutter pt-14 sm:pt-20">
                <SectionHead title="Microcomponents" note="Small details, live. Pick one." />
                <Microcomponents />
            </section>
        </>
    )
}
