import Image from "next/image"

/*
 * The Money Jenga loop in three screens, side by side. A plain figure for the
 * blog-post layout: each screen sits above its caption, no scroll mechanics.
 */

type Step = {
  title: string
  text: string
  screen: { src: string; alt: string; animated?: boolean }
}

const steps: Step[] = [
  {
    title: "One sum a month",
    text: "My budget stacks up as a tower.",
    screen: { src: "/images/money-jenga/setup.webp", alt: "Setup screen asking how tall the tower should be this month, set to 10.000 kr" },
  },
  {
    title: "Every purchase is a pull",
    text: "Big buys pull from the bottom, so it wobbles.",
    screen: {
      src: "/images/money-jenga/pull.webp",
      alt: "Animation: a cartoon glove pulls a block out of the cash tower after a 2.400 kr purchase",
      animated: true,
    },
  },
  {
    title: "Timberrr",
    text: "Out of money, the tower falls.",
    screen: {
      src: "/images/money-jenga/topple.webp",
      alt: "Animation: the last blocks are pulled and the tower collapses into a pile of bills, with the message Timberrr, the tower of life has fallen",
      animated: true,
    },
  },
]

function Screen({ screen }: { screen: Step["screen"] }) {
  if (screen.animated) {
    // Plain img, not next/image: the optimizer would flatten the animation.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={screen.src} alt={screen.alt} className="absolute inset-0 h-full w-full object-contain" loading="lazy" />
  }
  return <Image src={screen.src} alt={screen.alt} fill className="object-contain" sizes="220px" />
}

export function MoneyJengaSteps() {
  return (
    <ol className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
      {steps.map((step) => (
        <li key={step.title} className="flex flex-col items-center text-center">
          {/* The screens are 406×862 and include their own phone frame. */}
          <div className="relative aspect-[406/862] w-[200px] drop-shadow-[0_16px_24px_rgba(28,22,17,0.18)]">
            <Screen screen={step.screen} />
          </div>
          <p className="mt-6 text-base font-medium text-foreground">{step.title}</p>
          <p className="mt-1 max-w-[30ch] text-sm leading-relaxed text-[var(--text-secondary)]">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}
