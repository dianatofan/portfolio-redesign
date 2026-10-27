import Link from "next/link"
import type { ReactNode } from "react"

/**
 * A case study's title: an eyebrow back to the work with the read time, the
 * title over 9 columns, and the standfirst under it.
 */
export function CaseHeader({
  company,
  readTime,
  title,
  subtitle,
}: {
  company?: string
  readTime?: string
  title: ReactNode
  subtitle?: string
}) {
  return (
    <div className="flex flex-col gap-[18px] xl:max-w-[75%]">
      <span className="flex flex-wrap items-baseline gap-3 text-[13px] text-ink-meta">
        <Link href="/#work" className="transition-colors hover:text-brand">
          ← Case study · {company}
        </Link>
        {readTime && (
          <>
            <span aria-hidden="true">·</span>
            <span>{readTime}</span>
          </>
        )}
      </span>
      <h1 className="m-0 text-[clamp(40px,5.2vw,80px)] font-medium leading-none tracking-[-0.045em] text-balance">
        {title}
      </h1>
      {subtitle ? (
        <p className="m-0 max-w-[760px] text-[24px] leading-[1.3] tracking-[-0.015em] text-[#3d3c44] text-pretty">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
