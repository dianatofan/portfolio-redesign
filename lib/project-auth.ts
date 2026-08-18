export const PROJECT_AUTH_GLOBAL_KEY = "project-auth-global"
export const PROJECT_UNLOCK_EVENT = "project-unlocked"

/**
 * Master switch for the case-study password gate.
 *
 * Turned off for now: every project renders in full. The per-project
 * `isPasswordProtected` flags in components/projects.tsx are deliberately left
 * as they are, and the gate components are untouched, so switching this back to
 * `true` restores exactly the previous behaviour — which projects are gated is
 * still described by the data, not by this flag.
 */
export const PROJECT_PASSWORD_PROTECTION_ENABLED = false

/**
 * Whether a given project should actually be gated right now. Always read the
 * gate state through this rather than `project.isPasswordProtected` directly,
 * so there is a single place to turn it on and off.
 */
export function isProjectGated(isPasswordProtected: boolean) {
    return PROJECT_PASSWORD_PROTECTION_ENABLED && isPasswordProtected
}

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
