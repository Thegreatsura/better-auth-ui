import type { AuthView } from "@better-auth-ui/core"
import { useAuth } from "@better-auth-ui/react"
import type { CardProps } from "@heroui/react"

import type { AuthPlugin } from "../../lib/auth-plugin"
import { ForgotPassword } from "./forgot-password"
import type { SocialLayout } from "./provider-buttons"
import { ResetPassword } from "./reset-password"
import { SignIn } from "./sign-in"
import { SignOut } from "./sign-out"
import { SignUp } from "./sign-up"

export type AuthProps = {
  className?: string
  path?: string
  socialLayout?: SocialLayout
  socialPosition?: "top" | "bottom"
  variant?: CardProps["variant"]
  /** @remarks `AuthView` */
  view?: AuthView
}

/**
 * Render the appropriate authentication view based on the provided `view` or `path`.
 *
 * Plugin-contributed views (e.g. `magicLinkPlugin` providing the `magicLink`
 * view) are resolved dynamically from `plugins[].views.auth`; built-in views
 * (`signIn`, `signUp`, etc.) are matched in the switch below.
 *
 * @param path - Route path used to resolve an auth view when `view` is not provided
 * @param socialLayout - Social layout to apply to sign-in/sign-up/magic-link views
 * @param socialPosition - Position for social buttons ("top" or "bottom")
 * @param variant - Variant to apply to the card
 * @param view - Explicit auth view to render (e.g., "signIn", "signUp")
 * @returns The React element for the resolved authentication view
 */
export function Auth({
  path,
  socialLayout,
  socialPosition,
  view,
  ...props
}: AuthProps & Omit<CardProps, "children">) {
  const { plugins, viewPaths } = useAuth<AuthPlugin>()

  if (!view && !path) {
    throw new Error("[Better Auth UI] Either `view` or `path` must be provided")
  }

  const authPathViews = Object.fromEntries(
    Object.entries(viewPaths.auth).map(([k, v]) => [v, k])
  ) as Record<string, AuthView>

  const currentView = view || (path ? authPathViews[path] : undefined)

  if (!currentView) {
    throw new Error(
      `[Better Auth UI] Valid views are: ${Object.keys(viewPaths.auth).join(", ")}`
    )
  }

  for (const plugin of plugins ?? []) {
    const PluginView = plugin.views?.auth?.[currentView]

    if (PluginView) {
      return (
        <PluginView
          socialLayout={socialLayout}
          socialPosition={socialPosition}
          {...props}
        />
      )
    }
  }

  switch (currentView) {
    case "signIn":
      return (
        <SignIn
          socialLayout={socialLayout}
          socialPosition={socialPosition}
          {...props}
        />
      )
    case "signUp":
      return (
        <SignUp
          socialLayout={socialLayout}
          socialPosition={socialPosition}
          {...props}
        />
      )
    case "forgotPassword":
      return <ForgotPassword {...props} />
    case "resetPassword":
      return <ResetPassword {...props} />
    case "signOut":
      return <SignOut {...props} />
    default:
      throw new Error(
        `[Better Auth UI] Unknown view "${currentView}". Valid views are: ${Object.keys(viewPaths.auth).join(", ")}`
      )
  }
}
