"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"
import "./liveops.css"

/*
 * The LiveOps Alerting illustrations: the reward flow with its three states,
 * the gap between engineering tools and the Dashboard, and a sketch of the
 * alerting homepage. Drawn in HTML so they stay sharp and can move.
 */

const red = "#e5484d"
const green = "#30a46c"
const purple = "#4f35b8"
const coin = "radial-gradient(circle at 35% 30%,#ffe58a,#f5b301 60%,#c98a00)"

/** A pill row of tabs, the selected one in ink. */
export function Tabs({
  labels,
  value,
  onChange,
  className = "",
}: {
  labels: string[]
  value: number
  onChange: (index: number) => void
  className?: string
}) {
  return (
    <div role="tablist" className={`flex flex-wrap justify-center gap-0.5 rounded-full p-[3px] ${className}`}>
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={i === value}
          onClick={() => onChange(i)}
          className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-200 ${
            i === value ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/** A dashed connector with a dot travelling along it. */
function Wire({ animation, color, hidden }: { animation: string; color: string; hidden?: boolean }) {
  return (
    <div aria-hidden className="relative mt-5 hidden h-0 self-center border-t-[1.5px] border-dashed border-[#c9c8d0] min-[720px]:block">
      <span
        key={animation}
        className="lo-pkt absolute top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: color, opacity: hidden ? 0 : 1, animation: animation === "none" ? "none" : `${animation} 3s cubic-bezier(.4,0,.2,1) infinite` }}
      />
    </div>
  )
}

const flowModes = [
  {
    tab: "Ideal flow",
    caption: "A creator schedules a reward, the backend delivers it, and the player gets it.",
    alert: false,
    status: ["Status: live", green],
    wires: [["loSeg1", purple], ["loSeg2", purple]],
    backend: ["Delivered", green, false],
    player: "Player gets 500 coins",
    reward: true,
  },
  {
    tab: "When it fails",
    caption: "The reward fails and the player sees an error, but the Dashboard still says everything is live.",
    alert: false,
    status: ["Status: live", green],
    wires: [["loSeg1", purple], ["loSeg2", red]],
    backend: ["Delivery failed", red, true],
    player: "Player sees an error",
    reward: false,
  },
  {
    tab: "With alerting",
    caption:
      "The failure is reported back to the Dashboard. The reward hasn't reached players yet, so the owner can fix it before anyone sees an error.",
    alert: true,
    status: ["1 critical issue", red],
    wires: [["loSegBack", red], ["none", purple]],
    backend: ["Failure reported", red, false],
    player: "Player isn't affected",
    reward: false,
  },
] as const

/** Creator → backend → player, in the three states the tabs pick. */
export function RewardFlow() {
  const [mode, setMode] = useState(0)
  const m = flowModes[mode]
  const failed = m.backend[1] === red

  return (
    <figure className="lo-anim m-0 flex flex-col gap-3">
      <div className="flex w-full flex-col items-center gap-5 rounded-[20px] bg-[#f6f7f8] px-[clamp(20px,4vw,48px)] py-[clamp(20px,2.4vw,32px)]">
        <Tabs labels={flowModes.map((f) => f.tab)} value={mode} onChange={setMode} className="bg-white" />
        <div className="grid w-full grid-cols-1 items-center gap-6 min-[720px]:grid-cols-[1.2fr_64px_1fr_64px_150px] min-[720px]:gap-3">
          {/* The Dashboard */}
          <div className="flex flex-col gap-2">
            <span className="text-[13px] text-ink-muted">Creator schedules a reward</span>
            <div className="grid grid-cols-[14px_1fr] overflow-hidden rounded-[10px] border border-[#dcdde2] bg-white/60">
              <span className="bg-ink" />
              <div className="flex flex-col gap-[7px] p-3">
                <div
                  className="overflow-hidden transition-[max-height,opacity,transform] duration-[400ms] ease-[cubic-bezier(.2,0,0,1)]"
                  style={{ maxHeight: m.alert ? 80 : 0, opacity: m.alert ? 1 : 0, transform: m.alert ? "none" : "translateY(-6px)" }}
                >
                  <div className="mb-1.5 flex items-start gap-2 rounded-lg px-2.5 py-2 text-white" style={{ background: red }}>
                    <span className="h-4 w-4 flex-none rounded-full bg-white text-center text-[11px] leading-4 font-semibold" style={{ color: red }}>
                      !
                    </span>
                    <span className="flex flex-col gap-0.5 text-[12px] leading-[1.35]">
                      <span className="font-medium">Critical: reward not delivered</span>
                      <span className="opacity-85">Rewards service timed out · View issue →</span>
                    </span>
                  </div>
                </div>
                <span className="text-[13px] leading-[1.3] font-medium">Holiday bonus</span>
                <span className="flex items-center gap-1.5 text-[12px] text-ink-muted">
                  <span className="h-3 w-3 rounded-full" style={{ background: coin }} />
                  500 coins to all players
                </span>
                <span className="mt-1 rounded-md bg-ink p-1.5 text-center text-[12px] text-white">Schedule</span>
                <span className="mt-0.5 flex items-center gap-1.5 rounded-md bg-[#f1f2f4] px-2 py-1 text-[12px]">
                  <span className="h-[7px] w-[7px] rounded-full" style={{ background: m.status[1] }} />
                  {m.status[0]}
                </span>
              </div>
            </div>
          </div>

          <Wire animation={m.wires[0][0]} color={m.wires[0][1]} />

          {/* The backend */}
          <div className="flex flex-col gap-2" style={{ animation: m.backend[2] ? "loShake 3s ease-in-out infinite" : "none" }}>
            <span className="text-[13px] text-ink-muted">Backend delivers it</span>
            <div
              className="flex flex-col gap-2.5 rounded-[10px] border-[1.5px] bg-white/60 p-3.5 transition-colors duration-300"
              style={{ borderColor: failed ? red : "#dcdde2" }}
            >
              <div className="flex flex-col gap-1.5">
                <span className="h-1.5 rounded-[3px] bg-[#dcdde2]" />
                <span className="h-1.5 w-[70%] rounded-[3px] bg-[#dcdde2]" />
                <span className="h-1.5 w-[85%] rounded-[3px] bg-[#dcdde2]" />
              </div>
              <span className="flex items-center gap-1.5 text-[12px]" style={{ color: failed ? red : "#8b8e95" }}>
                <span className="h-[7px] w-[7px] rounded-full" style={{ background: m.backend[1] }} />
                {m.backend[0]}
              </span>
            </div>
          </div>

          <Wire animation={m.wires[1][0]} color={m.wires[1][1]} hidden={m.wires[1][0] === "none"} />

          {/* The player */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[13px] text-ink-muted">{m.player}</span>
            <Phone reward={m.reward} error={mode === 1} />
          </div>
        </div>
      </div>
      <figcaption className="text-[13px] text-ink-meta">
        <span className="text-ink">{m.tab}</span> — {m.caption}
      </figcaption>
    </figure>
  )
}

function Phone({ reward, error }: { reward: boolean; error: boolean }) {
  const coins: CSSProperties[] = [
    { left: "10%", top: "40%" },
    { left: "37%", top: "48%" },
    { left: "64%", top: "40%" },
    { left: "23%", top: "18%" },
    { left: "51%", top: "18%" },
    { left: "37%", top: "0%" },
  ]
  return (
    <div aria-hidden className="w-[130px] rounded-[22px] bg-ink p-[5px] shadow-[0_10px_24px_-12px_rgba(22,21,26,.5)]">
      <div className="relative aspect-[9/19] overflow-hidden rounded-[17px] bg-[linear-gradient(180deg,#6ec6ff_0%,#a9dcff_45%,#e9f6ff_70%,#fff_100%)]">
        <span className="absolute top-[5px] left-1/2 z-[3] -ml-4 h-2 w-8 rounded-full bg-ink" />
        <div className="absolute top-[22px] right-2 left-2 flex justify-between text-[9px] leading-none font-medium text-ink">
          <span className="rounded-full bg-white/80 px-1.5 py-[3px]">Lvl 12</span>
          <span className="flex items-center gap-[3px] rounded-full bg-white/80 px-1.5 py-[3px]">
            <span className="h-[9px] w-[9px] rounded-full" style={{ background: coin }} />
            1,240
          </span>
        </div>
        <span className="absolute -right-[10%] -bottom-[6%] -left-[10%] h-[34%] rounded-[50%_50%_0_0] bg-[#8fd16a]" />
        <span className="absolute -right-[20%] -bottom-[10%] left-[30%] h-[30%] rounded-[50%_50%_0_0] bg-[#6fbf4c]" />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-[450ms]"
          style={{ opacity: reward ? 1 : 0 }}
        >
          <span className="rounded-lg bg-[#ffd54a] px-2.5 py-[5px] text-center text-[12px] leading-[1.1] font-medium text-ink">
            +500 coins
            <br />
            <span className="text-[9px] font-normal">Holiday bonus</span>
          </span>
          <div className="relative aspect-[1.2] w-[64%]">
            {coins.map((pos, i) => (
              <span
                key={i}
                className="absolute aspect-square w-[26%] rounded-full shadow-[inset_0_-2px_0_rgba(0,0,0,.15)]"
                style={{ ...pos, background: coin }}
              />
            ))}
          </div>
          <span className="rounded-full bg-brand px-[18px] py-[5px] text-[11px] leading-[1.2] font-medium text-white">Claim</span>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center bg-ink/35 transition-opacity duration-[450ms]"
          style={{ opacity: error ? 1 : 0 }}
        >
          <div className="flex w-[78%] flex-col items-center gap-1.5 rounded-xl bg-white px-2.5 py-3 text-center">
            <span className="h-[22px] w-[22px] rounded-full text-[13px] leading-[22px] font-medium text-white" style={{ background: red }}>
              !
            </span>
            <span className="text-[11px] leading-[1.3] font-medium text-ink">Something went wrong</span>
            <span className="text-[9px] leading-[1.3] text-ink-muted">Your reward couldn&apos;t be delivered.</span>
            <span className="mt-0.5 rounded-full bg-ink px-3.5 py-1 text-[10px] leading-[1.2] text-white">Retry</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const tools = ["Monitoring", "Logs", "Slack", "Support tickets", "Player metrics"]
const swatches = ["#e5484d", "#f76b15", "#e2a336", "#30a46c", "#12a594", "#0090ff", "#3e63dd", "#8e4ec6"]

function Tile({ color }: { color?: string }) {
  if (!color) return <span />
  return (
    <span className="flex items-center gap-1.5 rounded-md border border-hairline bg-white p-1.5">
      <span className="h-3.5 w-3.5 rounded" style={{ background: color }} />
      <span className="flex flex-1 flex-col gap-[3px]">
        <span className="h-1 w-[70%] rounded-sm bg-[#c9c8d0]" />
        <span className="h-[3px] w-1/2 rounded-sm bg-hairline" />
      </span>
    </span>
  )
}

/** Every engineering tool lights up; the Dashboard says "No alerts". */
export function ObservabilityGap({ caption }: { caption: ReactNode }) {
  return (
    <figure className="lo-anim m-0 flex flex-col gap-3">
      <div className="grid grid-cols-1 items-center gap-6 rounded-[20px] bg-[#f6f7f8] px-[clamp(20px,4vw,48px)] py-[clamp(20px,2.4vw,32px)] min-[720px]:grid-cols-[.9fr_72px_1.6fr] min-[720px]:gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-ink-muted">Engineering tools</span>
          {tools.map((t, i) => (
            <div
              key={t}
              className="flex items-center justify-between gap-2 rounded-lg border border-hairline px-2.5 py-2 text-[12px]"
              style={{ animation: `loAlert 6s ease-in-out ${i * 0.45}s infinite` }}
            >
              <span>{t}</span>
              <span
                className="h-3.5 w-3.5 rounded-full bg-[#c9c8d0] text-center text-[10px] leading-[14px] font-semibold text-white"
                style={{ animation: `loDot 6s ease-in-out ${i * 0.45}s infinite` }}
              >
                !
              </span>
            </div>
          ))}
        </div>
        <div aria-hidden className="relative mt-5 hidden h-0 border-t-[1.5px] border-dashed border-[#c9c8d0] min-[720px]:block">
          <span
            className="lo-pkt absolute top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: red, animation: "loSegStop 2.4s cubic-bezier(.4,0,.2,1) infinite" }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-ink-muted">LiveOps Dashboard</span>
          <div className="grid grid-cols-[26px_1fr] overflow-hidden rounded-[10px] border border-[#dcdde2] bg-white/70">
            <div className="flex flex-col items-center gap-1.5 bg-ink py-2.5">
              {swatches.map((c) => (
                <span key={c} className="h-3.5 w-3.5 rounded-[3px]" style={{ background: c }} />
              ))}
            </div>
            <div className="flex flex-col gap-2.5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium">Hello, Diana</span>
                <span className="flex items-center gap-1.5 rounded-full border border-hairline bg-white px-2 py-[3px] text-[12px]">
                  <span className="h-[7px] w-[7px] rounded-full" style={{ background: green }} />
                  No alerts
                </span>
              </div>
              <span className="text-[11px] text-ink-meta">Experiments</span>
              <div className="grid grid-cols-3 gap-1.5">
                <Tile color="#12a594" />
                <Tile color="#f76b15" />
                <Tile color="#8e4ec6" />
              </div>
              <span className="text-[11px] text-ink-meta">Game items</span>
              <div className="grid grid-cols-3 gap-1.5">
                <Tile color="#30a46c" />
                <Tile color="#3e63dd" />
                <Tile />
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="text-[13px] text-ink-meta">
        <span className="text-ink">Illustration</span> — {caption}
      </figcaption>
    </figure>
  )
}

/** A failure reaches the homepage as a banner and the sidebar as a badge. */
export function AlertingSketch({ caption }: { caption: ReactNode }) {
  const row = (delay: string, tint: string, a: string, b: string) => (
    <span className="flex items-center gap-2.5" style={{ animation: `loRow 7s ease-out ${delay} infinite` }}>
      <span className="h-7 w-7 rounded-lg" style={{ background: tint }} />
      <span className="flex flex-1 flex-col gap-1.5">
        <span className="h-[7px] rounded bg-[#c9c8d0]" style={{ width: a }} />
        <span className="h-1.5 rounded bg-hairline" style={{ width: b }} />
      </span>
    </span>
  )
  return (
    <figure className="lo-anim m-0 flex flex-col gap-3">
      <div aria-hidden className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[14px] bg-[#f1f2f4] min-[720px]:aspect-[21/9]">
        <div className="grid h-[76%] w-[86%] grid-cols-[22%_1fr] overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(22,21,26,.08)] min-[720px]:w-[78%]">
          <div className="flex flex-col gap-3 border-r border-hairline px-3.5 py-[18px]">
            <span className="h-2 w-[60%] rounded bg-ink" />
            <span className="flex items-center justify-between">
              <span className="h-[7px] w-[62%] rounded bg-[#dcdde2]" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand" style={{ animation: "loPulse 1.6s ease-in-out infinite" }} />
            </span>
            <span className="h-[7px] w-[70%] rounded bg-[#dcdde2]" />
            <span className="h-[7px] w-[54%] rounded bg-[#dcdde2]" />
            <span className="h-[7px] w-[66%] rounded bg-[#dcdde2]" />
          </div>
          <div className="flex flex-col gap-3 overflow-hidden p-[18px]">
            <div
              className="flex items-center gap-2.5 rounded-lg bg-ink px-3.5 py-2.5 text-[13px] text-white"
              style={{ animation: "loBanner 7s ease-in-out infinite" }}
            >
              <span className="h-2 w-2 flex-none rounded-full bg-[#7b5cff]" />
              <span className="truncate">2 critical issues need attention</span>
              <span className="ml-auto hidden text-[#a3a1ad] sm:inline">View →</span>
            </div>
            {row(".2s", "#ece9ff", "46%", "72%")}
            {row(".5s", "#f1f2f4", "38%", "64%")}
            {row(".8s", "#f1f2f4", "52%", "58%")}
          </div>
        </div>
      </div>
      <figcaption className="text-[13px] text-ink-meta">
        <span className="text-ink">Illustration</span> — {caption}
      </figcaption>
    </figure>
  )
}

export type Media = { label: string; alt: string; caption?: string; video?: string; image?: string; width?: number; height?: number }

/** Several recordings in one frame; tabs under it switch between them. An item's own caption wins over the shared one. */
export function TabbedMedia({ items, caption }: { items: Media[]; caption?: ReactNode }) {
  const [sel, setSel] = useState(0)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-[14px] bg-[#f1f2f4]">
        {items.map((item, i) => (
          <div
            key={item.label}
            aria-hidden={i !== sel}
            className="absolute inset-0 transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(.2,0,0,1)]"
            style={{ opacity: i === sel ? 1 : 0, transform: i === sel ? "none" : "translateY(6px) scale(.99)" }}
          >
            {item.video ? (
              <video src={item.video} autoPlay loop muted playsInline aria-label={item.alt} className="h-full w-full object-contain" />
            ) : (
              <Image src={item.image!} alt={item.alt} fill className="object-contain" sizes="(min-width: 1280px) 1200px, 100vw" />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <figcaption className="text-[13px] text-ink-meta">
          <span className="text-ink [counter-increment:fig] before:content-['Fig._'_counter(fig)]" /> — {items[sel].caption ?? caption}
        </figcaption>
        <Tabs labels={items.map((i) => i.label)} value={sel} onChange={setSel} className="ml-auto bg-[#f1f2f4]" />
      </div>
    </figure>
  )
}
