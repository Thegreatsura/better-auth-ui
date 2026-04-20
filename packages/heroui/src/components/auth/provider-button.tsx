import { getProviderName } from "@better-auth-ui/core"
import { providerIcons, useAuth, useSignInSocial } from "@better-auth-ui/react"
import { Button, type ButtonProps, Spinner } from "@heroui/react"
import type { SocialProvider } from "better-auth/social-providers"
import { useState } from "react"

export type ProviderButtonProps = {
  provider: SocialProvider
  label?: "continueWith" | "providerName" | "none"
  isDisabled?: boolean
} & Omit<ButtonProps, "children" | "onPress" | "isPending">

/**
 * Render a single social provider sign-in button with its own mutation and pending state.
 *
 * @param provider - The social provider this button signs in with.
 * @param label - Label style: `"continueWith"` (e.g. "Continue with Google"), `"providerName"` (e.g. "Google"), or `"none"` (icon only).
 * @param isDisabled - External disabled state (e.g. a sibling provider is mid-redirect).
 */
export function ProviderButton({
  provider,
  label = "continueWith",
  isDisabled,
  variant = "tertiary",
  ...props
}: ProviderButtonProps) {
  const { authClient, baseURL, localization, redirectTo } = useAuth()

  const callbackURL = `${baseURL}${redirectTo}`

  const [redirecting, setRedirecting] = useState(false)

  const { mutate: signInSocial, isPending } = useSignInSocial(authClient, {
    onSuccess: () => {
      setRedirecting(true)

      setTimeout(() => {
        setRedirecting(false)
      }, 5000)
    }
  })

  const ProviderIcon = providerIcons[provider]

  const pending = isPending || redirecting

  return (
    <Button
      variant={variant}
      isDisabled={isDisabled}
      isPending={pending}
      onPress={() => signInSocial({ provider, callbackURL })}
      {...props}
    >
      {pending ? <Spinner color="current" size="sm" /> : <ProviderIcon />}

      {label === "continueWith"
        ? localization.auth.continueWith.replace(
            "{{provider}}",
            getProviderName(provider)
          )
        : label === "providerName"
          ? getProviderName(provider)
          : null}
    </Button>
  )
}
