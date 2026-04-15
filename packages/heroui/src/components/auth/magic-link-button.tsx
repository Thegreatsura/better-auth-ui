import type { AuthView } from "@better-auth-ui/core"
import { useAuth } from "@better-auth-ui/react"
import { Envelope, Lock } from "@gravity-ui/icons"
import { cn, Link } from "@heroui/react"
import { buttonVariants } from "@heroui/styles"

export type MagicLinkButtonProps = {
  isPending: boolean
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
  const { basePaths, viewPaths, localization } = useAuth()

  const isMagicLinkView = view === "magicLink"

  return (
    <Link
      href={`${basePaths.auth}/${isMagicLinkView ? viewPaths.auth.signIn : viewPaths.auth.magicLink}`}
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
          : localization.auth.magicLink
      )}
    </Link>
  )
}
