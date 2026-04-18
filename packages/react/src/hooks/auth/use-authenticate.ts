import { useEffect } from "react"
import { useAuth } from "../../components/auth/auth-provider"
import type { AuthClient } from "../../lib/auth-client"
import { type UseSessionOptions, useSession } from "./use-session"

/**
 * Calls `useSession` and redirects unauthenticated users to the sign-in page,
 * preserving the current URL as a `redirectTo` query param.
 *
 * @param params - Parameters forwarded to `authClient.getSession`.
 * @param options - React Query options forwarded to `useQuery`.
 * @returns React Query result for the session.
 */
export function useAuthenticate(
  params?: Parameters<AuthClient["getSession"]>[0],
  options?: UseSessionOptions
) {
  const { basePaths, viewPaths, navigate } = useAuth()
  const session = useSession(params, options)

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
