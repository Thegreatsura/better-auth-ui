import type { AuthView } from "@better-auth-ui/core"
import { useAuth, useAuthPlugin } from "@better-auth-ui/react"
import { Envelope, Lock } from "@gravity-ui/icons"
import { cn, Link } from "@heroui/react"
import { buttonVariants } from "@heroui/styles"

import { magicLinkPlugin } from "../../lib/magic-link/magic-link-plugin"

export type MagicLinkButtonProps = {
  isPending?: boolean
  /** @remarks `AuthView` */
  view?: AuthView
}

/**
 * Renders a full-width tertiary link-style button that navigates to either the magic-link or sign-in route.
 *
 * @param isPending - If true, applies disabled styling and prevents interaction
 * @param view - Current auth view; when `"magicLink"`, the button targets the sign-in/password variant
 * @returns The rendered Link element with the appropriate href, icon, and label
 */
export function MagicLinkButton({ isPending, view }: MagicLinkButtonProps) {
  const { basePaths, emailAndPassword, viewPaths, localization } = useAuth()
  const { localization: magicLinkLocalization, viewPaths: magicLinkViewPaths } =
    useAuthPlugin(magicLinkPlugin)

  const isMagicLinkView = view === "magicLink"

  // On the magic-link view this button switches back to password sign-in.
  // With password auth disabled there's nowhere to switch to, so hide it.
  // (Other views — e.g. a phone-number plugin's surface — still get a
  // "Continue with Magic Link" link.)
  if (isMagicLinkView && !emailAndPassword?.enabled) return null

  return (
    <Link
      href={`${basePaths.auth}/${isMagicLinkView ? viewPaths.auth.signIn : magicLinkViewPaths.auth.magicLink}`}
      className={cn(
        buttonVariants({ variant: "tertiary" }),
        "w-full gap-2",
        isPending && "status-disabled pointer-events-none"
      )}
    >
      {isMagicLinkView ? <Lock /> : <Envelope />}

      {localization.auth.continueWith.replace(
        "{{provider}}",
        isMagicLinkView
          ? localization.auth.password
          : magicLinkLocalization.magicLink
      )}
    </Link>
  )
}
