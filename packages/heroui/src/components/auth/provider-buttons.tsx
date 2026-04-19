import { useAuth } from "@better-auth-ui/react"
import { cn } from "@heroui/react"
import { useMemo } from "react"
import { ProviderButton } from "./provider-button"
export type ProviderButtonsProps = {
  isPending?: boolean
  socialLayout?: SocialLayout
}

export type SocialLayout = "auto" | "horizontal" | "vertical" | "grid"

/**
 * Render social provider sign-in buttons. Each button owns its own sign-in mutation.
 *
 * @param isPending - External pending state (e.g. parent form submitting) that disables all buttons.
 * @param socialLayout - Preferred layout for the buttons; `"auto"` picks `"horizontal"` when there are four or more providers, otherwise `"vertical"`.
 * @returns The JSX element that renders the configured social provider buttons.
 */
export function ProviderButtons({
  isPending,
  socialLayout = "auto"
}: ProviderButtonsProps) {
  const { socialProviders } = useAuth()

  const resolvedSocialLayout = useMemo(() => {
    if (socialLayout === "auto") {
      if (socialProviders?.length && socialProviders.length >= 4) {
        return "horizontal"
      }

      return "vertical"
    }

    return socialLayout
  }, [socialLayout, socialProviders?.length])

  return (
    <div
      className={cn(
        "gap-3",
        resolvedSocialLayout === "grid" && "grid grid-cols-2",
        resolvedSocialLayout === "vertical" && "flex flex-col",
        resolvedSocialLayout === "horizontal" && "flex flex-wrap"
      )}
    >
      {socialProviders?.map((provider) => (
        <ProviderButton
          key={provider}
          provider={provider}
          isDisabled={isPending}
          label={
            resolvedSocialLayout === "vertical"
              ? "continueWith"
              : resolvedSocialLayout === "grid"
                ? "providerName"
                : "none"
          }
          className={cn(
            "w-full",
            resolvedSocialLayout === "horizontal" && "flex-1"
          )}
        />
      ))}
    </div>
  )
}
