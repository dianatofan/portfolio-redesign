import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LabFigure, LabParagraph, LabPostHeader, LabPostSection, LabPrevNext } from "@/components/work/lab-post"
import { PlayableApp } from "@/components/work/playable-app"
import { BuildSteps, ToneScale } from "@/components/work/terminal/illustrations"
import { TerminalSession } from "@/components/work/terminal/session"

// A static route, like /work/money-jenga, on the Lab post layout. Laid out as
// the Project Pages design. The terminal itself lives on GitHub Pages and plays
// in the hero. (Formerly /fun/.)

export const metadata: Metadata = {
  title: "Human Redundancy Terminal - Diana Tofan",
  description: "A darkly funny terminal that answers one scary question: will AI replace my job?",
}

const TERMINAL = "https://dianatofan.github.io/risk-assessment-terminal"

export default function HumanRedundancyTerminalPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Header />

      <LabPostHeader
        title="Human Redundancy Terminal"
        standfirst="A darkly funny terminal that answers one scary question: will AI replace my job?"
        readTime="1 min read"
        action={{ label: "Open the terminal", href: TERMINAL }}
        meta={[
          ["Role", "Concept, Writing, Build"],
          ["Type", "Side project"],
          ["Tools", "Google AI Studio, GitHub Copilot"],
          ["Year", "2025"],
        ]}
        hero={
          <PlayableApp src={TERMINAL} poster="/images/fun-human-redundancy.webp" title="Human Redundancy Terminal" />
        }
      />

      <LabPostSection title="Why I built it">
        <LabParagraph>
          I&apos;ve always loved digging into datasets and finding patterns. When everyone started asking whether AI
          would take their job, I wanted to see what the numbers actually say.
        </LabParagraph>
        <LabFigure>
          <ToneScale />
        </LabFigure>
      </LabPostSection>

      <LabPostSection title="How it works">
        <LabParagraph>Type your role. The terminal reads the data and hands you a risk snapshot.</LabParagraph>
        <LabFigure>
          <TerminalSession />
        </LabFigure>
        <LabParagraph>
          It runs on a Kaggle dataset of AI’s impact on jobs from 2024 to 2030: automation risk, salary, remote work and
          more. It shows patterns, not predictions.
        </LabParagraph>
      </LabPostSection>

      <LabPostSection title="How I built it">
        <LabParagraph>From a dataset to a terminal with an opinion, in four steps.</LabParagraph>
        <LabFigure>
          <BuildSteps />
        </LabFigure>
      </LabPostSection>

      <LabPrevNext
        prev={{ title: "Boeuf Salad Decorator", href: "/work/boeuf-salad-decorator" }}
        next={{ title: "Golden Goose Digital Museum", href: "/work/golden-goose-museum" }}
      />

      <Footer />
    </main>
  )
}
