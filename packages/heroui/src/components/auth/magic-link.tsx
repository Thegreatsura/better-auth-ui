"use client"

import {
  type MagicLinkAuthClient,
  useAuth,
  useSignInMagicLink
} from "@better-auth-ui/react"
import {
  Button,
  Card,
  type CardProps,
  cn,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Link,
  Spinner,
  TextField,
  toast
} from "@heroui/react"
import { type SyntheticEvent, useState } from "react"

import type { AuthPlugin } from "../../lib/auth-plugin"
import { FieldSeparator } from "./field-separator"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

export type MagicLinkProps = {
  className?: string
  socialLayout?: SocialLayout
  socialPosition?: "top" | "bottom"
  variant?: CardProps["variant"]
}

/**
 * Render a card-based sign-in form that sends an email magic link and optionally shows social provider buttons.
 *
 * @param className - Additional CSS class names applied to the card container
 * @param socialLayout - Layout style for social provider buttons
 * @param socialPosition - Position of social provider buttons; `"top"` or `"bottom"`. Defaults to `"bottom"`.
 * @returns The magic-link sign-in UI as a JSX element
 */
export function MagicLink({
  className,
  socialLayout,
  socialPosition = "bottom",
  variant,
  ...props
}: MagicLinkProps & Omit<CardProps, "children">) {
  const {
    authClient,
    basePaths,
    baseURL,
    localization,
    plugins,
    redirectTo,
    socialProviders,
    viewPaths
  } = useAuth<AuthPlugin>()

  const [email, setEmail] = useState("")

  const { mutate: signInMagicLink, isPending: magicLinkPending } =
    useSignInMagicLink(authClient as MagicLinkAuthClient, {
      onSuccess: () => {
        setEmail("")
        toast.success(localization.auth.magicLinkSent)
      }
    })

  const isPending = magicLinkPending

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    signInMagicLink({ email, callbackURL: `${baseURL}${redirectTo}` })
  }

  const showSeparator = !!socialProviders?.length

  return (
    <Card
      className={cn("w-full max-w-sm p-4 md:p-6", className)}
      variant={variant}
      {...props}
    >
      <Card.Header>
        <Card.Title className="text-xl font-semibold mb-1">
          {localization.auth.signIn}
        </Card.Title>
      </Card.Header>

      <Card.Content className="gap-4">
        {socialPosition === "top" && (
          <>
            {!!socialProviders?.length && (
              <ProviderButtons
                socialLayout={socialLayout}
                isPending={isPending}
              />
            )}

            {showSeparator && (
              <FieldSeparator>{localization.auth.or}</FieldSeparator>
            )}
          </>
        )}

        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            name="email"
            type="email"
            autoComplete="email"
            isDisabled={isPending}
            value={email}
            onChange={setEmail}
          >
            <Label>{localization.auth.email}</Label>

            <Input
              placeholder={localization.auth.emailPlaceholder}
              required
              variant={variant === "transparent" ? "primary" : "secondary"}
            />

            <FieldError />
          </TextField>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" isPending={isPending}>
              {isPending && <Spinner color="current" size="sm" />}

              {localization.auth.sendMagicLink}
            </Button>

            {plugins?.flatMap((plugin) =>
              (plugin.authButtons ?? []).map((Button, index) => (
                <Button
                  key={`${plugin.id}-${index.toString()}`}
                  view="magicLink"
                  isPending={isPending}
                />
              ))
            )}
          </div>
        </Form>

        {socialPosition === "bottom" && (
          <>
            {showSeparator && (
              <FieldSeparator>{localization.auth.or}</FieldSeparator>
            )}

            {!!socialProviders?.length && (
              <ProviderButtons
                socialLayout={socialLayout}
                isPending={isPending}
              />
            )}
          </>
        )}
      </Card.Content>

      <Card.Footer className="flex-col">
        <Description className="text-sm">
          {localization.auth.needToCreateAnAccount}{" "}
          <Link
            href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
            className="text-accent decoration-accent no-underline hover:underline"
          >
            {localization.auth.signUp}
          </Link>
        </Description>
      </Card.Footer>
    </Card>
  )
}
