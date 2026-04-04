export type DeviceType = "mobile" | "tablet" | "desktop"

function getDeviceType(width: number): DeviceType {
  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

export function getClientAnalyticsContext() {
  if (typeof window === "undefined") {
    return {
      path: "",
      referrerHost: "",
      language: "",
      timezone: "",
      viewportWidth: 0,
      viewportHeight: 0,
      deviceType: "desktop" as DeviceType,
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmContent: "",
      utmTerm: "",
    }
  }

  const { innerWidth, innerHeight, location, navigator, document } = window
  const params = new URLSearchParams(location.search)

  let referrerHost = "direct"
  if (document.referrer) {
    try {
      referrerHost = new URL(document.referrer).host
    } catch {
      referrerHost = "unknown"
    }
  }

  return {
    path: `${location.pathname}${location.search}`,
    referrerHost,
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    viewportWidth: innerWidth,
    viewportHeight: innerHeight,
    deviceType: getDeviceType(innerWidth),
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
  }
}

