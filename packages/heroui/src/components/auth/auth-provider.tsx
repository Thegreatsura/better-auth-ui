import {
  AuthProvider as AuthProviderPrimitive,
  type AuthProviderProps
} from "@better-auth-ui/react"
import { RouterProvider } from "@heroui/react"

import type { AuthPlugin } from "../../plugins"
import { ErrorToaster } from "./error-toaster"

declare module "@better-auth-ui/core" {
  interface AuthConfig {
    plugins: AuthPlugin[]
  }
}

/**
 * Heroui-flavored `AuthProvider`. Wraps the primitive provider with a
 * heroui `RouterProvider` and the heroui `ErrorToaster`.
 */
export function AuthProvider({
  children,
  navigate,
  ...config
}: AuthProviderProps) {
  return (
    <AuthProviderPrimitive navigate={navigate} {...config}>
      <RouterProvider navigate={(path) => navigate({ to: path })}>
        {children}

        <ErrorToaster />
      </RouterProvider>
    </AuthProviderPrimitive>
  )
}
