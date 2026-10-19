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

export type WorkProjectPage = {
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
  | "liveops-alerting"
  | "game-setup-automation"
  | "travel-planning"
  | "design-system"
  | "release-timeline"
