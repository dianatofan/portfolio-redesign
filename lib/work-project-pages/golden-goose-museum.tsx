import Image from "next/image"
import type { WorkProjectPage } from "./types"

function Shot({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  return (
    <div className={`relative ${ratio} overflow-hidden rounded-[4px] bg-surface`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
    </div>
  )
}

export const goldenGooseMuseumPage: WorkProjectPage = {
  displayTitle: "Golden Goose Digital Museum",
  subtitle: "3D Superstar sneakers for a digital museum, and the tool I built to paint them.",
  heroImage: "/images/golden-goose-hero.webp",
  description:
    "Low-poly 3D Golden Goose Superstar sneakers and a browser-based part painter with an AI magic wand.",
  published: "October 2026",
  readTime: "1 min read",
  meta: [
    { label: "Role", values: ["3D", "Tool design"] },
    { label: "Type", values: ["Side project"] },
    { label: "Tools", values: ["Blender", "three.js", "Claude Code"] },
  ],
  sections: [],
  story: [
    {
      title: "Seven sneakers",
      text: [
        "Seven 3D Superstars for a small digital museum, light enough to load fast on the web.",
      ],
      visual: (
        <Shot
          src="/images/golden-goose-renders.webp"
          alt="The 3D Superstar sneaker rendered from six angles"
          ratio="aspect-[6/5]"
        />
      ),
    },
    {
      title: "A painter for the parts",
      text: [
        "A browser tool to trace each part and paint it on the 3D shoe, with an AI wand that finds the edges.",
      ],
      visual: (
        <Shot
          src="/images/golden-goose-painter.webp"
          alt="The part painter: a 3D sneaker with the heel tab, laces, star and sole each painted a different colour, and tools for pen, brush, eraser and wand"
          ratio="aspect-[4/3]"
        />
      ),
    },
    {
      title: "Colourways",
      text: [
        "Now a new colourway takes a few clicks. Twelve so far, and the museum is next.",
      ],
      visual: (
        <Shot
          src="/images/golden-goose-colourways.webp"
          alt="Eight colourways of the 3D sneaker: silver, black, pink, green and gold stars, black laces, an all-black pair and an orange heel tab"
          ratio="aspect-[160/69]"
        />
      ),
    },
  ],
  renderBeforeGate: () => null,
}
