import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InspectionBulletin, KitschScale, SaladSteps } from "@/components/work/boeuf/illustrations"
import { PlayableApp } from "@/components/work/playable-app"
import { LabFigure, LabParagraph, LabPostHeader, LabPostSection, LabPrevNext } from "@/components/work/lab-post"

// A static route, like /work/money-jenga: the post needs its own page layout,
// so it takes precedence over the dynamic [slug] template. The app itself is a
// static build in public/salata-de-boeuf/. Laid out as boeuf-salad-decorator.html.

export const metadata: Metadata = {
  title: "Boeuf Salad Decorator - Diana Tofan",
  description:
    "A 3D web app that turns the Romanian tradition of over-decorated Christmas salads into retro holiday cards you send to Mom.",
}

const APP = "/salata-de-boeuf/index.html"

// The 1986 food inspection, word for word from the app.
const plan = [
  "At least 3 different vegetables",
  "At least 30 pieces (the plan)",
  "At most 10 olives (luxury)",
  "No bourgeois excess (max 400)",
]

export default function BoeufSaladPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Header />

      <LabPostHeader
        title="Boeuf Salad Decorator"
        standfirst="Decorate a Romanian Christmas salad in 3D, then send it to Mom as a retro holiday card."
        readTime="1 min read"
        action={{ label: "Open the app", href: APP }}
        meta={[
          ["Platform", "Web"],
          ["Stack", "three.js, Claude Code"],
          ["Year", "2026"],
          ["Status", "Playable"],
        ]}
        hero={<PlayableApp src={APP} poster="/salata-de-boeuf/og.jpg" title="Boeuf Salad Decorator" />}
      />

      <LabPostSection title="Why I built it">
        <LabParagraph>
          I&apos;m already in Christmas mood, and that means one thing: boeuf salad. Growing up in Romania, every mom
          decorated it like it was going to a wedding, pushing the boundaries of kitsch. Now anyone can join in.
        </LabParagraph>
      </LabPostSection>

      <LabPostSection title="How it plays">
        <LabParagraph>
          Decorate your salad, then send it as a gloriously over-the-top holiday card: glitter, sparkles and a greeting
          straight out of a 2009 Facebook post.
        </LabParagraph>
        <LabFigure>
          <SaladSteps />
        </LabFigure>
        <LabFigure>
          <KitschScale caption="Every salad gets a kitsch score." />
        </LabFigure>
      </LabPostSection>

      <LabPostSection title="Or travel to 1986">
        <LabParagraph>Ration cards, 2 kg of mayo, and the salad has to pass the five-year plan.</LabParagraph>
        <LabFigure>
          <InspectionBulletin rules={plan} />
        </LabFigure>
      </LabPostSection>

      <LabPrevNext
        prev={{ title: "Money Jenga", href: "/work/money-jenga" }}
        next={{ title: "Human Redundancy Terminal", href: "/work/human-redundancy-terminal" }}
      />

      <Footer />
    </main>
  )
}
