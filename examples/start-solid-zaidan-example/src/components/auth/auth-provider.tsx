import {
  createAuthClient,
  AuthProvider as SolidAuthProvider
} from "@better-auth-ui/solid"
import type { JSX } from "solid-js"

const authBaseURL =
  import.meta.env.VITE_AUTH_URL ??
  (import.meta.env.SSR ? "http://localhost:5173/api/auth" : "/api/auth")
const authClient = createAuthClient({
  baseURL: authBaseURL
})

export type AuthProviderProps = {
  children?: JSX.Element | (() => JSX.Element)
}

export function AuthProvider(props: AuthProviderProps) {
  return (
    <SolidAuthProvider authClient={authClient}>
      {props.children}
    </SolidAuthProvider>
  )
}
