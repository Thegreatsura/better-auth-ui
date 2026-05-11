import {
  type UsernameLocalization,
  usernameLocalization
} from "@better-auth-ui/core/plugins"
import {
  signInEmailOptions,
  signInUsernameOptions,
  type UsernameAuthClient,
  useAuth
} from "@better-auth-ui/solid"
import { createMutation } from "@tanstack/solid-query"
import { createSignal, Show } from "solid-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const authHref = (basePath: string, viewPath: string) =>
  `${basePath}/${viewPath}`

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function SignIn() {
  const auth = useAuth()
  const [identifier, setIdentifier] = createSignal("")
  const [identifierError, setIdentifierError] = createSignal<string>()
  const [password, setPassword] = createSignal("")
  const [passwordError, setPasswordError] = createSignal<string>()
  const signIn = createMutation(() => signInEmailOptions(auth.authClient))
  const signInUsername = createMutation(() =>
    signInUsernameOptions(auth.authClient as UsernameAuthClient)
  )
  const usernamePlugin = auth.plugins.find((plugin) => plugin.id === "username")
  const usernameAuth = Boolean(usernamePlugin)
  const usernameLabels: UsernameLocalization = {
    ...usernameLocalization,
    ...(usernamePlugin?.localization as
      | Partial<UsernameLocalization>
      | undefined)
  }

  const submitSignIn = (event: SubmitEvent) => {
    event.preventDefault()

    if (usernameAuth && !isEmail(identifier())) {
      signInUsername.mutate({
        password: password(),
        username: identifier()
      })
      return
    }

    signIn.mutate({
      email: identifier(),
      password: password()
    })
  }

  return (
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl font-semibold">
          {auth.localization.auth.signIn}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form aria-label="Sign in" onSubmit={submitSignIn}>
          <div class="flex flex-col gap-6">
            <div class="grid gap-3">
              <Label for="sign-in-email">
                {usernameAuth
                  ? usernameLabels.username
                  : auth.localization.auth.email}
              </Label>
              <Input
                aria-invalid={Boolean(identifierError())}
                autocomplete={usernameAuth ? "username" : "email"}
                id="sign-in-email"
                name={usernameAuth ? "username" : "email"}
                onInput={(event) => {
                  setIdentifier(event.currentTarget.value)
                  setIdentifierError(undefined)
                }}
                onInvalid={(event) => {
                  event.preventDefault()
                  setIdentifierError(event.currentTarget.validationMessage)
                }}
                placeholder={
                  usernameAuth
                    ? usernameLabels.usernameOrEmailPlaceholder
                    : auth.localization.auth.emailPlaceholder
                }
                required
                type={usernameAuth ? "text" : "email"}
                value={identifier()}
              />

              <Show when={identifierError()}>
                {(message) => (
                  <p class="text-sm text-destructive" role="alert">
                    {message()}
                  </p>
                )}
              </Show>
            </div>

            <div class="grid gap-3">
              <Label for="sign-in-password">
                {auth.localization.auth.password}
              </Label>
              <Input
                aria-invalid={Boolean(passwordError())}
                autocomplete="current-password"
                id="sign-in-password"
                maxLength={auth.emailAndPassword.maxPasswordLength}
                minLength={auth.emailAndPassword.minPasswordLength}
                name="password"
                onInput={(event) => {
                  setPassword(event.currentTarget.value)
                  setPasswordError(undefined)
                }}
                onInvalid={(event) => {
                  event.preventDefault()
                  setPasswordError(event.currentTarget.validationMessage)
                }}
                placeholder={auth.localization.auth.passwordPlaceholder}
                required
                type="password"
                value={password()}
              />

              <Show when={passwordError()}>
                {(message) => (
                  <p class="text-sm text-destructive" role="alert">
                    {message()}
                  </p>
                )}
              </Show>
            </div>

            <Button
              disabled={signIn.isPending || signInUsername.isPending}
              type="submit"
            >
              {signIn.isPending || signInUsername.isPending
                ? `${auth.localization.auth.signIn}…`
                : auth.localization.auth.signIn}
            </Button>

            <Show when={signIn.isError || signInUsername.isError}>
              <p role="alert">Unable to sign in. Try again.</p>
            </Show>
          </div>
        </form>

        <div class="mt-4 flex w-full flex-col items-center gap-3">
          <Show when={auth.emailAndPassword.forgotPassword}>
            <a
              class="text-sm underline-offset-4 hover:underline"
              href={authHref(
                auth.basePaths.auth,
                auth.viewPaths.auth.forgotPassword
              )}
            >
              {auth.localization.auth.forgotPasswordLink}
            </a>
          </Show>

          <p class="text-center text-sm text-muted-foreground">
            {auth.localization.auth.needToCreateAnAccount}{" "}
            <a
              class="underline underline-offset-4"
              href={authHref(auth.basePaths.auth, auth.viewPaths.auth.signUp)}
            >
              {auth.localization.auth.signUp}
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
