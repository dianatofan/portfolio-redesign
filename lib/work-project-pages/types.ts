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

export type WorkProjectPage = {
  displayTitle?: ReactNode
  subtitle?: string
  heroImage?: string
  description?: string
  meta: WorkProjectMetaItem[]
  sections: WorkProjectSection[]
  renderBeforeGate: () => ReactNode
  renderAfterGate?: () => ReactNode
}

export type WorkProjectSlug =
  | "liveops-alerting"
  | "game-setup-automation"
  | "travel-planning"
  | "game-setup-v2"

