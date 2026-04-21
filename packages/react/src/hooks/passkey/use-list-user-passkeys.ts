import { skipToken, useQuery } from "@tanstack/react-query"

import type { PasskeyAuthClient } from "../../lib/auth-client"
import {
  type ListUserPasskeysOptions,
  type ListUserPasskeysParams,
  listUserPasskeysOptions
} from "../../queries/passkey/list-user-passkeys-options"
import { useSession } from "../auth/use-session"

export type UseListUserPasskeysOptions<TAuthClient extends PasskeyAuthClient> =
  ListUserPasskeysOptions<TAuthClient> & ListUserPasskeysParams<TAuthClient>

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
  const { data: session } = useSession(authClient)
  const userId = session?.user.id

  const { query, fetchOptions, ...queryOptions } = options

  const baseOptions = listUserPasskeysOptions(authClient, userId, {
    query,
    fetchOptions
  })

  return useQuery({
    ...queryOptions,
    ...baseOptions,
    queryFn: userId ? baseOptions.queryFn : skipToken
  })
}
