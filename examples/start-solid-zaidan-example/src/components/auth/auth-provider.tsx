import { usernamePlugin } from "@better-auth-ui/core/plugins"
import {
  createAuthClient,
  AuthProvider as SolidAuthProvider
} from "@better-auth-ui/solid"
import { usernameClient } from "better-auth/client/plugins"
import type { JSX } from "solid-js"

const resolveAuthBaseURL = () => {
  if (import.meta.env.VITE_AUTH_URL) return import.meta.env.VITE_AUTH_URL

  if (import.meta.env.SSR) return "http://localhost:5173/api/auth"

  return `${window.location.origin}/api/auth`
}

const authBaseURL = resolveAuthBaseURL()
const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [usernameClient()]
})

export type AuthProviderProps = {
  children?: JSX.Element | (() => JSX.Element)
}

export function AuthProvider(props: AuthProviderProps) {
  return (
    <SolidAuthProvider authClient={authClient} plugins={[usernamePlugin()]}>
      {props.children}
    </SolidAuthProvider>
  )
}
