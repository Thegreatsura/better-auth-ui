import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { viewPaths } from "@better-auth-ui/core"
import { describe, expect, it } from "vitest"
import { ForgotPassword } from "../src/components/auth/forgot-password"
import { ResetPassword } from "../src/components/auth/reset-password"
import { SignIn } from "../src/components/auth/sign-in"
import {
  resolveSignInPath,
  resolveSubmittedSignIn
} from "../src/components/auth/sign-in-path"
import { SignOut } from "../src/components/auth/sign-out"
import { SignUp } from "../src/components/auth/sign-up"
import { resolveAuthRoute } from "../src/routes/auth/-route-components"
import {
  AccountSettings,
  resolveSettingsRoute,
  SecuritySettings,
  shouldLoadLinkedAccounts
} from "../src/routes/settings/-route-components"

describe("Solid auth route component selection", () => {
  it("maps supported auth paths to their existing Solid components", () => {
    expect(resolveAuthRoute(viewPaths.auth.signIn)).toEqual({
      component: SignIn,
      title: "Sign in"
    })
    expect(resolveAuthRoute(viewPaths.auth.signUp)).toEqual({
      component: SignUp,
      title: "Sign up"
    })
    expect(resolveAuthRoute(viewPaths.auth.signOut)).toEqual({
      component: SignOut,
      title: "Sign out"
    })
    expect(resolveAuthRoute(viewPaths.auth.forgotPassword)).toEqual({
      component: ForgotPassword,
      title: "Forgot password"
    })
    expect(resolveAuthRoute(viewPaths.auth.resetPassword)).toEqual({
      component: ResetPassword,
      title: "Reset password"
    })
  })

  it("keeps invalid auth paths on the existing redirect-to-home behavior", () => {
    expect(resolveAuthRoute("unknown-auth-path")).toEqual({ redirectTo: "/" })
  })

  it("wires the Solid auth provider to TanStack navigation and the shadcn redirect target", () => {
    const authProvider = readFileSync(
      resolve(__dirname, "../src/components/auth/auth-provider.tsx"),
      "utf8"
    )

    expect(authProvider).toContain(
      'import { useNavigate } from "@tanstack/solid-router"'
    )
    expect(authProvider).toContain("const navigate = useNavigate()")
    expect(authProvider).toContain('redirectTo="/settings/account"')
    expect(authProvider).toContain("navigate={navigate}")
  })

  it("shares the router QueryClient with Solid auth queries across navigation", () => {
    const rootRoute = readFileSync(
      resolve(__dirname, "../src/routes/__root.tsx"),
      "utf8"
    )
    const authProvider = readFileSync(
      resolve(__dirname, "../src/components/auth/auth-provider.tsx"),
      "utf8"
    )

    expect(rootRoute).toContain(
      'import type { QueryClient } from "@tanstack/solid-query"'
    )
    expect(rootRoute).toContain("createRootRouteWithContext<{")
    expect(rootRoute).toContain("queryClient: QueryClient")
    expect(rootRoute).toContain("const routeContext = Route.useRouteContext()")
    expect(rootRoute).toContain(
      "<AuthProvider queryClient={routeContext().queryClient}>"
    )
    expect(authProvider).toContain(
      'import type { QueryClient } from "@tanstack/solid-query"'
    )
    expect(authProvider).toContain("queryClient?: QueryClient")
    expect(authProvider).toContain("queryClient={props.queryClient}")
  })

  it("redirects Solid sign-in success like shadcn and refreshes the session query", () => {
    const signIn = readFileSync(
      resolve(__dirname, "../src/components/auth/sign-in.tsx"),
      "utf8"
    )

    expect(signIn).toContain(
      'import { authQueryKeys } from "@better-auth-ui/core"'
    )
    expect(signIn).toContain("useQueryClient")
    expect(signIn).toContain("queryClient.invalidateQueries({")
    expect(signIn).toContain("queryKey: authQueryKeys.session")
    expect(signIn).toContain("auth.navigate({ to: auth.redirectTo })")
    expect(signIn).not.toContain("callbackURL:")
  })

  it("selects Better Auth email sign-in for email identifiers even when username auth is enabled", () => {
    expect(
      resolveSignInPath({ identifier: " andres@test.com ", usernameAuth: true })
    ).toEqual({ kind: "email", email: "andres@test.com" })

    expect(
      resolveSignInPath({ identifier: "andres", usernameAuth: true })
    ).toEqual({ kind: "username", username: "andres" })

    expect(
      resolveSignInPath({ identifier: "andres@test.com", usernameAuth: false })
    ).toEqual({ kind: "email", email: "andres@test.com" })
  })

  it("resolves submitted sign-in from current form values instead of stale Solid signals", () => {
    const formData = new FormData()
    formData.set("username", " andres@test.com ")
    formData.set("password", "current-password")

    expect(resolveSubmittedSignIn({ formData, usernameAuth: true })).toEqual({
      password: "current-password",
      signInPath: { email: "andres@test.com", kind: "email" }
    })
  })

  it("resolves submitted username sign-in from the current username form value", () => {
    const formData = new FormData()
    formData.set("username", " andres ")
    formData.set("password", "username-password")

    expect(resolveSubmittedSignIn({ formData, usernameAuth: true })).toEqual({
      password: "username-password",
      signInPath: { kind: "username", username: "andres" }
    })
  })

  it("redirects Solid sign-up success with the same verification branch as shadcn", () => {
    const signUp = readFileSync(
      resolve(__dirname, "../src/components/auth/sign-up.tsx"),
      "utf8"
    )

    expect(signUp).toContain(
      'import { authQueryKeys } from "@better-auth-ui/core"'
    )
    expect(signUp).toContain("useQueryClient")
    expect(signUp).toContain(
      "if (auth.emailAndPassword.requireEmailVerification)"
    )
    expect(signUp).toContain("auth.navigate({")
    expect(signUp).toContain("auth.basePaths.auth")
    expect(signUp).toContain("auth.viewPaths.auth.signIn")
    expect(signUp).toContain("queryClient.invalidateQueries({")
    expect(signUp).toContain("queryKey: authQueryKeys.session")
    expect(signUp).toContain("auth.navigate({ to: auth.redirectTo })")
    expect(signUp).not.toContain("callbackURL:")
  })

  it("keeps the shadcn redirect target routable in the Solid example", () => {
    const settingsRoutePath = resolve(
      __dirname,
      "../src/routes/settings/$path.tsx"
    )
    const routeTree = readFileSync(
      resolve(__dirname, "../src/routeTree.gen.ts"),
      "utf8"
    )

    expect(existsSync(settingsRoutePath)).toBe(true)
    expect(readFileSync(settingsRoutePath, "utf8")).toContain(
      "viewPaths.settings"
    )
    expect(routeTree).toContain("/settings/$path")
  })

  it("maps supported settings paths to real Solid settings panels", () => {
    expect(resolveSettingsRoute(viewPaths.settings.account)).toEqual({
      component: AccountSettings,
      title: "Account"
    })
    expect(resolveSettingsRoute(viewPaths.settings.security)).toEqual({
      component: SecuritySettings,
      title: "Security"
    })
  })

  it("loads linked accounts only after a client session user is known", () => {
    expect(shouldLoadLinkedAccounts({ isSsr: true, userId: "user-1" })).toBe(
      false
    )
    expect(shouldLoadLinkedAccounts({ isSsr: false })).toBe(false)
    expect(shouldLoadLinkedAccounts({ isSsr: false, userId: "user-1" })).toBe(
      true
    )
  })

  it("keeps Solid settings route validation route-level and shares the auth client", () => {
    const settingsRoute = readFileSync(
      resolve(__dirname, "../src/routes/settings/$path.tsx"),
      "utf8"
    )
    const authProvider = readFileSync(
      resolve(__dirname, "../src/components/auth/auth-provider.tsx"),
      "utf8"
    )

    expect(settingsRoute).toContain("viewPaths.settings")
    expect(settingsRoute).toContain("throw notFound()")
    expect(settingsRoute).not.toContain("minimal {path()} settings route")
    expect(authProvider).toContain("export const authClient")
  })

  it("keeps Solid settings navigation lightweight and non-blocking", () => {
    const settingsRoute = readFileSync(
      resolve(__dirname, "../src/routes/settings/$path.tsx"),
      "utf8"
    )
    const settingsComponents = readFileSync(
      resolve(__dirname, "../src/routes/settings/-route-components.tsx"),
      "utf8"
    )

    expect(settingsRoute).not.toContain("ensureSession")
    expect(settingsRoute).not.toContain("redirect")
    expect(settingsRoute).not.toContain("async beforeLoad")
    expect(settingsComponents).not.toContain("useAuthenticate")
    expect(settingsComponents).not.toContain("useListAccounts")
    expect(settingsComponents).toContain("createEffect")
    expect(settingsComponents).toContain("auth.navigate")
    expect(settingsComponents).toContain("shouldLoadLinkedAccounts")
    expect(settingsComponents).toContain("listAccountsOptions")
  })

  it("uses TanStack Link for internal settings nav instead of document anchors", () => {
    const settingsComponents = readFileSync(
      resolve(__dirname, "../src/routes/settings/-route-components.tsx"),
      "utf8"
    )

    expect(settingsComponents).toContain(
      'import { Link } from "@tanstack/solid-router"'
    )
    expect(settingsComponents).toContain("<Link")
    expect(settingsComponents).toContain('to="/settings/$path"')
    expect(settingsComponents).toContain(
      "params={{ path: auth.viewPaths.settings.account }}"
    )
    expect(settingsComponents).toContain(
      "params={{ path: auth.viewPaths.settings.security }}"
    )
    expect(settingsComponents).not.toMatch(/<a\s/)
    expect(settingsComponents).not.toMatch(
      /href=\{`\$\{auth\.basePaths\.settings\}/
    )
  })

  it("uses TanStack Link for UserButton auth/settings menu navigation", () => {
    const userButton = readFileSync(
      resolve(__dirname, "../src/components/auth/user-button.tsx"),
      "utf8"
    )

    expect(userButton).toContain(
      'import { Link } from "@tanstack/solid-router"'
    )
    expect(userButton).toContain('to="/auth/$path"')
    expect(userButton).toContain('to="/settings/$path"')
    expect(userButton).toContain("params={{ path: signInPath }}")
    expect(userButton).toContain("params={{ path: signUpPath }}")
    expect(userButton).toContain("params={{ path: settingsPath }}")
    expect(userButton).toContain("params={{ path: signOutPath }}")
    expect(userButton).not.toContain('as="a"')
    expect(userButton).not.toMatch(
      /href=\{(?:signInHref|signUpHref|settingsHref|signOutHref)\}/
    )
  })

  it("uses TanStack Link for auth form helper navigation", () => {
    const helperLinkFiles = [
      "sign-in.tsx",
      "sign-up.tsx",
      "forgot-password.tsx",
      "reset-password.tsx"
    ]

    for (const file of helperLinkFiles) {
      const source = readFileSync(
        resolve(__dirname, `../src/components/auth/${file}`),
        "utf8"
      )

      expect(source, file).toContain(
        'import { Link } from "@tanstack/solid-router"'
      )
      expect(source, file).toContain("<Link")
      expect(source, file).toContain('to="/auth/$path"')
      expect(source, file).toContain("params={{ path: auth.viewPaths.auth.")
      expect(source, file).not.toMatch(/<a\s/)
      expect(source, file).not.toMatch(/href=\{?`?\$?\{?auth\.basePaths\.auth/)
    }
  })

  it("renders bounded account and security settings surfaces from auth/session state", () => {
    const settingsComponents = readFileSync(
      resolve(__dirname, "../src/routes/settings/-route-components.tsx"),
      "utf8"
    )

    expect(settingsComponents).toContain("useAuth")
    expect(settingsComponents).toContain("useSession")
    expect(settingsComponents).toContain("session.data?.user.name")
    expect(settingsComponents).toContain("session.data?.user.email")
    expect(settingsComponents).toContain("Account information")
    expect(settingsComponents).toContain("Email and password")
    expect(settingsComponents).toContain("Social accounts")
    expect(settingsComponents).toContain("Active sessions")
    expect(settingsComponents).toContain("not available in this Solid slice")
  })
})
