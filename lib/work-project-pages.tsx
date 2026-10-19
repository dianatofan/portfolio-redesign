export type {
  WorkProjectMetaItem,
  WorkProjectPage,
  WorkProjectSection,
  WorkProjectSlug,
} from "./work-project-pages/types"

import type { WorkProjectSlug } from "./work-project-pages/types"
import { dianasDiamondsPage } from "./work-project-pages/dianas-diamonds"
import { designSystemPage } from "./work-project-pages/design-system"
import { goldenGooseMuseumPage } from "./work-project-pages/golden-goose-museum"
import { liveopsToolingPage } from "./work-project-pages/liveops-tooling"
import { releaseTimelinePage } from "./work-project-pages/release-timeline"
import { travelPlanningPage } from "./work-project-pages/travel-planning"

const workProjectPages = {
  "dianas-diamonds": dianasDiamondsPage,
  "liveops-tooling": liveopsToolingPage,
  "travel-planning": travelPlanningPage,
  "design-system": designSystemPage,
  "release-timeline": releaseTimelinePage,
  "golden-goose-museum": goldenGooseMuseumPage,
} satisfies Record<WorkProjectSlug, typeof liveopsToolingPage>

export function getWorkProjectPage(slug: string) {
  return workProjectPages[slug as WorkProjectSlug]
}
