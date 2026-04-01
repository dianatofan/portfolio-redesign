// @ts-nocheck
"use client"

import React, { useEffect, useMemo, useRef } from "react"

type ForceGraphNode = {
  id: string
  [key: string]: unknown
}

type ForceGraphLink = {
  source: string | ForceGraphNode
  target: string | ForceGraphNode
  [key: string]: unknown
}

type ForceGraphProps = {
  nodes?: ForceGraphNode[]
  links?: ForceGraphLink[]
  height?: number
  className?: string
  nodeRadius?: number
  linkDistance?: number
  chargeStrength?: number
}

export default function ForceGraph({
  nodes = [],
  links = [],
  height = 320,
  className = "",

  // 🔽 ACTUALLY SMALL
  nodeRadius = 2, // 4px diameter
  linkDistance = 90,
  chargeStrength = -300,
}: ForceGraphProps) {
  const wrapRef = useRef(null)
  const svgRef = useRef(null)

  const data = useMemo(() => {
    return {
      n: nodes.map((d) => ({ ...d })),
      l: links.map((d) => ({ ...d })),
    }
  }, [nodes, links])

  useEffect(() => {
    if (!wrapRef.current || !svgRef.current) return

    let cleanup
    let ro
    let isMounted = true

    const initialize = async () => {
      const d3 = await import("d3")
      if (!isMounted || !wrapRef.current || !svgRef.current) return

      const container = wrapRef.current
      const svgElement = svgRef.current
      const svg = d3.select(svgElement)

      const render = () => {
      if (!container || !svgElement) {
        return () => {}
      }

      svg.selectAll("*").remove()

      const width = container.getBoundingClientRect().width
      svg.attr("width", width).attr("height", height)

      const g = svg.append("g")

      // Zoom (start slightly zoomed out)
      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 2])
        .on("zoom", (event) => g.attr("transform", event.transform))

      svg.call(zoom)
      const s = 1.8
      svg.call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2 * (1 - s), height / 2 * (1 - s))
          .scale(s)
      )

      // ---- LINKS (thin, understated) ----
      const link = g
        .append("g")
        .attr("stroke", "rgba(17, 24, 39, 0.25)")
        .attr("stroke-width", 0.4)
        .selectAll("line")
        .data(data.l)
        .join("line")

      // ---- NODES (true particles) ----
      const node = g
        .append("g")
        .selectAll("circle")
        .data(data.n)
        .join("circle")
        .attr("r", nodeRadius)
        .attr("fill", "rgba(17, 24, 39, 0.85)")
        .style("cursor", "grab")

      // ---- SIMULATION ----
      const sim = d3
        .forceSimulation(data.n)
        .force(
          "link",
          d3
            .forceLink(data.l)
            .id((d) => d.id)
            .distance(linkDistance)
            .strength(0.9)
        )
        .force("charge", d3.forceManyBody().strength(chargeStrength))
        .force("center", d3.forceCenter(width / 2, height / 2))
        // 🔽 minimal collision — no artificial spacing
        .force("collision", d3.forceCollide(nodeRadius + 1))

      // ---- DRAG ----
      const drag = d3
        .drag()
        .on("start", (event, d) => {
          if (!event.active) sim.alphaTarget(0.2).restart()
          const n = d
          n.fx = n.x
          n.fy = n.y
        })
        .on("drag", (event, d) => {
          const n = d
          n.fx = event.x
          n.fy = event.y
        })
        .on("end", (event, d) => {
          if (!event.active) sim.alphaTarget(0)
          const n = d
          n.fx = null
          n.fy = null
        })

      node.call(drag)

      // ---- TICK ----
      sim.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
      })

      return () => {
        sim.stop()
        svg.on(".zoom", null)
      }
      }

      cleanup = render()
      ro = new ResizeObserver(() => {
        cleanup?.()
        cleanup = render()
      })
      ro.observe(container)
    }

    void initialize()

    return () => {
      isMounted = false
      ro?.disconnect()
      cleanup?.()
    }
  }, [data, height, nodeRadius, linkDistance, chargeStrength])

  return (
    <div ref={wrapRef} className={className} style={{ width: "100%" }}>
      <svg ref={svgRef} aria-label="Force directed graph" />
    </div>
  )
}