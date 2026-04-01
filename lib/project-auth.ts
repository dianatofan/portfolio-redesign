export const PROJECT_AUTH_GLOBAL_KEY = "project-auth-global"
export const PROJECT_UNLOCK_EVENT = "project-unlocked"

export function getProjectAuthKey(projectSlug: string) {
  return `project-auth-${projectSlug}`
}

export function hasGlobalProjectUnlock() {
  if (typeof window === "undefined") return false
  return Boolean(localStorage.getItem(PROJECT_AUTH_GLOBAL_KEY))
}

export function isProjectUnlocked(projectSlug: string, correctPassword: string) {
  if (typeof window === "undefined") return false

  const globalStored = localStorage.getItem(PROJECT_AUTH_GLOBAL_KEY)
  const projectStored = localStorage.getItem(getProjectAuthKey(projectSlug))

  return globalStored === correctPassword || projectStored === correctPassword
}

export function persistProjectUnlock(projectSlug: string, password: string) {
  if (typeof window === "undefined") return

  localStorage.setItem(PROJECT_AUTH_GLOBAL_KEY, password)
  localStorage.setItem(getProjectAuthKey(projectSlug), password)

  window.dispatchEvent(
    new CustomEvent(PROJECT_UNLOCK_EVENT, {
      detail: { projectSlug, isGlobal: true },
    })
  )
}

