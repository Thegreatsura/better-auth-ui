import { authKeys } from "@better-auth-ui/core"
import type { QueryClient } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { auth } from "@/lib/auth"

const getSession = createServerFn().handler(() =>
  auth.api.getSession({ headers: getRequestHeaders() })
)

export const ensureSession = (queryClient: QueryClient) =>
  queryClient.ensureQueryData({
    queryKey: authKeys.session(),
    queryFn: () => getSession()
  })
