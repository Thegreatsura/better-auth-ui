import { viewPaths } from "@better-auth-ui/core"
import type { Component } from "solid-js"

import { ForgotPassword } from "@/components/auth/forgot-password"
import { ResetPassword } from "@/components/auth/reset-password"
import { SignIn } from "@/components/auth/sign-in"
import { SignOut } from "@/components/auth/sign-out"
import { SignUp } from "@/components/auth/sign-up"

type SupportedAuthRoute = {
  component: Component
  title: string
}

type UnsupportedAuthRoute = {
  redirectTo: "/"
}

const authRouteComponents: Partial<Record<string, SupportedAuthRoute>> = {
  [viewPaths.auth.signIn]: { component: SignIn, title: "Sign in" },
  [viewPaths.auth.signUp]: {
    component: SignUp,
    title: "Sign up"
  },
  [viewPaths.auth.signOut]: {
    component: SignOut,
    title: "Sign out"
  },
  [viewPaths.auth.forgotPassword]: {
    component: ForgotPassword,
    title: "Forgot password"
  },
  [viewPaths.auth.resetPassword]: {
    component: ResetPassword,
    title: "Reset password"
  }
}

export const resolveAuthRoute = (
  path: string
): SupportedAuthRoute | UnsupportedAuthRoute => {
  const route = authRouteComponents[path]

  return route ?? { redirectTo: "/" }
}
