import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BuildSteps, PairStory } from "@/components/work/golden-goose/illustrations"
import { LabFigure, LabParagraph, LabPostHeader, LabPostSection, LabPrevNext } from "@/components/work/lab-post"
import { PlayableApp } from "@/components/work/playable-app"

// A static route, like /work/money-jenga: the post needs its own page layout,
// so it takes precedence over the dynamic [slug] template. The museum itself
// is a static build in public/golden-goose-museum/, still a work in progress.
// Laid out as golden-goose-museum.html.

export const metadata: Metadata = {
  title: "Golden Goose Digital Museum - Diana Tofan",
  description:
    "A 3D museum of every pair of Golden Goose sneakers I own: spin a pair, then open its memories.",
}

const MUSEUM = "/golden-goose-museum/index.html"

export default function GoldenGooseMuseumPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Header />

      <LabPostHeader
        title="Golden Goose Digital Museum"
        standfirst="A 3D museum of every pair of Golden Goose sneakers I own, the shoe you see me in 90% of the time."
        readTime="1 min read"
        action={{ label: "Open the museum", href: MUSEUM }}
        meta={[
          ["Role", "3D, Tool design"],
          ["Type", "Side project"],
          ["Tools", "Blender, three.js, Claude Code"],
          ["Year", "2026"],
        ]}
        hero={
          <PlayableApp
            src={MUSEUM}
            poster="/images/golden-goose-museum-pair.jpg"
            title="The Golden Goose Museum"
          />
        }
      />

      <LabPostSection title="Why I built it">
        <LabParagraph>
          I love my Golden Goose. My friends joke I should have a museum in my home. Until then, I vibecoded one.
        </LabParagraph>
      </LabPostSection>

      <LabPostSection title="How it works">
        <LabParagraph>
          Pick a pair, spin it in 3D, then open its story: the year I got it, where it travelled and my best moments
          in it.
        </LabParagraph>
        <LabFigure>
          <PairStory caption="Pick a pair, spin it, read its story." />
        </LabFigure>
      </LabPostSection>

      <LabPostSection title="How I built it">
        <LabParagraph>How each Golden Goose pair made it into the digital museum.</LabParagraph>
        <LabFigure>
          <BuildSteps />
        </LabFigure>
      </LabPostSection>

      <LabPrevNext
        prev={{ title: "Boeuf Salad Decorator", href: "/work/boeuf-salad-decorator" }}
        next={{ title: "Money Jenga", href: "/work/money-jenga" }}
      />

      <Footer />
    </main>
  )
}
