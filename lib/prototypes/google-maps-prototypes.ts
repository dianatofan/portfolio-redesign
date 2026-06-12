export type PrototypeStatus = "APPROVED" | "REJECTED"
export type PrototypeDevice = "mobile" | "desktop"

export type Prototype = {
  id: string
  title: string
  question: string
  solution: string
  outcome: string
  status: PrototypeStatus
  device: PrototypeDevice
  /** Placeholder media filename for now; swap for a real GIF/video later. */
  media: string
  /** Extra context shown on hover of the info icon after the outcome. */
  details?: string
}

/**
 * Prototype deck data. Add new explorations here without touching the card
 * component — the deck renders whatever lives in this array.
 */
export const googleMapsPrototypes: readonly Prototype[] = [
  {
    id: "travel-discovery",
    title: "Travel Discovery in Search",
    question: "How can Search support travel discovery, not just information retrieval?",
    solution:
      "I prototyped a visual travel module that appeared for high-intent travel queries, surfacing destinations, imagery, maps, and travel content directly within Search results.",
    outcome:
      "This exploration contributed to a broader shift toward more visual, widget-based travel experiences in Search.",
    status: "APPROVED",
    device: "desktop",
    media: "travel-discovery.gif",
    details:
      "Built as a React prototype against live Search components so PMs and designers could click through real queries before any backend work.",
  },
  {
    id: "pin-clustering",
    title: "Testing Map Density Through Pin Clustering",
    question: "How much information can we show on a map before it becomes overwhelming?",
    solution:
      "I explored clustering strategies across zoom levels, balancing geographic accuracy with visual clarity.",
    outcome: "The work informed discussions around map density and information hierarchy.",
    status: "APPROVED",
    device: "mobile",
    media: "pin-clustering.gif",
    details:
      "Tested several clustering thresholds with real map data to find the point where density stopped helping and started hurting scanability.",
  },
  {
    id: "geopolitical-bottom-sheet",
    title: "Geopolitical Information Bottom Sheet",
    question:
      "How can Maps communicate complex geopolitical information without overwhelming the map itself?",
    solution:
      "I designed a multi-page bottom sheet that progressively revealed context while keeping the map as the primary focus.",
    outcome: "The interaction model was adopted and shipped in production.",
    status: "APPROVED",
    device: "mobile",
    media: "geopolitical-bottom-sheet.gif",
    details:
      "The multi-page sheet pattern shipped and became a reusable way to layer dense context without covering the map.",
  },
  {
    id: "progressive-disclosure",
    title: "Progressive Disclosure Through Zoom",
    question: "How should information density evolve as users zoom in and out?",
    solution:
      "I explored adaptive map behavior where labels, places, and contextual information appeared progressively based on zoom level.",
    outcome:
      "The concept was ultimately not shipped, but it helped the team evaluate information-density tradeoffs and informed later design discussions.",
    status: "REJECTED",
    device: "mobile",
    media: "progressive-disclosure.gif",
    details:
      "Not shipped — the zoom-driven density felt unpredictable in testing, but the exploration shaped how the team reasoned about map detail later.",
  },
]
