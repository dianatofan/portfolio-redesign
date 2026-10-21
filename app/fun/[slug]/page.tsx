import { notFound, permanentRedirect } from "next/navigation"

// The Lab posts moved under /work. Old /fun links keep working.
const moved: Record<string, string> = {
  "human-redundancy-terminal": "/work/human-redundancy-terminal",
}

export function generateStaticParams() {
  return Object.keys(moved).map((slug) => ({ slug }))
}

export default async function FunRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const to = moved[slug]
  if (!to) notFound()
  permanentRedirect(to)
}
