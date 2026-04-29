"use client"

import {
  type AuthConfig,
  type DeepPartial,
  deepmerge,
  defaultAuthConfig
} from "@better-auth-ui/core"
import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider
} from "@tanstack/react-query"
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext
} from "react"

import type { AuthClient } from "../../lib/auth-client"
import type { AuthPlugin } from "../../lib/auth-plugin"

const AuthContext = createContext<AuthConfig | undefined>(undefined)

const fallbackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000
    }
  }
})

declare module "@better-auth-ui/core" {
  interface AuthConfig {
    /**
     * The auth client to use for the authentication context.
     * @remarks `AuthClient`
     */
    authClient: AuthClient
  }

  /** Widen `AdditionalField.label` to `ReactNode` in the React package. */
  interface AdditionalFieldRegister {
    label: ReactNode
  }
}

/**
 * Module-augmentation slot for narrowing the plugin type returned by
 * `useAuth()`. UI packages widen `plugin` here (e.g. heroui's variant-typed
 * `AuthPlugin`) so consumers don't have to pass `useAuth<AuthPlugin>()`.
 *
 * @example
 * declare module "@better-auth-ui/react" {
 *   interface AuthPluginRegister { plugin: HeroUIAuthPlugin }
 * }
 */
// biome-ignore lint/suspicious/noEmptyInterface: declaration-merging slot
export interface AuthPluginRegister {}

export type ResolvedAuthPlugin = AuthPluginRegister extends { plugin: infer P }
  ? P extends AuthPlugin
    ? P
    : AuthPlugin
  : AuthPlugin

export type AuthProviderProps<TAuthClient = AuthClient> = PropsWithChildren<
  DeepPartial<AuthConfig>
> & {
  authClient: TAuthClient
  navigate: (options: { to: string; replace?: boolean }) => void
  plugins?: ResolvedAuthPlugin[]
  /** TanStack QueryClient to use for your application's queries */
  queryClient?: QueryClient
}

/**
 * Provides merged authentication configuration and a resolved React Query client to descendant components.
 *
 * The component merges the provided auth config with the library defaults, updates `redirectTo` from the
 * current URL when the app is hydrated, wires a QueryClient (prop, context, or fallback) and installs an
 * error handler that surfaces query errors via the configured toast. It then supplies the merged config
 * via AuthContext and wraps children with QueryClientProvider.
 *
 * @returns The children wrapped with AuthContext.Provider and QueryClientProvider configured for auth.
 */
export function AuthProvider({
  children,
  queryClient,
  plugins,
  ...config
}: AuthProviderProps) {
  const mergedConfig = deepmerge(defaultAuthConfig, {
    ...config,
    plugins,
    viewPaths: {
      auth: {
        ...defaultAuthConfig.viewPaths.auth,
        ...config.viewPaths?.auth
      },
      settings: {
        ...defaultAuthConfig.viewPaths.settings,
        ...config.viewPaths?.settings
      }
    }
  } as AuthConfig)

  mergedConfig.redirectTo =
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("redirectTo")?.trim()) ||
    mergedConfig.redirectTo

  const contextQueryClient = useContext(QueryClientContext)

  if (contextQueryClient) {
    return (
      <AuthContext.Provider value={mergedConfig}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <QueryClientProvider client={queryClient || fallbackQueryClient}>
      <AuthContext.Provider value={mergedConfig}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

/**
 * Accesses the current authentication configuration from AuthContext.
 *
 * UI packages widen the plugin type globally via the `Register` interface
 * (see module augmentation in `@better-auth-ui/heroui`), so callers don't
 * need to pass a generic.
 *
 * @returns The merged authentication configuration provided by AuthProvider.
 * @throws If no AuthProvider is present in the component tree.
 */
export function useAuth(): AuthConfig & { plugins?: ResolvedAuthPlugin[] } {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("[Better Auth UI] AuthProvider is required")
  }

  return context as AuthConfig & { plugins?: ResolvedAuthPlugin[] }
}
