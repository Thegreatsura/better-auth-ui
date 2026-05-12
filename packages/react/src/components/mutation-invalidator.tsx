import { authMutationKeys } from "@better-auth-ui/core"
import {
  matchMutation,
  matchQuery,
  type QueryKey,
  useQueryClient
} from "@tanstack/react-query"
import { useEffect } from "react"

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: Array<QueryKey>
      awaits?: Array<QueryKey>
    }
  }
}

export function MutationInvalidator() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const mutationCache = queryClient.getMutationCache()
    const previousOnSuccess = mutationCache.config.onSuccess

    mutationCache.config.onSuccess = async (
      data,
      variables,
      onMutateResult,
      mutation,
      context
    ) => {
      await previousOnSuccess?.(
        data,
        variables,
        onMutateResult,
        mutation,
        context
      )

      if (!matchMutation({ mutationKey: authMutationKeys.all }, mutation)) {
        return
      }

      const { invalidates, awaits } = mutation.meta ?? {}

      if (invalidates?.length) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            invalidates.some((queryKey) => matchQuery({ queryKey }, query))
        })
      }

      if (awaits?.length) {
        return queryClient.invalidateQueries(
          {
            predicate: (query) =>
              awaits.some((queryKey) => matchQuery({ queryKey }, query))
          },
          { cancelRefetch: false }
        )
      }
    }

    return () => {
      mutationCache.config.onSuccess = previousOnSuccess
    }
  }, [queryClient])

  return null
}
