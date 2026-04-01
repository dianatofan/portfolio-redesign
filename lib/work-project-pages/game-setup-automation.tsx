import Image from "next/image"
import type { WorkProjectPage } from "./types"
import { BeforeAfterVideoCard } from "@/components/work/before-after-video-card"
import ForceGraph from "@/components/work/force-graph"
import { Bot, Clock3, ShieldCheck, Wrench } from "lucide-react"
import { ConstraintCards, OutcomeCards } from "./shared"

export const gameSetupAutomationPage: WorkProjectPage = {
  description: "Automating game setup to enable team independence and scale releases.",
  meta: [
    { label: "Role", values: ["Product Designer"] },
    { label: "Duration", values: ["3 months"] },
    { label: "Team", values: ["Product Manager, Tech Lead, 2 BE Engineers, 1 FE Engineer"] },
    { label: "Skills", values: ["Product Design", "Product Strategy", "Prototyping"] },
  ],
  sections: [
    { id: "context", title: "Context" },
    { id: "goal", title: "Goal" },
    { id: "discovery", title: "Discovery", isGateStart: true },
    { id: "constraints", title: "Constraints" },
    { id: "solution", title: "Solution", isParent: true },
    { id: "step-1", title: "Step 1: Define the essentials", parent: "solution" },
    { id: "step-2", title: "Step 2: Configure services", parent: "solution" },
    { id: "step-3", title: "Step 3: Permissions", parent: "solution" },
    { id: "step-4", title: "Step 4: Integration credentials", parent: "solution" },
    { id: "provisioning", title: "System behavior", parent: "solution" },
    { id: "post-setup", title: "Post-setup ownership", parent: "solution" },
    { id: "tradeoffs", title: "Key tradeoffs" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="context">
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          At Tactile, game teams ship and operate multiple live games in parallel.
        </p>
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          To ship more games per quarter and quickly learn what players love, teams needed a faster
          path from concept to live release.
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Before launch, each game had to be registered across LiveOps, analytics, build pipelines,
          permissions, and infrastructure, creating a Core Team–dependent bottleneck.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-8">
          The Game Canvas Setup Tool enables teams to set up new games independently while
          preserving infrastructure guarantees and operational safety.
        </p>
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-white">
            <ForceGraph
              className="w-full"
              height={520}
              linkDistance={65}
              chargeStrength={-240}
              nodes={[
                { id: "Core Team" },
                { id: "Game Team" },
                { id: "LiveOps" },
                { id: "Analytics" },
                { id: "Build Pipelines" },
                { id: "Permissions" },
                { id: "Infrastructure" },
                { id: "Feature Flags" },
                { id: "Remote Config" },
                { id: "Monitoring" },
                { id: "QA Automation" },
                { id: "Identity Service" },
                { id: "Secrets Manager" },
                { id: "Experimentation" },
                { id: "Store Metadata" },
                { id: "Crash Reporting" },
                { id: "Data Warehouse" },
                { id: "Ownership Rules" },
                { id: "Release" },
              ] as any}
              links={[
                { source: "Game Team", target: "LiveOps" },
                { source: "Game Team", target: "Analytics" },
                { source: "Game Team", target: "Build Pipelines" },
                { source: "Game Team", target: "Permissions" },
                { source: "Game Team", target: "Infrastructure" },
                { source: "Game Team", target: "Feature Flags" },
                { source: "Game Team", target: "Remote Config" },
                { source: "Game Team", target: "Experimentation" },
                { source: "Game Team", target: "Store Metadata" },
                { source: "Game Team", target: "Ownership Rules" },
                { source: "Core Team", target: "LiveOps" },
                { source: "Core Team", target: "Analytics" },
                { source: "Core Team", target: "Build Pipelines" },
                { source: "Core Team", target: "Permissions" },
                { source: "Core Team", target: "Infrastructure" },
                { source: "Core Team", target: "Identity Service" },
                { source: "Core Team", target: "Secrets Manager" },
                { source: "Core Team", target: "QA Automation" },
                { source: "Core Team", target: "Monitoring" },
                { source: "LiveOps", target: "Release" },
                { source: "Analytics", target: "Release" },
                { source: "Build Pipelines", target: "Release" },
                { source: "Permissions", target: "Release" },
                { source: "Infrastructure", target: "Release" },
                { source: "Feature Flags", target: "Release" },
                { source: "Remote Config", target: "Release" },
                { source: "Experimentation", target: "Release" },
                { source: "Store Metadata", target: "Release" },
                { source: "QA Automation", target: "Release" },
                { source: "Monitoring", target: "Release" },
                { source: "Crash Reporting", target: "Monitoring" },
                { source: "Data Warehouse", target: "Analytics" },
                { source: "Identity Service", target: "Permissions" },
                { source: "Secrets Manager", target: "Build Pipelines" },
                { source: "Ownership Rules", target: "Permissions" },
                { source: "Feature Flags", target: "Remote Config" },
                { source: "Experimentation", target: "Data Warehouse" },
                { source: "Crash Reporting", target: "Release" },
              ] as any}
            />
          </div>
          <div className="px-5 py-4 md:px-6 border-t border-gray-100 bg-gray-50">
            <p className="text-xs md:text-sm leading-relaxed text-gray-800">
              Conceptual illustration of the many interconnected systems involved in game setup.
            </p>
          </div>
        </div>
      </section>

      <section id="goal">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Goal</h2>
        <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
          <p className="text-lg font-medium text-foreground">
            Enable teams to launch more games per quarter through fast, safe, self-serve game setup.
          </p>
        </div>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <section id="discovery">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Discovery</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I ran a cross-functional workshop with Product, Core Team, and platform engineers to map the
          current setup process, surface hidden dependencies, and align on constraints.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-8">
          The goal was to clarify when a game is first provisioned across core systems and define a
          single, safe automation path.
        </p>
        <div className="max-w-5xl rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="relative w-full">
            <Image
              src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610260/workshop-compressed.png"
              alt="Workshop outputs mapping setup steps, constraints, and system dependencies."
              width={1920}
              height={1080}
              className="w-full h-auto transition-opacity duration-700 ease-out opacity-100"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          <div className="px-5 py-4 md:px-6 border-t border-gray-100 bg-gray-50">
            <p className="text-xs md:text-sm leading-relaxed text-gray-800">
              Workshop outputs mapping setup steps, constraints, and system dependencies.
            </p>
          </div>
        </div>
      </section>

      <section id="constraints">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Constraints</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          These constraints were defined and agreed on during the workshop:
        </p>
        <ConstraintCards
          items={[
            {
              title: "Safe by default",
              description: "Prevent mistakes and ensure games are set up correctly from the start.",
              icon: ShieldCheck,
            },
            {
              title: "Guided setup",
              description: "Automate what we can, and clearly guide teams when input is needed.",
              icon: Bot,
            },
            {
              title: "Flexible process",
              description: "Allow setup to happen step by step, without blocking progress.",
              icon: Clock3,
            },
            {
              title: "Works with existing tools",
              description: "Build on current systems instead of replacing them.",
              icon: Wrench,
            },
          ]}
        />
      </section>

      <section id="solution">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Solution</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          I designed a wizard-style setup tool inspired by Firebase to keep the process fast and
          safe. Teams start with just the essentials, while more complex setup is pushed to later
          steps so they do not get overwhelmed or make early mistakes.
        </p>
      </section>

      <section id="step-1">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Step 1: Define the essentials</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Teams set the game's identity and ownership, the minimum needed to create a game.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          A helper panel explains each field and required format, making the first step clear and
          low risk.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610262/step1-demo.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="step-2">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Step 2: Configure services</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Teams select and set up the services their game depends on.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Services appear as cards with clear states like ready, in progress, or failed. Some are
          automatic, others need input. Teams can keep going without finishing everything at once.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610445/step2-services.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="step-3">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Step 3: Permissions</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Access is managed through simple roles like Viewer, Editor, and Publisher.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Teams can assign roles and instantly see who has access, with safeguards to prevent
          mistakes.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610423/step3-permissions.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="step-4">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Step 4: Integration credentials</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          External details like IDs or keys are added in a separate step.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Strict validation helps avoid errors while keeping earlier steps fast and simple.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610466/step4-credentials.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="provisioning">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">System behavior</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Setup runs across multiple systems in the background.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Each module shows its status and allows actions like Configure or Retry, so teams can keep
          moving without waiting.
        </p>
        <div className="w-full bg-gray-50 rounded-lg px-6 md:px-8 py-20 flex justify-center mt-8">
          <div className="w-full max-w-5xl">
            <Image
              src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610092/provisioning.png"
              alt="How provisioning works across systems"
              width={1920}
              height={1080}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        </div>
      </section>

      <section id="post-setup">
        <div className="grid grid-cols-1 gap-8 items-start">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Post-setup ownership</h2>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Teams land in a central overview to track progress, fix issues, and manage access over
              time.
            </p>
          </div>

          <figure>
            <div className="relative overflow-hidden rounded-xl">
              <video autoPlay loop muted playsInline className="w-full">
                <source
                  src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610479/post-setup.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <figcaption className="mt-3 text-xs md:text-sm text-[var(--text-tertiary)]">
              Switching between overview, permissions, and integration settings for a partially configured game.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="tradeoffs">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Key tradeoffs</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Progressive expansion</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Showing all service cards expanded by default made the setup long and overwhelming as more services were added. I moved to a progressive expansion model where only the core services stay open by default, while the rest can be expanded as needed, with each user&apos;s preference saved locally.
            </p>
            <BeforeAfterVideoCard
              beforeSrc="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610420/everything-expanded.mp4"
              afterSrc="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610187/mostly-collapsed.mp4"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Fewer, clearer module states</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Early designs exposed many granular states, which were accurate but hard to scan. I reduced these to a small, consistent set that clearly communicates readiness and required action at a glance.
            </p>
            <div className="mt-8 w-full bg-[#E3E8F1] p-8 rounded-2xl">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609945/module-statuses.png"
                alt="Module status states showing readiness and required action"
                width={600}
                height={360}
                className="mx-auto w-[600px] h-[360px] object-contain"
                sizes="600px"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Inherited access</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Restricting access to the game creator quickly became a bottleneck. I introduced inherited access so users with global LiveOps permissions are automatically added to new games, reducing manual permission management while keeping ownership explicit.
            </p>
            <div className="mt-8 w-full bg-[#E3E8F1] p-8 rounded-2xl">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610209/inherited-access.png"
                alt="Inherited access model for game permissions"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="impact">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h2>
        <OutcomeCards
          items={[
            {
              title: "~2x faster game setup",
              description: "Teams moved through game creation with clearer sequencing and fewer blockers.",
            },
            {
              title: "+3 games / quarter",
              description: "Guardrails and validation reduced risky configuration errors.",
            },
            {
              title: "Stronger ownership",
              description: "Roles and responsibilities became explicit during setup and easier to manage after launch.",
            },
            {
              title: "More scalable workflow",
              description: "The flow supported more independent launches without proportional process overhead.",
            },
          ]}
        />
      </section>
    </>
  ),
}

