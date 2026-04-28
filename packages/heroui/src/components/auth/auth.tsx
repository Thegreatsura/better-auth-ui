import type { AuthView } from "@better-auth-ui/core"
import { useAuth } from "@better-auth-ui/react"
import type { CardProps } from "@heroui/react"
import { useEffect } from "react"

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
 * Built-in views that only make sense when email + password auth is enabled.
 * When it's disabled, the `<Auth>` router redirects these to `signIn` so a
 * plugin's `fallbackViews.auth.signIn` (e.g. magic link) takes over.
 */
const PASSWORD_ONLY_VIEWS: ReadonlySet<AuthView> = new Set<AuthView>([
  "signUp",
  "forgotPassword",
  "resetPassword"
])

/**
 * Render the appropriate authentication view based on the provided `view` or `path`.
 *
 * View resolution order:
 *   1. Plugin **overrides** via `plugins[].views.auth[currentView]` — these
 *      always win (first plugin to register wins).
 *   2. Plugin **fallbacks** via `plugins[].fallbackViews.auth[currentView]` —
 *      only consulted when the built-in flow isn't viable (currently:
 *      `signIn` when `emailAndPassword.enabled === false`).
 *   3. Built-in components (`SignIn`, `SignUp`, ...).
 *
 * Additionally, when `emailAndPassword.enabled === false`, password-only
 * views (`signUp` / `forgotPassword` / `resetPassword`) redirect to `signIn`
 * since those flows have no meaning without a password.
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
  const { basePaths, emailAndPassword, plugins, viewPaths, navigate } =
    useAuth<AuthPlugin>()

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

  // When email + password auth is disabled, password-only views (signUp,
  // forgotPassword, resetPassword) have no meaning. Redirect them to signIn,
  // where a plugin's `fallbackViews.auth.signIn` (e.g. magic link) takes
  // over as the primary entry point.
  const shouldRedirectToSignIn =
    !emailAndPassword?.enabled && PASSWORD_ONLY_VIEWS.has(currentView)

  useEffect(() => {
    if (shouldRedirectToSignIn) {
      navigate({
        to: `${basePaths.auth}/${viewPaths.auth.signIn}`,
        replace: true
      })
    }
  }, [shouldRedirectToSignIn, navigate, basePaths.auth, viewPaths.auth.signIn])

  if (shouldRedirectToSignIn) {
    return null
  }

  // 1. Plugin overrides (`views.auth[currentView]`) — these always win,
  //    including over built-in views. First plugin to register wins.
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

  // 2. Plugin fallbacks — only when the built-in `signIn` isn't viable
  //    (password auth is off). Used by `magicLinkPlugin` to render the
  //    magic-link form as the primary passwordless sign-in surface.
  if (currentView === "signIn" && !emailAndPassword?.enabled) {
    const Fallback = plugins?.find(
      (plugin) => plugin.fallbackViews?.auth?.signIn
    )?.fallbackViews?.auth?.signIn

    if (Fallback) {
      return (
        <Fallback
          socialLayout={socialLayout}
          socialPosition={socialPosition}
          {...props}
        />
      )
    }
  }

  // 3. Built-ins.
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
