import type { ReactNode } from "react"

export type WorkProjectSection = {
  id: string
  title: string
  isParent?: boolean
  parent?: string
  isGateStart?: boolean
}

export type WorkProjectMetaItem = {
  label: string
  values: string[]
}

export type WorkProjectHighlight = {
  title: string
  description: string
}

// One beat of a short, blog-style write-up: a numbered title, a few short
// sentences, and an optional visual beside them.
export type WorkStoryStep = {
  title: string
  text: string[]
  visual?: ReactNode
}

export type WorkProjectPage = {
  // Side projects read as short posts: numbered steps, no table of contents.
  story?: WorkStoryStep[]
  published?: string
  readTime?: string
  displayTitle?: ReactNode
  // Headline results, shown publicly under the meta row. Locked case studies
  // keep their full write-up behind the gate, but the outcome is never hidden.
  highlights?: WorkProjectHighlight[]
  subtitle?: string
  heroImage?: string
  // A recording to play in place of the hero still; heroImage is its poster.
  heroVideo?: string
  // The hero frame's shape, when the image isn't 16:9 (so it isn't cropped), e.g. "aspect-[2400/847]".
  heroAspect?: string
  // "Fig. 1" caption under the hero. Falls back to the project's short name.
  heroCaption?: string
  // Replaces "Fig. 1" as the caption's ink lead-in, e.g. "Why diamonds?".
  heroCaptionLabel?: string
  // "v3": Diana's Diamonds. The v4 title block and body, but the hero keeps its
  // caption, and the stats sit under an ink rule instead of the bars.
  // "v4": the LiveOps layout. A 16:9 hero with no caption, eyebrow with read
  // time over an 80px title, a stat with before/after bars, the at-a-glance
  // box, and Previous / Next at the end. The body draws its own section spacing.
  layout?: "v3" | "v4"
  // The stat band (v4), when the figures aren't the highlights' leading numbers.
  stats?: { value: string; label: string }[]
  // The at-a-glance box under the stats (v4).
  glance?: { problem: string; did: string; outcome: string }
  description?: string
  meta: WorkProjectMetaItem[]
  sections: WorkProjectSection[]
  renderBeforeGate: () => ReactNode
  renderAfterGate?: () => ReactNode
}

export type WorkProjectSlug =
  | "dianas-diamonds"
  | "golden-goose-museum"
  | "liveops-alerting"
  | "game-setup-automation"
  | "travel-planning"
  | "design-system"
  | "release-timeline"
