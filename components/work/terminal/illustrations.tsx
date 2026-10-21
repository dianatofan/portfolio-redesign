import type { ReactNode } from "react"

/*
 * The Human Redundancy Terminal drawings (Project Pages design): where the
 * terminal's tone sits between optimism and doom, and the four build steps,
 * each a small animated SVG (SMIL).
 */

const SANS = "Saans, Helvetica Neue, sans-serif"
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace"

/** Too optimistic, this terminal, pure doom: a knob in the middle of the scale. */
export function ToneScale() {
  return (
    <div className="flex flex-col gap-[18px] rounded-[14px] bg-[#f4f4f4] px-[clamp(20px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
      <div className="relative h-0.5 rounded-full bg-[#c9c8d0]">
        <span className="absolute -top-[5px] left-0 h-3 w-3 rounded-full bg-[#c9c8d0]" />
        <span className="absolute right-0 -top-[5px] h-3 w-3 rounded-full bg-[#c9c8d0]" />
        <span className="absolute -top-[11px] left-1/2 -ml-3 h-6 w-6 rounded-full bg-brand shadow-[0_0_0_6px_rgba(79,53,184,.15)]" />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4 text-[15px] leading-[1.45]">
        <span className="text-ink-muted">Too optimistic</span>
        <span className="font-medium text-brand">This terminal</span>
        <span className="text-right text-ink-muted">Pure doom</span>
      </div>
    </div>
  )
}

function Step({ n, title, children, art }: { n: string; title: string; children: ReactNode; art: ReactNode }) {
  return (
    <li className="flex min-w-0 flex-col gap-3">
      <div className="flex aspect-square items-center justify-center rounded-[14px] bg-[#f4f4f4]">
        <svg viewBox="0 0 120 120" aria-hidden className="block h-auto w-[86%] overflow-visible">
          {art}
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] text-ink-meta tabular-nums">{n}</span>
        <span className="text-[18px] leading-[1.3] font-medium tracking-[-0.01em]">{title}</span>
        <span className="text-[15px] leading-[1.45] text-ink-muted text-pretty">{children}</span>
      </div>
    </li>
  )
}

/** Find the data, find the voice, build the terminal, ship it. */
export function BuildSteps() {
  return (
    <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-4 gap-y-6 p-0">
      <Step
        n="01"
        title="Find the data"
        art={
          <>
            <rect x="18" y="26" width="84" height="68" rx="6" fill="#fff" stroke="#16151a" strokeWidth="1.1" />
            <path d="M18 40 H102" stroke="#16151a" strokeWidth="1.1" />
            <path d="M46 26 V94 M74 26 V94 M18 52 H102 M18 64 H102 M18 76 H102 M18 88 H102" stroke="#e4e3e8" />
            {[
              [24, "role"],
              [51, "risk"],
              [79, "salary"],
            ].map(([x, t]) => (
              <text key={t} x={x} y="36" fontFamily={SANS} fontSize="6" fontWeight="500" fill="#16151a">
                {t}
              </text>
            ))}
            {/* A highlight stepping down the rows, like reading the table. */}
            <rect x="18" y="40" width="84" height="12" fill="#4f35b8" opacity=".12">
              <animate attributeName="y" values="40;52;64;76;40" keyTimes="0;.25;.5;.75;1" calcMode="discrete" dur="3.2s" repeatCount="indefinite" />
            </rect>
          </>
        }
      >
        The{" "}
        <a
          href="https://www.kaggle.com/datasets/sahilislam007/ai-impact-on-job-market-20242030"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink underline decoration-[#c9c8d0] underline-offset-[3px] transition-colors hover:text-brand hover:decoration-brand"
        >
          AI Impact on Job Market ↗
        </a>{" "}
        dataset on Kaggle, 2024–2030.
      </Step>
      <Step
        n="02"
        title="Find the voice"
        art={
          <>
            <path d="M22 30 H98 V70 H58 L44 84 V70 H22 Z" fill="#fff" stroke="#16151a" strokeWidth="1.1" strokeLinejoin="round" />
            <text x="30" y="46" fontFamily={SANS} fontSize="7" fill="#8b8e95">
              <tspan>AI will take</tspan>
              <tspan x="30" dy="10">
                your job.
              </tspan>
              <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.4;.5;.9;1" dur="4s" repeatCount="indefinite" />
            </text>
            <text x="30" y="46" fontFamily={SANS} fontSize="7" fontWeight="500" fill="#16151a" opacity="0">
              <tspan>Not redundant.</tspan>
              <tspan x="30" dy="10" fill="#4f35b8">
                Yet.
              </tspan>
              <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.45;.55;.9;1" dur="4s" repeatCount="indefinite" />
            </text>
          </>
        }
      >
        Savage, brutally honest, a bit unhinged. Basically my sense of humour.
      </Step>
      <Step
        n="03"
        title="Build the terminal"
        art={
          <>
            <rect x="14" y="28" width="92" height="64" rx="7" fill="#16151a" />
            {[22, 28, 34].map((cx) => (
              <circle key={cx} cx={cx} cy="35" r="1.6" fill="#3d3c44" />
            ))}
            <text x="22" y="52" fontFamily={MONO} fontSize="7" fill="#7b5cff">
              &gt;
            </text>
            <text x="29" y="52" fontFamily={MONO} fontSize="7" fill="#fff">
              role: design
            </text>
            <rect x="22" y="62" width="0" height="3" rx="1.5" fill="#7b5cff">
              <animate attributeName="width" values="0;0;34;34;0" keyTimes="0;.2;.5;.9;1" dur="3.6s" repeatCount="indefinite" />
            </rect>
            <rect x="22" y="72" width="0" height="3" rx="1.5" fill="#fff">
              <animate attributeName="width" values="0;0;56;56;0" keyTimes="0;.35;.65;.9;1" dur="3.6s" repeatCount="indefinite" />
            </rect>
            <rect x="82" y="46" width="4" height="7" fill="#fff">
              <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
            </rect>
          </>
        }
      >
        Prototyped in Google AI Studio, refined with Copilot.
      </Step>
      <Step
        n="04"
        title="Ship it"
        art={
          <>
            <rect x="20" y="30" width="80" height="56" rx="6" fill="#fff" stroke="#16151a" strokeWidth="1.1" />
            <path d="M20 42 H100" stroke="#16151a" strokeWidth="1.1" />
            <rect x="34" y="34" width="52" height="5" rx="2.5" fill="#f4f4f4" stroke="#e4e3e8" strokeWidth=".6" />
            <text x="60" y="38" textAnchor="middle" fontFamily={SANS} fontSize="3.6" fill="#6f6d78">
              dianatofan.github.io
            </text>
            <circle cx="60" cy="64" r="9" fill="none" stroke="#4f35b8" strokeWidth="1.4">
              <animate attributeName="r" values="6;10;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;.3;1" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="64" r="3.2" fill="#4f35b8" />
            <text x="60" y="80" textAnchor="middle" fontFamily={SANS} fontSize="6" fontWeight="500" fill="#16151a">
              Live
            </text>
          </>
        }
      >
        Live on GitHub Pages for anyone to try.
      </Step>
    </ol>
  )
}
