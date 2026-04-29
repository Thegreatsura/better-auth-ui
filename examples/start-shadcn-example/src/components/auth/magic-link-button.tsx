"use client"

import { type AuthView, authMutationKeys } from "@better-auth-ui/core"
import { useAuth } from "@better-auth-ui/react"
import { useIsMutating } from "@tanstack/react-query"
import { Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type MagicLinkButtonProps = {
  view?: AuthView
}

/**
 * Toggle button between the password sign-in and magic-link routes.
 *
 * @param view - Current auth view. On `"magicLink"` this links back to password sign-in.
 */
export function MagicLinkButton({ view }: MagicLinkButtonProps) {
  const { basePaths, viewPaths, localization, Link } = useAuth()

  const signInMutating = useIsMutating({
    mutationKey: authMutationKeys.signIn.all
  })
  const signUpMutating = useIsMutating({
    mutationKey: authMutationKeys.signUp.all
  })
  const isPending = signInMutating + signUpMutating > 0

  const isMagicLinkView = view === "magicLink"

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      className={cn("w-full", isPending && "opacity-50 pointer-events-none")}
      asChild
    >
      <Link
        href={`${basePaths.auth}/${isMagicLinkView ? viewPaths.auth.signIn : viewPaths.auth.magicLink}`}
      >
        {isMagicLinkView ? <Lock /> : <Mail />}

        {localization.auth.continueWith.replace(
          "{{provider}}",
          isMagicLinkView
            ? localization.auth.password
            : localization.auth.magicLink
        )}
      </Link>
    </Button>
  )
}
