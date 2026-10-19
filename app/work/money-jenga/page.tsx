import type { Metadata } from "next"
import Link from "next/link"
import { Luckiest_Guy, Rye } from "next/font/google"
import { ChevronLeft, ChevronRight, CreditCard, EyeOff, Smartphone, Cloud } from "lucide-react"
import { Footer } from "@/components/footer"
import { MoneyJengaScroll } from "@/components/work/money-jenga-scroll"
import { MoneyJengaPaceChart } from "@/components/work/money-jenga-pace-chart"
import { PlayablePhone } from "@/components/work/playable-phone"

// A static route, like /work/release-timeline: the scroll story needs its own
// page layout, so it takes precedence over the dynamic [slug] template.

// The app's own faces, used only for its logo on the hero.
const display = Luckiest_Guy({ weight: "400", subsets: ["latin"], display: "swap" })
const poster = Rye({ weight: "400", subsets: ["latin"], display: "swap" })

const INK = "#1c1611"

/** The game's title lockup, with the same styles as the prototype's setup screen. */
function Logo() {
  return (
    <div className="flex flex-col items-center text-center" role="img" aria-label="Money Jenga: The tower of life">
      <span
        aria-hidden
        className={`${poster.className} text-[13px] tracking-[0.3em] text-[#e9b949] md:text-[15px]`}
        style={{ textShadow: `2px 2px 0 ${INK}` }}
      >
        ~ PRESENTING ~
      </span>
      <span
        aria-hidden
        className={`${display.className} mt-3 text-[68px] leading-[0.86] text-[#e9b949] md:text-[96px]`}
        style={{
          WebkitTextStroke: `4px ${INK}`,
          paintOrder: "stroke fill",
          textShadow: `-3px 0 0 rgba(230,30,60,.5), 3px 0 0 rgba(40,170,230,.4), 6px 6px 0 ${INK}`,
          transform: "rotate(-3deg)",
        }}
      >
        MONEY
        <br />
        JENGA
      </span>
      <span
        aria-hidden
        className={`${poster.className} mt-5 bg-[#c7372f] px-7 py-[7px] text-[13px] tracking-[0.12em] text-[#f2e6c9] md:text-[14px]`}
        style={{ border: `3px solid ${INK}`, clipPath: "polygon(0 0,100% 0,94% 50%,100% 100%,0 100%,6% 50%)" }}
      >
        THE TOWER OF LIFE
      </span>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Money Jenga - Diana Tofan",
  description:
    "An iPhone budget app where every purchase pulls a block out of a tower of cash. No bank details needed. Built in SwiftUI with Claude Code.",
}

const integrations = [
  {
    icon: CreditCard,
    title: "Apple Pay logs itself",
    text: "A Shortcuts automation pulls a block for every Apple Pay payment. I never open the app to log one.",
  },
  {
    icon: EyeOff,
    title: "Card numbers never saved",
    text: "Anything that looks like a card number or IBAN is masked before a purchase is stored.",
  },
  {
    icon: Smartphone,
    title: "On my lock screen",
    text: "A widget shows the tower, so I see what's left without opening anything.",
  },
  {
    icon: Cloud,
    title: "My iCloud, no one else's",
    text: "No account and no server. It syncs through my own private iCloud, with backups to iCloud Drive.",
  },
]

export default function MoneyJengaPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex items-center justify-between gap-6">
          <Link
            href="/#built-in-code"
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            <ChevronLeft size={16} aria-hidden />
            Back
          </Link>
          <Link
            href="/work/golden-goose-museum"
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            Next: Golden Goose
            <ChevronRight size={16} aria-hidden />
          </Link>
        </div>
      </header>

      {/* Hero: the game's own title screen, with the real prototype to play */}
      <section className="pt-24 md:pt-28">
        <div className="mx-auto max-w-[1800px] px-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#f2e7cf] px-6 py-12 md:px-16 md:py-16">
            {/* The prototype's sunburst and glow, so the logo sits on its real backdrop. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-12 blur-[12px]"
              style={{
                background:
                  "repeating-conic-gradient(from 0deg at 35% 55%, #f2e7cf 0deg 7deg, #d1bc93 12deg 20deg, #f2e7cf 25deg 28deg)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 45% 55% at 35% 55%, rgba(255,252,242,.92), rgba(245,232,205,.4) 55%, transparent 85%)",
              }}
            />
            <div className="relative mx-auto grid max-w-[1000px] grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_300px] md:gap-16">
              <div className="flex flex-col items-center gap-8">
                <h1 className="sr-only">Money Jenga</h1>
                <Logo />
                <div className="max-w-md text-center">
                  <p className="text-lg leading-relaxed" style={{ color: INK }}>
                    A budget app where every purchase pulls a block out of a tower of cash. No bank details
                    needed.
                  </p>
                  <p className="mt-4 text-sm text-[#6b5a41]">October 2026 · 2 min read · SwiftUI, built with Claude Code</p>
                </div>
              </div>
              <div className="mx-auto w-[260px] md:w-[300px]">
                <PlayablePhone
                  src="/money-jenga-prototype/index.html"
                  facade="/images/money-jenga/play-facade.webp"
                  label="Money Jenga prototype"
                  eventName="money_jenga_play"
                />
                <p className="mt-4 text-center text-xs text-[#6b5a41]">The HTML prototype I built it from</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">Why I made it</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-[var(--text-secondary)]">
            <p>
              I like splurging on clothes and other things, so I wanted a way to manage my money. Every
              budgeting app I found wanted my <span className="font-medium text-foreground">bank account details</span>,
              and I didn&apos;t want to share them.
            </p>
            <p>
              So I made my own. Put in <span className="font-medium text-foreground">one sum a month</span>, take
              money out of it as I spend, and make it fun enough that I actually look.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#16110e] px-6 py-8 md:py-16">
        <MoneyJengaScroll />
      </section>

      <section className="mx-auto max-w-[1100px] px-6 pt-20 md:pt-28">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">Smart, but private</h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
            Typing every purchase in by hand keeps it private, but it gets old fast. So the app does the
            typing for me, without ever seeing my bank.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {integrations.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4ead6] text-[#c8372d]">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <p className="text-base font-medium text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 pt-20 md:pt-28">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">It keeps me on pace</h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
            The budget is spread evenly over the month. Spend faster than that and the tower shakes. Stay
            under it and the cat under the table keeps sleeping.
          </p>
        </div>
        <div className="mt-8 max-w-3xl">
          <MoneyJengaPaceChart />
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">Built in two days</h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
            I designed it first as the HTML prototype above, with a written spec for every screen. Then I had
            Claude Code build it natively in SwiftUI and SpriteKit, and port the tower logic exactly. It runs on
            my iPhone, and isn&apos;t on the App Store yet.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
