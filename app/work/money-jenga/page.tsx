import type { Metadata } from "next"
import Image from "next/image"
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
          <div className="relative overflow-hidden rounded-2xl bg-[#1a1410] px-6 py-12 md:px-16 md:py-16">
            {/* A warm glow behind the logo, so its ink outline and drop shadow still read on brown. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 40% 55% at 33% 50%, rgba(233,185,73,.22), rgba(233,185,73,.06) 55%, transparent 80%)",
              }}
            />
            {/* The prototype's own film grain. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              }}
            />
            <div className="relative mx-auto grid max-w-[1000px] grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,1fr)_300px] md:gap-16">
              <div className="flex flex-col items-center gap-8">
                <h1 className="sr-only">Money Jenga</h1>
                <Logo />
                <div className="max-w-md text-center">
                  <p className="text-lg leading-relaxed text-[#f4ead6]">
                    A budget app where every purchase pulls a block out of a tower of cash. No bank details
                    needed.
                  </p>
                  <p className="mt-4 text-sm text-[#c9b48a]">October 2026 · 2 min read · SwiftUI, built with Claude Code</p>
                </div>
              </div>
              <div className="mx-auto w-[260px] md:w-[300px]">
                <PlayablePhone
                  src="/money-jenga-prototype/index.html"
                  facade="/images/money-jenga/play-facade.webp"
                  label="Money Jenga prototype"
                  eventName="money_jenga_play"
                />
                <p className="mt-4 text-center text-xs text-[#a8987a]">The HTML prototype I built it from</p>
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
        <div className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1fr)_260px] md:gap-16">
          <ul className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 md:grid-cols-1">
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
          <figure className="mx-auto w-[220px] md:w-[260px]">
            <Image
              src="/images/money-jenga/native-autopull.webp"
              alt="The native app's Auto-Pull sheet: log Apple Pay purchases without typing. Only the amount and shop are shared, never your card or bank. Five steps to set up the Shortcuts automation."
              width={540}
              height={1174}
              className="h-auto w-full drop-shadow-[0_20px_30px_rgba(28,22,17,0.25)]"
            />
            <figcaption className="mt-3 text-center text-xs text-[var(--text-tertiary)]">The native app&apos;s setup guide</figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 pt-20 md:pt-28">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">It keeps me on pace</h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
            The budget is spread evenly over the month. Spend faster than that and the tower shakes. Stay
            under it and the cat under the table keeps sleeping.
          </p>
        </div>
        <div className="mt-8">
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
