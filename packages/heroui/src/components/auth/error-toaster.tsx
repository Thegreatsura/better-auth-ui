import { toast } from "@heroui/react"
import { useQueryClient } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { useEffect } from "react"

export function QueryClientErrorToaster() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== "updated") return
      if (event.action.type !== "error") return
      if (event.query.queryKey[0] !== "auth") return

      const error = event.action.error as BetterFetchError
      if (!error?.error) return

      toast.danger(error.error.message)
    })

    queryClient.setMutationDefaults(["auth"], {
      onError: (error) => {
        toast.danger(
          (error as BetterFetchError)?.error?.message || error.message
        )
      }
    })
    return unsubscribe
  }, [queryClient])

  return null
}
