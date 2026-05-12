import { toast } from "@heroui/react"
import { useQueryClient } from "@tanstack/react-query"
import type { BetterFetchError } from "better-auth/react"
import { useEffect } from "react"

export function ErrorToaster() {
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.setQueryDefaults(["auth"], {
      throwOnError: (error) => {
        const err = error as BetterFetchError
        if (err?.error) toast.danger(err.error.message)

        return false
      }
    })

    queryClient.setMutationDefaults(["auth"], {
      onError: (error) => {
        toast.danger(
          (error as BetterFetchError)?.error?.message || error.message
        )
      }
    })
  }, [queryClient])

  return null
}
