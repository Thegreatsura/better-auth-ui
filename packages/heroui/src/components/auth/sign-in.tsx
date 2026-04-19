import {
  useAuth,
  useSendVerificationEmail,
  useSignInEmail,
  useSignInUsername
} from "@better-auth-ui/react"
import {
  Button,
  Card,
  type CardProps,
  Checkbox,
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

import { FieldSeparator } from "./field-separator"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

export interface SignInProps {
  className?: string
  socialLayout?: SocialLayout
  socialPosition?: "top" | "bottom"
  variant?: CardProps["variant"]
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Render the sign-in UI using auth context for configuration and localization.
 *
 * @returns The sign-in JSX element containing email/password fields, optional magic-link button, and social provider buttons.
 */
export function SignIn({
  className,
  socialLayout,
  socialPosition = "bottom",
  variant,
  ...props
}: SignInProps & Omit<CardProps, "children">) {
  const {
    basePaths,
    baseURL,
    emailAndPassword,
    localization,
    magicLink,
    plugins,
    redirectTo,
    socialProviders,
    username: usernameConfig,
    viewPaths,
    navigate
  } = useAuth()

  const [password, setPassword] = useState("")

  const { mutate: sendVerificationEmail } = useSendVerificationEmail({
    onSuccess: () => toast.success(localization.auth.verificationEmailSent)
  })

  const { mutate: signInEmail, isPending: signInEmailPending } = useSignInEmail(
    {
      onError: (error, { email }) => {
        setPassword("")

        if (error.error?.code === "EMAIL_NOT_VERIFIED") {
          toast.danger(error.error?.message || error.message, {
            actionProps: {
              children: localization.auth.resend,
              onClick: () =>
                sendVerificationEmail({
                  email,
                  callbackURL: `${baseURL}${redirectTo}`
                })
            }
          })
        } else {
          toast.danger(error.error?.message || error.message)
        }
      },
      onSuccess: () => navigate({ to: redirectTo })
    }
  )

  const { mutate: signInUsername, isPending: signInUsernamePending } =
    useSignInUsername({
      onError: (error) => {
        setPassword("")
        toast.danger(error.error?.message || error.message)
      },
      onSuccess: () => navigate({ to: redirectTo })
    })

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const rememberMe = formData.get("rememberMe") === "on"

    if (usernameConfig?.enabled && !isEmail(email)) {
      signInUsername({
        username: email,
        password
      })
    } else {
      signInEmail({
        email,
        password,
        ...(emailAndPassword?.rememberMe ? { rememberMe } : {})
      })
    }
  }

  const isPending = signInEmailPending || signInUsernamePending

  const showSeparator = emailAndPassword?.enabled && !!socialProviders?.length

  return (
    <Card
      className={cn("w-full max-w-sm gap-4 md:p-6", className)}
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

        {emailAndPassword?.enabled && (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              name="email"
              type={usernameConfig?.enabled ? "text" : "email"}
              autoComplete={usernameConfig?.enabled ? "username" : "email"}
              isDisabled={isPending}
            >
              <Label>
                {usernameConfig?.enabled
                  ? localization.auth.username
                  : localization.auth.email}
              </Label>

              <Input
                placeholder={
                  usernameConfig?.enabled
                    ? localization.auth.usernameOrEmailPlaceholder
                    : localization.auth.emailPlaceholder
                }
                variant={variant === "transparent" ? "primary" : "secondary"}
                required
              />

              <FieldError />
            </TextField>

            <TextField
              minLength={emailAndPassword?.minPasswordLength}
              maxLength={emailAndPassword?.maxPasswordLength}
              name="password"
              type="password"
              autoComplete="current-password"
              isDisabled={isPending}
              value={password}
              onChange={setPassword}
            >
              <Label>{localization.auth.password}</Label>

              <Input
                placeholder={localization.auth.passwordPlaceholder}
                variant={variant === "transparent" ? "primary" : "secondary"}
                required
              />

              <FieldError />
            </TextField>

            {emailAndPassword?.rememberMe && (
              <Checkbox
                name="rememberMe"
                isDisabled={isPending}
                variant={variant === "transparent" ? "primary" : "secondary"}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>

                <Checkbox.Content>
                  <Label>{localization.auth.rememberMe}</Label>
                </Checkbox.Content>
              </Checkbox>
            )}

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {localization.auth.signIn}
              </Button>

              {magicLink && (
                <MagicLinkButton view="signIn" isPending={isPending} />
              )}

              {plugins?.map(
                (plugin) =>
                  plugin.AuthButton && (
                    <plugin.AuthButton key={plugin.id} isPending={isPending} />
                  )
              )}
            </div>
          </Form>
        )}

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

      <Card.Footer className="flex-col gap-3">
        {emailAndPassword?.forgotPassword && (
          <Link
            href={`${basePaths.auth}/${viewPaths.auth.forgotPassword}`}
            className="no-underline hover:underline"
          >
            {localization.auth.forgotPasswordLink}
          </Link>
        )}

        {emailAndPassword?.enabled && (
          <Description className="text-sm">
            {localization.auth.needToCreateAnAccount}{" "}
            <Link
              href={`${basePaths.auth}/${viewPaths.auth.signUp}`}
              className="text-accent no-underline hover:underline decoration-accent-hover"
            >
              {localization.auth.signUp}
            </Link>
          </Description>
        )}
      </Card.Footer>
    </Card>
  )
}
