import { apiKeyClient } from "@better-auth/api-key/client"
import { passkeyClient } from "@better-auth/passkey/client"
import {
  apiKeyPlugin,
  multiSessionPlugin,
  passkeyPlugin,
  usernamePlugin
} from "@better-auth-ui/core/plugins"
import type { AuthClient } from "@better-auth-ui/solid"
import {
  createAuthClient,
  AuthProvider as SolidAuthProvider
} from "@better-auth-ui/solid"
import type { QueryClient } from "@tanstack/solid-query"
import { useNavigate } from "@tanstack/solid-router"
import { multiSessionClient, usernameClient } from "better-auth/client/plugins"
import type { JSX } from "solid-js"

import { ErrorToaster } from "./error-toaster"

const resolveAuthBaseURL = () => {
  if (import.meta.env.VITE_AUTH_URL) return import.meta.env.VITE_AUTH_URL

  if (import.meta.env.SSR) return "http://localhost:5173/api/auth"

  return `${window.location.origin}/api/auth`
}

const authBaseURL = resolveAuthBaseURL()
export const authClient: AuthClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [
    multiSessionClient(),
    apiKeyClient(),
    passkeyClient(),
    usernameClient()
  ]
})

export type AuthProviderProps = {
  children?: JSX.Element | (() => JSX.Element)
  queryClient?: QueryClient
}

export function AuthProvider(props: AuthProviderProps) {
  const navigate = useNavigate()

  return (
    <SolidAuthProvider
      authClient={authClient}
      redirectTo="/settings/account"
      navigate={navigate}
      queryClient={props.queryClient}
      plugins={[
        multiSessionPlugin(),
        apiKeyPlugin(),
        passkeyPlugin(),
        usernamePlugin()
      ]}
    >
      {() => (
        <>
          {props.children}
          <ErrorToaster />
        </>
      )}
    </SolidAuthProvider>
  )
}
