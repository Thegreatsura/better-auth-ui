import {
  AuthProvider as AuthProviderPrimitive,
  type AuthProviderProps
} from "@better-auth-ui/react"
import { RouterProvider } from "@heroui/react"

/**
 * Provides an authentication context by rendering an auth provider with the sonner toast handler injected, forwarding remaining configuration and rendering `children` inside it.
 *
 * @param children - React nodes to render inside the authentication provider
 * @returns A React element that renders an authentication provider configured with the provided props and toast handler
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
      </RouterProvider>
    </AuthProviderPrimitive>
  )
}
