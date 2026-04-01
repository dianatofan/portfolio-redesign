export type {
  WorkProjectMetaItem,
  WorkProjectPage,
  WorkProjectSection,
  WorkProjectSlug,
} from "./work-project-pages/types"

import type { WorkProjectSlug } from "./work-project-pages/types"
import { designSystemPage } from "./work-project-pages/design-system"
import { gameSetupAutomationPage } from "./work-project-pages/game-setup-automation"
import { liveopsAlertingPage } from "./work-project-pages/liveops-alerting"
import { travelPlanningPage } from "./work-project-pages/travel-planning"

const workProjectPages = {
  "liveops-alerting": liveopsAlertingPage,
  "game-setup-automation": gameSetupAutomationPage,
  "travel-planning": travelPlanningPage,
  "game-setup-v2": designSystemPage,
} satisfies Record<WorkProjectSlug, typeof liveopsAlertingPage>

export function getWorkProjectPage(slug: string) {
  return workProjectPages[slug as WorkProjectSlug]
}
