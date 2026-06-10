import { authMutationKeys } from "@better-auth-ui/core"
import type { QueryClient, QueryKey } from "@tanstack/solid-query"
import { onCleanup } from "solid-js"
import type { AuthMutationMeta } from "../mutations/create-auth-mutation"

const keyStartsWith = (
  queryKey: readonly unknown[],
  prefix: readonly unknown[]
) => prefix.every((part, index) => Object.is(queryKey[index], part))

const matchesAnyPrefix = (
  queryKey: readonly unknown[] | undefined,
  prefixes: Array<QueryKey> | undefined
) =>
  Boolean(
    queryKey &&
      prefixes?.some((prefix) =>
        keyStartsWith(queryKey, prefix as readonly unknown[])
      )
  )

export async function invalidateAuthMutationMeta(
  queryClient: QueryClient,
  mutation: {
    options?: { mutationKey?: QueryKey; meta?: unknown }
    meta?: unknown
  }
) {
  const mutationKey = mutation.options?.mutationKey

  if (!keyStartsWith(mutationKey ?? [], authMutationKeys.all)) {
    return
  }

  const meta = (mutation.options?.meta ??
    mutation.meta ??
    {}) as AuthMutationMeta
  const { invalidates, awaits } = meta

  if (invalidates?.length) {
    queryClient.invalidateQueries({
      predicate: (query) => matchesAnyPrefix(query.queryKey, invalidates)
    })
  }

  if (awaits?.length) {
    await queryClient.invalidateQueries(
      {
        predicate: (query) => matchesAnyPrefix(query.queryKey, awaits)
      },
      { cancelRefetch: false }
    )
  }
}

export function MutationInvalidator(props: { queryClient: QueryClient }) {
  const mutationCache = props.queryClient.getMutationCache()
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
    await invalidateAuthMutationMeta(props.queryClient, mutation)
  }

  onCleanup(() => {
    mutationCache.config.onSuccess = previousOnSuccess
  })

  return null
}
