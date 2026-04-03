import type { WorkProjectPage } from "./types"
import { CaseStudyImage, InsightCards, OutcomeCards } from "./shared"

export const travelPlanningPage: WorkProjectPage = {
  description:
    "Rethinking travel planning in Google Search as a continuous journey, not a series of isolated queries.",
  heroImage: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto:best,w_1920/v1769610470/cover.png",
  meta: [
    { label: "Role", values: ["UX Engineer"] },
    { label: "Duration", values: ["Summer 2024"] },
    { label: "Team", values: ["3 UX Designers", "1 UX Researcher", "1 Product Manager"] },
    { label: "Skills", values: ["Interaction Design", "Prototyping", "Concept Exploration", "Research Synthesis"] },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "goal", title: "Goal" },
    { id: "research", title: "Research", isGateStart: true },
    { id: "framework", title: "Framework" },
    { id: "framework-get-inspired", title: "I. Get inspired", parent: "framework" },
    { id: "framework-look-into-alternatives", title: "II. Look into alternatives", parent: "framework" },
    { id: "framework-rediscover-the-journey", title: "III. Rediscover the journey", parent: "framework" },
    { id: "solution", title: "Prototyping" },
    { id: "outcome", title: "Outcome" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Overview</h2>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            91% of travellers turned to search engines for trip inspiration, and Google was the
            first stop for most of them. But Search was built around a single query, not the
            multi-session reality of actually planning a trip. Over a summer sprint, we defined a
            new planning framework for Google Search that was validated by UX leadership and fed
            into the 2024 Google Search shift in the product roadmap, helping start the move toward
            more visual search results.
          </p>
        </div>
      </section>


      <section id="problem">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Problem</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Search returned text-based links with no memory between sessions. Every
          visit started from zero. Travellers had to stitch together inspiration, comparisons, and
          logistics on their own, across tabs, screenshots, and half-remembered searches. The
          product was built for a decisive user who, in reality, rarely existed.
        </p>
        <InsightCards
          items={[
            {
              title: "No continuity across sessions",
              description:
                "The average trip takes 34 days to plan. Search treated each visit as if it were the first.",
            },
            {
              title: "Comparison without scaffolding",
              description:
                "Users juggled tabs, screenshots, and memory to weigh up destinations with no product support.",
            },
            {
              title: "Inspiration without direction",
              description:
                "The explore phase was the most loved part of planning, yet Search offered no structure to build on it.",
            },
          ]}
        />
      </section>

        <section id="goal">
            <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Goal</h2>
            <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
                <p className="text-lg font-medium text-foreground">
                    Design a travel planning experience in Google Search that helps flexible travellers move
                    from inspiration to decision across multiple sessions, without losing context along the
                    way.                </p>
            </div>
        </section>
    </>
  ),
  renderAfterGate: () => (
    <>

      <section id="research">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Research</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          We didn't start from scratch. Google had a large database of existing user research and I
          spent time going deep into it before touching a single frame. The patterns were
          consistent: people planning trips were flexible and undecided. Most hadn't committed to a
          destination, a date, or even a duration.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Three friction points kept coming up: getting inspired, comparing options without losing
          context, and resuming a search without starting over. Those gaps became the backbone of
          the framework.
        </p>
      </section>

      <section id="framework">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Framework</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          We structured the work around a three-stage traveller journey, with each designer owning
          one stage. My primary responsibility was stage three, Rediscover the Journey. On top of
          that, I took on the work of pulling all three stages into a coherent experience, since
          they had been designed independently and looked very different from each other.
        </p>
        <CaseStudyImage
          src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609957/tripExploration.png"
          alt="Trip exploration framework detail"
          topMargin={false}
          background={false}
        />

        <div className="mt-8 space-y-10">
          <div id="framework-get-inspired" className="space-y-4 scroll-mt-20">
            <h3 className="text-xl font-medium text-foreground">I. Get inspired</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              A visual, cross-vertical surface that surfaces destinations, stays, and things to do
              before any destination has been decided on.
            </p>
            <div className="space-y-4">
              <div className="mt-14 md:mt-16">
                <CaseStudyImage
                  src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769619951/getInspired.png"
                  alt="Get inspired low-fidelity concept"
                  topMargin={false}
                  ratioClass="aspect-[6/5]"
                />
              </div>
              <div className="rounded-xl bg-gray-50 p-6 md:p-8 mt-12">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-center">
                  <div className="mx-auto w-full max-w-[320px] flex flex-col items-center justify-center">
                    <div className="w-full rounded-[32px] bg-black p-[2px]">
                      <div className="overflow-hidden rounded-[30px] bg-black">
                        <div className="aspect-[9/19]">
                          <img
                            src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610475/firstscreen-grindelwald.gif"
                            alt="Get inspired high-fidelity prototype - Grindelwald"
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-center text-gray-400">
                      Without map: Broad exploration
                    </p>
                  </div>
                  <div className="mx-auto w-full max-w-[320px] flex flex-col items-center justify-center">
                    <div className="w-full rounded-[32px] bg-black p-[2px]">
                      <div className="overflow-hidden rounded-[30px] bg-black">
                        <div className="aspect-[9/19]">
                          <img
                            src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610472/firstscreen-selected.gif"
                            alt="Get inspired high-fidelity prototype - selected state"
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-center text-gray-400">
                      With map: Contextual exploration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="framework-look-into-alternatives" className="space-y-4 scroll-mt-20">
            <h3 className="text-xl font-medium text-foreground">II. Look into alternatives</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Side-by-side comparisons with price signals and sustainability cues to help weigh
              tradeoffs without jumping between tabs.
            </p>
            <div className="space-y-4">
              <div className="mt-14 md:mt-16">
                <CaseStudyImage
                  src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609948/flights.png"
                  alt="Look into alternatives low-fidelity concept"
                  topMargin={false}
                  ratioClass="aspect-[4/3]"
                />
              </div>
              <div className="rounded-xl bg-gray-50 p-6 md:p-8 mt-12">
                <div className="mx-auto w-full max-w-[320px]">
                  <div className="w-full rounded-[32px] bg-black p-[2px]">
                    <div className="overflow-hidden rounded-[30px] bg-black">
                      <div className="aspect-[9/19]">
                        <img
                          src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610303/secondscreen-flights.gif"
                          alt="Look into alternatives high-fidelity prototype"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="framework-rediscover-the-journey" className="space-y-4 scroll-mt-20">
            <h3 className="text-xl font-medium text-foreground">III. Rediscover the journey</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              A curated view of the user's search history, personalised and kept up to date, so
              returning to a trip mid-planning feels like picking up a conversation, not starting a
              new one.
            </p>
            <div className="space-y-4">
              <div className="mt-14 md:mt-16">
                <CaseStudyImage
                  src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609954/rediscover.png"
                  alt="Rediscover the journey low-fidelity concept"
                  topMargin={false}
                  ratioClass="aspect-[4/3]"
                />
              </div>
              <div className="rounded-xl bg-gray-50 p-6 md:p-8 mt-12">
                <div className="mx-auto w-full max-w-[320px]">
                  <div className="w-full rounded-[32px] bg-black p-[2px]">
                    <div className="overflow-hidden rounded-[30px] bg-black">
                      <div className="aspect-[9/19]">
                        <img
                          src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610281/lastscreen.gif"
                          alt="Rediscover the journey high-fidelity prototype"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solution">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Prototyping</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I always start with quick sketches to make the delivery clear, align the team early, and
          pressure-test the idea before investing in high fidelity.
        </p>
        <CaseStudyImage
          src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1775065425/8435D46E-367D-447E-85FD-C171E26B6458.jpg"
          alt="Sketching and aligning with the team before prototyping"
          topMargin={false}
        />
        <p className="mt-3 mb-6 text-sm text-center text-gray-400">
          Me in action, brainstorming with the team.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I built high-fidelity mobile prototypes in React with a live Google Maps integration,
          something that wasn't possible in Figma at the time, before AI tools existed to bridge
          that gap. The prototypes were used directly in user research sessions and made it possible
          to evaluate motion, map interactions, and the overall feel of the experience in a way
          static mocks couldn't communicate.
        </p>
      </section>

      <section id="outcome">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Outcome</h2>
        <OutcomeCards
          items={[
            {
              title: "Adopted into the roadmap",
              description:
                "Concepts were validated by the UX steering committee and directly informed Search's planning priorities.",
            },
            {
              title: "Shifted the product direction",
              description:
                "The work helped define the 2024 Google Search shift on the product roadmap and supported the move toward more visual, cross-vertical results.",
            },
            {
              title: "Prototype as a research tool",
              description:
                "React prototypes with real Maps data replaced static mocks in user testing, producing sharper and more reliable insights.",
            },
            {
              title: "A unified experience",
              description:
                "Three separately designed stages were brought into a single coherent visual and interaction language.",
            },
          ]}
        />
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mt-6">
          The sprint ran alongside a major organisational restructure at Google, which made for an
          uncertain backdrop. Teams were shifting, priorities were being renegotiated, and it wasn't
          always clear who the work ultimately belonged to. Getting anything across the line in that
          environment felt like its own achievement.
        </p>
      </section>
    </>
  ),
}
