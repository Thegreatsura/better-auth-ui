import { authMutationKeys, authQueryKeys } from "@better-auth-ui/core"
import {
  matchMutation,
  matchQuery,
  useQueryClient
} from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"

export function ErrorToaster() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== "updated" || event.action.type !== "error") return
      if (!matchQuery({ queryKey: authQueryKeys.all }, event.query)) return

      const err = event.action.error as BetterFetchError
      if (err?.error) toast.error(err.error.message)
    })

    const unsubscribeMutation = queryClient
      .getMutationCache()
      .subscribe((event) => {
        if (event.type !== "updated" || event.action.type !== "error") return
        if (
          !matchMutation({ mutationKey: authMutationKeys.all }, event.mutation)
        )
          return

        const err = event.action.error as BetterFetchError
        toast.error(err.error?.message || err.message)
      })

    return () => {
      unsubscribeQuery()
      unsubscribeMutation()
    }
  }, [queryClient])

  return null
}
