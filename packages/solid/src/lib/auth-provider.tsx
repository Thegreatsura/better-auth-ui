import type { AuthConfig } from "@better-auth-ui/core"
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query"
import { createContext, type JSX, useContext } from "solid-js"
import type { AuthClient } from "./auth-client"
import { resolveAuthConfig, type SolidAuthConfigInput } from "./auth-config"
import { FetchOptionsProvider } from "./fetch-options-provider"
import { MutationInvalidator } from "./mutation-invalidator"

const AuthContext = createContext<AuthConfig>()
/** Provider-instance scoped config fallback for SSR — replaces the former module-level global. */
const RenderingAuthConfigContext = createContext<AuthConfig>()

const fallbackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000
    }
  }
})

export type AuthProviderProps<TAuthClient = AuthClient> =
  SolidAuthConfigInput<TAuthClient> & {
    children?: JSX.Element | (() => JSX.Element)
    /** TanStack QueryClient to use for your application's queries. */
    queryClient?: QueryClient
  }

const resolveProviderChildren = (children: AuthProviderProps["children"]) =>
  typeof children === "function" ? children() : children

export function AuthProvider(props: AuthProviderProps) {
  const { children, queryClient: qc, ...configInput } = props
  const config = resolveAuthConfig(configInput as AuthProviderProps<AuthClient>)
  const queryClient = qc || fallbackQueryClient

  return (
    <AuthContext.Provider value={config}>
      <RenderingAuthConfigContext.Provider value={config}>
        <QueryClientProvider client={queryClient}>
          <FetchOptionsProvider>
            <MutationInvalidator queryClient={queryClient} />
            {resolveProviderChildren(children)}
          </FetchOptionsProvider>
        </QueryClientProvider>
      </RenderingAuthConfigContext.Provider>
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthConfig {
  const context = useContext(AuthContext)
  const renderingConfig = useContext(RenderingAuthConfigContext)
  const auth = context ?? renderingConfig

  if (!auth) {
    throw new Error("[Better Auth UI] AuthProvider is required")
  }

  return auth
}
