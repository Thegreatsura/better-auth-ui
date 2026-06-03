import {
  deleteUserPlugin,
  multiSessionPlugin,
  usernamePlugin
} from "@better-auth-ui/core/plugins"
import type { QueryClient } from "@tanstack/solid-query"
import { useNavigate } from "@tanstack/solid-router"
import type { JSX } from "solid-js"
import { onCleanup, onMount } from "solid-js"
import { apiKeyPlugin } from "@/lib/auth/api-key-plugin"
import { magicLinkPlugin } from "@/lib/auth/magic-link-plugin"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { passkeyPlugin } from "@/lib/auth/passkey-plugin"
import { authClient } from "@/lib/auth-client"
import { syncDocumentThemePreference } from "@/lib/theme"

import { AuthProvider } from "./auth/auth-provider"
import { Toaster } from "./ui/sonner"

export type ProvidersProps = {
  children?: JSX.Element | (() => JSX.Element)
  queryClient?: QueryClient
}

const resolveProviderChildren = (children: ProvidersProps["children"]) =>
  typeof children === "function" ? children() : children

export function Providers(props: ProvidersProps) {
  const navigate = useNavigate()

  onMount(() => {
    const cleanup = syncDocumentThemePreference()

    onCleanup(cleanup)
  })

  return (
    <AuthProvider
      authClient={authClient}
      redirectTo="/settings/account"
      navigate={navigate}
      queryClient={props.queryClient}
      socialProviders={["github"]}
      plugins={[
        multiSessionPlugin(),
        apiKeyPlugin({ organization: true }),
        usernamePlugin(),
        magicLinkPlugin(),
        passkeyPlugin(),
        deleteUserPlugin(),
        organizationPlugin()
      ]}
    >
      {() => (
        <>
          {resolveProviderChildren(props.children)}
          <Toaster />
        </>
      )}
    </AuthProvider>
  )
}
