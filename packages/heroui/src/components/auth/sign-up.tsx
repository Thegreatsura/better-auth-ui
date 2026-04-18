import {
  useAuth,
  useIsUsernameAvailable,
  useSignInSocial,
  useSignUpEmail
} from "@better-auth-ui/react"
import { Check, Eye, EyeSlash, Xmark } from "@gravity-ui/icons"
import {
  Button,
  Card,
  type CardProps,
  cn,
  Description,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  Link,
  Spinner,
  TextField,
  toast
} from "@heroui/react"
import { useDebouncer } from "@tanstack/react-pacer"
import { type SyntheticEvent, useState } from "react"

import { FieldSeparator } from "./field-separator"
import { MagicLinkButton } from "./magic-link-button"
import { ProviderButtons, type SocialLayout } from "./provider-buttons"

export type SignUpProps = {
  className?: string
  socialLayout?: SocialLayout
  socialPosition?: "top" | "bottom"
  variant?: CardProps["variant"]
}

/**
 * Render a sign-up form with name, email, password (and optional confirm password) fields, optional social provider buttons, and password visibility controls.
 *
 * The component reflects request state by disabling inputs and showing a pending indicator during sign-up or social sign-in.
 *
 * @param className - Additional CSS classes applied to the outer card container
 * @param socialLayout - Social layout to apply to the provider buttons component
 * @param socialPosition - Position of social provider buttons relative to the form; `"top"` or `"bottom"` (default `"bottom"`)
 * @returns The sign-up form React element
 */
export function SignUp({
  className,
  socialLayout,
  socialPosition = "bottom",
  variant,
  ...props
}: SignUpProps & Omit<CardProps, "children">) {
  const {
    basePaths,
    emailAndPassword,
    localization,
    magicLink,
    redirectTo,
    socialProviders,
    username: usernameConfig,
    viewPaths,
    navigate
  } = useAuth()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")

  const {
    mutate: isUsernameAvailable,
    data: usernameData,
    error: usernameError,
    reset: resetUsername
  } = useIsUsernameAvailable()

  const usernameDebouncer = useDebouncer(
    (value: string) => {
      if (!value.trim()) {
        resetUsername()
        return
      }

      isUsernameAvailable({ username: value.trim() })
    },
    { wait: 500 }
  )

  function handleUsernameChange(value: string) {
    setUsername(value)
    resetUsername()

    if (usernameConfig?.isUsernameAvailable) {
      usernameDebouncer.maybeExecute(value)
    }
  }

  const { mutate: signUpEmail, isPending: signUpPending } = useSignUpEmail({
    onError: (error) => {
      setPassword("")
      setConfirmPassword("")
      toast.danger(error.error?.message || error.message)
    },
    onSuccess: () => {
      if (emailAndPassword?.requireEmailVerification) {
        toast.success(localization.auth.verifyYourEmail)
        navigate({ to: `${basePaths.auth}/${viewPaths.auth.signIn}` })
      } else {
        navigate({ to: redirectTo })
      }
    }
  })

  const [socialRedirecting, setSocialRedirecting] = useState(false)

  const { mutate: signInSocial, isPending: socialPending } = useSignInSocial({
    onError: (error) => toast.danger(error.error?.message || error.message),
    onSuccess: () => {
      setSocialRedirecting(true)

      setTimeout(() => {
        setSocialRedirecting(false)
      }, 5000)
    }
  })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)

  const isPending = signUpPending || socialPending || socialRedirecting

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    if (emailAndPassword?.confirmPassword && password !== confirmPassword) {
      toast.danger(localization.auth.passwordsDoNotMatch)
      setPassword("")
      setConfirmPassword("")
      return
    }

    signUpEmail({
      name,
      email,
      password,
      ...(usernameConfig?.enabled
        ? {
            username: username.trim(),
            ...(usernameConfig.displayUsername
              ? { displayUsername: username.trim() }
              : {})
          }
        : {})
    })
  }

  const showSeparator = emailAndPassword?.enabled && !!socialProviders?.length

  return (
    <Card
      className={cn("w-full max-w-sm p-4 md:p-6", className)}
      variant={variant}
      {...props}
    >
      <Card.Header>
        <Card.Title className="text-xl font-semibold mb-1">
          {localization.auth.signUp}
        </Card.Title>
      </Card.Header>

      <Card.Content className="gap-4">
        {socialPosition === "top" && (
          <>
            {!!socialProviders?.length && (
              <ProviderButtons
                isPending={isPending}
                socialLayout={socialLayout}
                signInSocial={signInSocial}
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
              name="name"
              type="text"
              autoComplete="name"
              isDisabled={isPending}
            >
              <Label>{localization.auth.name}</Label>

              <Input
                placeholder={localization.auth.namePlaceholder}
                required
                variant={variant === "transparent" ? "primary" : "secondary"}
              />

              <FieldError />
            </TextField>

            {usernameConfig?.enabled && (
              <TextField
                name="username"
                type="text"
                autoComplete="username"
                minLength={usernameConfig.minUsernameLength}
                maxLength={usernameConfig.maxUsernameLength}
                isDisabled={isPending}
                value={username}
                onChange={handleUsernameChange}
                isInvalid={
                  !!usernameError || (usernameData && !usernameData.available)
                }
              >
                <Label>{localization.auth.username}</Label>

                <InputGroup
                  variant={variant === "transparent" ? "primary" : "secondary"}
                >
                  <InputGroup.Input
                    placeholder={localization.auth.usernamePlaceholder}
                    required
                  />

                  {usernameConfig.isUsernameAvailable && username.trim() && (
                    <InputGroup.Suffix className="px-2">
                      {usernameData?.available ? (
                        <Check className="text-success" />
                      ) : usernameError || usernameData?.available === false ? (
                        <Xmark className="text-danger" />
                      ) : (
                        <Spinner size="sm" color="current" />
                      )}
                    </InputGroup.Suffix>
                  )}
                </InputGroup>

                <FieldError>
                  {usernameError?.error?.message ||
                    usernameError?.message ||
                    (usernameData?.available === false &&
                      localization.auth.usernameTaken)}
                </FieldError>
              </TextField>
            )}

            <TextField
              name="email"
              type="email"
              autoComplete="email"
              isDisabled={isPending}
            >
              <Label>{localization.auth.email}</Label>

              <Input
                placeholder={localization.auth.emailPlaceholder}
                required
                variant={variant === "transparent" ? "primary" : "secondary"}
              />

              <FieldError />
            </TextField>

            <TextField
              minLength={emailAndPassword?.minPasswordLength}
              maxLength={emailAndPassword?.maxPasswordLength}
              name="password"
              autoComplete="new-password"
              isDisabled={isPending}
              value={password}
              onChange={setPassword}
            >
              <Label>{localization.auth.password}</Label>

              <InputGroup
                variant={variant === "transparent" ? "primary" : "secondary"}
              >
                <InputGroup.Input
                  placeholder={localization.auth.passwordPlaceholder}
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  required
                />

                <InputGroup.Suffix className="px-0">
                  <Button
                    isIconOnly
                    aria-label={
                      isPasswordVisible
                        ? localization.auth.hidePassword
                        : localization.auth.showPassword
                    }
                    size="sm"
                    variant="ghost"
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    isDisabled={isPending}
                  >
                    {isPasswordVisible ? <EyeSlash /> : <Eye />}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>

              <FieldError />
            </TextField>

            {emailAndPassword?.confirmPassword && (
              <TextField
                minLength={emailAndPassword?.minPasswordLength}
                maxLength={emailAndPassword?.maxPasswordLength}
                name="confirmPassword"
                autoComplete="new-password"
                isDisabled={isPending}
                value={confirmPassword}
                onChange={setConfirmPassword}
              >
                <Label>{localization.auth.confirmPassword}</Label>

                <InputGroup
                  variant={variant === "transparent" ? "primary" : "secondary"}
                >
                  <InputGroup.Input
                    name="confirmPassword"
                    placeholder={localization.auth.confirmPasswordPlaceholder}
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    required
                  />

                  <InputGroup.Suffix className="px-0">
                    <Button
                      isIconOnly
                      aria-label={
                        isConfirmPasswordVisible
                          ? localization.auth.hidePassword
                          : localization.auth.showPassword
                      }
                      size="sm"
                      variant="ghost"
                      onPress={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                      isDisabled={isPending}
                    >
                      {isConfirmPasswordVisible ? <EyeSlash /> : <Eye />}
                    </Button>
                  </InputGroup.Suffix>
                </InputGroup>

                <FieldError />
              </TextField>
            )}

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" isPending={isPending}>
                {isPending && <Spinner color="current" size="sm" />}

                {localization.auth.signUp}
              </Button>

              {magicLink && (
                <MagicLinkButton view="signUp" isPending={isPending} />
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
                signInSocial={signInSocial}
                isPending={isPending}
              />
            )}
          </>
        )}
      </Card.Content>

      <Card.Footer className="flex-col">
        <Description className="text-sm">
          {localization.auth.alreadyHaveAnAccount}{" "}
          <Link
            href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
            className="text-accent decoration-accent no-underline hover:underline"
          >
            {localization.auth.signIn}
          </Link>
        </Description>
      </Card.Footer>
    </Card>
  )
}
