import { useEffect } from "react"
import { useAuth } from "../../components/auth/auth-provider"
import { type UseSessionOptions, useSession } from "./use-session"

/**
 * Calls `useSession` and redirects unauthenticated users to the sign-in page,
 * preserving the current URL as a `redirectTo` query param.
 *
 * @param options - Better Auth params (`query`, `fetchOptions`) and React
 *   Query options forwarded to `useQuery`.
 * @returns React Query result for the session.
 */
export function useAuthenticate(options?: UseSessionOptions) {
  const { basePaths, viewPaths, navigate } = useAuth()
  const session = useSession(options)

  useEffect(() => {
    if (session.data || session.isPending) return

    const currentURL = window.location.pathname + window.location.search
    const redirectTo = encodeURIComponent(currentURL)
    const signInPath = `${basePaths.auth}/${viewPaths.auth.signIn}?redirectTo=${redirectTo}`

    navigate({ to: signInPath, replace: true })
  }, [
    basePaths.auth,
    session.data,
    session.isPending,
    viewPaths.auth.signIn,
    navigate
  ])

  return session
}
