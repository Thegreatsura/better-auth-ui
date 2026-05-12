import { authMutationKeys, authQueryKeys } from "@better-auth-ui/core"
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

      queryClient.invalidateQueries({
        predicate: (query) =>
          // invalidate all matching tags at once
          // or every auth query if no meta is provided
          mutation.meta?.invalidates?.some((queryKey) =>
            matchQuery({ queryKey }, query)
          ) ?? matchQuery({ queryKey: authQueryKeys.all }, query)
      })

      return queryClient.invalidateQueries(
        {
          predicate: (query) =>
            mutation.meta?.awaits?.some((queryKey) =>
              matchQuery({ queryKey }, query)
            ) ?? false
        },
        { cancelRefetch: false }
      )
    }

    return () => {
      mutationCache.config.onSuccess = previousOnSuccess
    }
  }, [queryClient])

  return null
}
