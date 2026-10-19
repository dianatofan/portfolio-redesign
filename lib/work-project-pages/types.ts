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
  description?: string
  meta: WorkProjectMetaItem[]
  sections: WorkProjectSection[]
  renderBeforeGate: () => ReactNode
  renderAfterGate?: () => ReactNode
}

export type WorkProjectSlug =
  | "dianas-diamonds"
  | "golden-goose-museum"
  | "liveops-tooling"
  | "travel-planning"
  | "design-system"
  | "release-timeline"
