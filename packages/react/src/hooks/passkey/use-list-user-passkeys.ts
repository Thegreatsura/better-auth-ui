import { useQuery } from "@tanstack/react-query"
import type { PasskeyAuthClient } from "../../lib/auth-clients/passkey-auth-client"
import { listUserPasskeysOptions } from "../../queries/passkey/list-user-passkeys-options"
import { useSession } from "../auth/use-session"

export type UseListUserPasskeysParams<TAuthClient extends PasskeyAuthClient> =
  NonNullable<Parameters<TAuthClient["passkey"]["listUserPasskeys"]>[0]>

export type UseListUserPasskeysOptions<TAuthClient extends PasskeyAuthClient> =
  Omit<ReturnType<typeof listUserPasskeysOptions>, "queryKey" | "queryFn"> &
    UseListUserPasskeysParams<TAuthClient>

/**
 * Retrieve the passkeys registered for the current user.
 *
 * @param authClient - The Better Auth client with the passkey plugin.
 * @param options - `listUserPasskeys` params & `useQuery` options.
 */
export function useListUserPasskeys<TAuthClient extends PasskeyAuthClient>(
  authClient: TAuthClient,
  options: UseListUserPasskeysOptions<TAuthClient> = {}
) {
  const { data: session } = useSession(authClient, { refetchOnMount: false })
  const { fetchOptions, ...queryOptions } = options

  return useQuery({
    ...listUserPasskeysOptions(authClient, session?.user.id, { fetchOptions }),
    ...queryOptions
  })
}
