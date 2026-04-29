import {
  type AuthClient,
  AuthProvider as AuthProviderPrimitive,
  type AuthProviderProps as AuthProviderPropsPrimitive
} from "@better-auth-ui/react"
import { RouterProvider } from "@heroui/react"
import { ErrorToaster } from "./error-toaster"

export type AuthProviderProps<TAuthClient = AuthClient> =
  AuthProviderPropsPrimitive<TAuthClient>

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
