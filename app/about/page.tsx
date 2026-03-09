import Link from "next/link"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import { ProjectTableOfContents } from "@/components/project-table-of-contents"

export const metadata = {
    title: "About - Diana Tofan",
    description:
        "Learn more about Diana Tofan, a product designer specializing in complex systems and enterprise tools.",
}

const sections = [
    { id: "bounce-cards", title: "Work experience" },
    { id: "bio", title: "Background", isParent: true },
    { id: "bio-paragraph-1", title: "Career evolution", parent: "bio" },
    { id: "bio-paragraph-2", title: "Experience & approach", parent: "bio" },
]

export default function AboutPage() {
    return (
        <main>
            {/* Custom Back Button Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-sm">
                <div className="max-w-[1800px] mx-auto flex items-center justify-between">
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
            </header>
            <section className="pt-28">
                <div className="max-w-[1800px] mx-auto px-6">
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3">
                        {/* Table of Contents - Left (3 cols) */}
                        <div className="hidden md:block col-span-3">
                            <ProjectTableOfContents sections={sections} />
                        </div>

                        {/* Content - Right (7 cols, starting at col 4) */}
                        <div className="col-span-4 md:col-span-7 md:col-start-5">
                            <About />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}

