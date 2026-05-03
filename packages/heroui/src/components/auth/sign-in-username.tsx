import { authMutationKeys } from "@better-auth-ui/core"
import {
  type UsernameAuthClient,
  useAuth,
  useAuthPlugin,
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
import { useIsMutating } from "@tanstack/react-query"
import { type SyntheticEvent, useState } from "react"
import { usernamePlugin } from "../../lib/username/username-plugin"
import { FieldSeparator } from "./field-separator"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

export interface SignInUsernameProps {
  className?: string
  socialLayout?: SocialLayout
  socialPosition?: "top" | "bottom"
  variant?: CardProps["variant"]
}

/**
 * Render the username-based sign-in UI.
 *
 * @returns The sign-in JSX element containing username/password fields, optional magic-link button, and social provider buttons.
 */
export function SignInUsername({
  className,
  socialLayout,
  socialPosition = "bottom",
  variant,
  ...props
}: SignInUsernameProps & Omit<CardProps, "children">) {
  const {
    authClient,
    basePaths,
    emailAndPassword,
    localization,
    plugins,
    redirectTo,
    socialProviders,
    viewPaths,
    navigate
  } = useAuth()

  const { localization: usernameLocalization } = useAuthPlugin(usernamePlugin)

  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const { mutate: signInUsername, isPending: isSignInPending } =
    useSignInUsername(authClient as UsernameAuthClient, {
      onError: (error) => {
        setPassword("")
        toast.danger(error.error?.message || error.message)
      },
      onSuccess: () => navigate({ to: redirectTo })
    })

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const rememberMe = formData.get("rememberMe") === "on"

    signInUsername({
      username: username.trim(),
      password,
      ...(emailAndPassword?.rememberMe ? { rememberMe } : {})
    })
  }

  const signInMutating = useIsMutating({
    mutationKey: authMutationKeys.signIn.all
  })
  const signUpMutating = useIsMutating({
    mutationKey: authMutationKeys.signUp.all
  })
  const isPending = signInMutating + signUpMutating > 0

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
              <ProviderButtons socialLayout={socialLayout} />
            )}

            {showSeparator && (
              <FieldSeparator>{localization.auth.or}</FieldSeparator>
            )}
          </>
        )}

        {emailAndPassword?.enabled && (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              name="username"
              type="text"
              autoComplete="username"
              isDisabled={isPending}
              value={username}
              onChange={setUsername}
            >
              <Label>{usernameLocalization.username}</Label>

              <Input
                placeholder={usernameLocalization.usernameOrEmailPlaceholder}
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
              <Button
                type="submit"
                className="w-full"
                isPending={isSignInPending || isPending}
              >
                {isPending && <Spinner color="current" size="sm" />}

                {localization.auth.signIn}
              </Button>

              {plugins.flatMap((plugin) =>
                plugin.authButtons?.map((AuthButton, index) => (
                  <AuthButton
                    key={`${plugin.id}-${index.toString()}`}
                    view="signInUsername"
                  />
                ))
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
              <ProviderButtons socialLayout={socialLayout} />
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
