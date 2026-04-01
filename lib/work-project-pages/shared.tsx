import Image from "next/image"
import type { LucideIcon } from "lucide-react"

export function InsightCards({
  items,
}: {
  items: Array<{
    title: string
    description: string
  }>
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground">{item.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export function ConstraintCards({
  items,
}: {
  items: Array<{
    title: string
    description: string
    icon: LucideIcon
  }>
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <div key={item.title} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-foreground">
              <Icon size={18} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export function OutcomeCards({
  items,
}: {
  items: Array<{
    title: string
    description: string
  }>
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="bg-accent/20 p-6 rounded-lg">
          <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">{item.title}</p>
          <p className="text-base text-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

export function CaseStudyImage({
  src,
  alt,
  priority = false,
  background = true,
}: {
  src: string
  alt: string
  priority?: boolean
  background?: boolean
}) {
  return (
    <div
      className={`mt-8 relative aspect-video overflow-hidden ${background ? "rounded-lg bg-card" : ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
    </div>
  )
}

