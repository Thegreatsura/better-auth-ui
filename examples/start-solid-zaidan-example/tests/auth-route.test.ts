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
})
