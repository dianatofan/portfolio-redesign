import { Children, Fragment, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react"
import type { WorkProjectSection } from "@/lib/work-project-pages/types"

/*
 * Every top-level section opens with its headline. The project
 * files render plain <section> elements, so rather than repeat that in each of
 * them, this walks the rendered fragment and rewrites the first element holding
 * each top-level section's id.
 *
 * Only plain DOM elements are rewritten; a component that renders its own
 * sections is left as it is.
 */

type Props = { id?: string; children?: ReactNode }

function idsWithin(node: ReactNode, found: string[] = []): string[] {
    Children.forEach(node, (child) => {
        if (!isValidElement<Props>(child) || typeof child.type !== "string") return
        if (child.props.id) found.push(child.props.id)
        idsWithin(child.props.children, found)
    })
    return found
}

export function topLevelSections(sections: WorkProjectSection[]) {
    return sections
        .filter((section) => !section.parent)
        .map((section, i) => ({ ...section, n: String(i + 1).padStart(2, "0") }))
}

/*
 * Splits a section into a head (its number and headline) and a body, as two
 * wrappers the page can style by their data attributes. They stack.
 */
export function splitSection(children: ReactNode): ReactNode[] {
    const nodes = Children.toArray(children)
    const h2 = nodes.findIndex((node) => isValidElement(node) && node.type === "h2")
    const head = h2 === -1 ? [] : [nodes[h2]]
    const body = h2 === -1 ? nodes : nodes.filter((_, i) => i !== h2)
    return [
        <div key="head" data-cs-head="">
            {head}
        </div>,
        <div key="body" data-cs-body="">
            {body}
        </div>,
    ]
}

export function withSectionLabels(content: ReactNode, sections: WorkProjectSection[]): ReactNode {
    const labels = new Map(topLevelSections(sections).map((section) => [section.id, section]))
    const placed = new Set<string>()

    const visit = (node: ReactNode): ReactNode =>
        Children.map(node, (child) => {
            if (!isValidElement<Props>(child)) return child
            // Fragments: look through them at their children.
            if (child.type === Fragment) {
                return visit(child.props.children)
            }
            if (typeof child.type !== "string") return child

            const id = idsWithin(child).find((value) => labels.has(value) && !placed.has(value))
            if (!id) return child
            placed.add(id)
                  return cloneElement(child as ReactElement<Props>, undefined, ...splitSection(child.props.children))
        })

    return visit(content)
}
