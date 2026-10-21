import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LabFigure, LabParagraph, LabPostHeader, LabPostSection, LabPrevNext } from "@/components/work/lab-post"
import { CatSection, PaymentFlow, PhoneHero, TowerSteps } from "@/components/work/money-jenga/illustrations"

// A static route, like /work/boeuf-salad-decorator: the post needs its own
// page layout, so it takes precedence over the dynamic [slug] template.
// Laid out as money-jenga.html.

export const metadata: Metadata = {
  title: "Money Jenga - Diana Tofan",
  description:
    "An iPhone budget app where every purchase pulls a block out of a tower of cash. No bank details needed. Built in SwiftUI with Claude Code.",
}

export default function MoneyJengaPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Header />

      <LabPostHeader
        title="Money Jenga"
        standfirst="A budget app where every purchase pulls a block out of a tower of cash."
        readTime="1 min read"
        meta={[
          ["Platform", "iPhone"],
          ["Stack", "SwiftUI, Claude Code"],
          ["Year", "2026"],
          ["Status", "In daily use"],
        ]}
        hero={<PhoneHero />}
      />

      <LabPostSection title="Why I built it">
        <LabParagraph>
          I love spending money. My wallet doesn&apos;t. Every budget app wanted my bank details, so I built a private
          one instead.
        </LabParagraph>
      </LabPostSection>

      <LabPostSection title="How it plays">
        <LabParagraph>Every purchase pulls a block out of a tower of cash. Spend too fast and it wobbles.</LabParagraph>
        <LabFigure>
          <TowerSteps />
        </LabFigure>
        <LabFigure>
          <CatSection caption="The cat reacts to how fast you spend." />
        </LabFigure>
      </LabPostSection>

      <LabPostSection title="Smart, but private">
        <LabParagraph>Every Apple Pay payment logs itself, and my bank details never leave the phone.</LabParagraph>
        <LabFigure>
          <PaymentFlow />
        </LabFigure>
      </LabPostSection>

      <LabPrevNext
        prev={{ title: "Golden Goose Digital Museum", href: "/work/golden-goose-museum" }}
        next={{ title: "Boeuf Salad Decorator", href: "/work/boeuf-salad-decorator" }}
      />

      <Footer />
    </main>
  )
}
