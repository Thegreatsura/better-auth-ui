import type { SettingsView } from "@better-auth-ui/core"
import { listAccountsOptions, useAuth, useSession } from "@better-auth-ui/solid"
import { createQuery } from "@tanstack/solid-query"
import { Link } from "@tanstack/solid-router"
import { KeyRound, LinkIcon, Mail, ShieldCheck, User } from "lucide-solid"
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  Show
} from "solid-js"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type SettingsSession = ReturnType<typeof useSession>

type SettingsPanel = {
  component: Component<{ session: SettingsSession }>
  title: string
}

export type SettingsRouteResolution = SettingsPanel | { redirectTo: string }

const settingsPathViews = () => {
  const auth = useAuth()

  return Object.fromEntries(
    Object.entries(auth.viewPaths.settings).map(([view, path]) => [path, view])
  ) as Record<string, SettingsView>
}

const resolveUserLabel = (name?: string | null, email?: string | null) =>
  name?.trim() || email?.trim() || "Signed in user"

export function shouldLoadLinkedAccounts(props: {
  isSsr: boolean
  userId?: string
}) {
  return !props.isSsr && Boolean(props.userId)
}

function SettingsUnavailableNotice(props: { children: string }) {
  return (
    <p class="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
      {props.children}
    </p>
  )
}

export function AccountSettings(props: { session: SettingsSession }) {
  const auth = useAuth()
  const [name, setName] = createSignal("")
  const userId = () => props.session.data?.user.id
  const accounts = createQuery(() => ({
    ...listAccountsOptions(auth.authClient, userId()),
    enabled: shouldLoadLinkedAccounts({
      isSsr: import.meta.env.SSR,
      userId: userId()
    })
  }))
  const displayName = () =>
    resolveUserLabel(
      props.session.data?.user.name,
      props.session.data?.user.email
    )

  return (
    <div class="flex w-full flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="size-4" />
            Account information
          </CardTitle>
          <CardDescription>
            Your signed-in profile details from the current auth session.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="settings-name">Name</Label>
            <Input
              id="settings-name"
              onInput={(event) => setName(event.currentTarget.value)}
              placeholder={displayName()}
              value={name() || (props.session.data?.user.name ?? "")}
            />
          </div>
          <div class="grid gap-2">
            <Label for="settings-email">Email</Label>
            <Input
              id="settings-email"
              readOnly
              value={props.session.data?.user.email ?? ""}
            />
          </div>
          <SettingsUnavailableNotice>
            Profile update mutations are not available in this Solid slice yet.
          </SettingsUnavailableNotice>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Mail class="size-4" />
            Email and password
          </CardTitle>
          <CardDescription>
            Email changes remain intentionally bounded until mutation UX parity
            is ported.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsUnavailableNotice>
            Change email is not available in this Solid slice yet.
          </SettingsUnavailableNotice>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <LinkIcon class="size-4" />
            Social accounts
          </CardTitle>
          <CardDescription>
            Connected accounts are read from the Solid list accounts query
            helper.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-3">
          <Show
            when={(accounts.data ?? []).length > 0}
            fallback={
              <p class="text-sm text-muted-foreground">
                No linked social accounts are available for this session.
              </p>
            }
          >
            <For each={accounts.data ?? []}>
              {(account) => (
                <div class="flex items-center justify-between rounded-md border p-3 text-sm">
                  <span>{account.provider}</span>
                  <span class="text-muted-foreground">Connected</span>
                </div>
              )}
            </For>
          </Show>
        </CardContent>
      </Card>
    </div>
  )
}

export function SecuritySettings(props: { session: SettingsSession }) {
  return (
    <div class="flex w-full flex-col gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <KeyRound class="size-4" />
            Password
          </CardTitle>
          <CardDescription>
            Password management follows the shadcn settings shape, with bounded
            Solid behavior for this slice.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <SettingsUnavailableNotice>
            Change password is not available in this Solid slice yet.
          </SettingsUnavailableNotice>
          <Button disabled type="button" variant="secondary">
            Change password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ShieldCheck class="size-4" />
            Active sessions
          </CardTitle>
          <CardDescription>
            Current session details are derived from Better Auth session state.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-3">
          <div class="rounded-md border p-3 text-sm">
            <p class="font-medium">Current session</p>
            <p class="text-muted-foreground">
              Signed in as{" "}
              {resolveUserLabel(
                props.session.data?.user.name,
                props.session.data?.user.email
              )}
            </p>
          </div>
          <SettingsUnavailableNotice>
            Session revocation is not available in this Solid slice yet.
          </SettingsUnavailableNotice>
        </CardContent>
      </Card>
    </div>
  )
}

export function resolveSettingsRoute(path: string): SettingsRouteResolution {
  if (path === "account") {
    return { component: AccountSettings, title: "Account" }
  }

  if (path === "security") {
    return { component: SecuritySettings, title: "Security" }
  }

  return { redirectTo: "/" }
}

export function Settings(props: { class?: string; path: string }) {
  const auth = useAuth()
  const session = useSession(auth.authClient, {
    enabled: !import.meta.env.SSR
  })
  const currentView = createMemo(() => settingsPathViews()[props.path])
  const activeRoute = createMemo(() => resolveSettingsRoute(props.path))

  createEffect(() => {
    if (import.meta.env.SSR || session.isPending || session.data) return

    const currentURL = window.location.pathname + window.location.search
    const redirectTo = encodeURIComponent(currentURL)

    auth.navigate({
      replace: true,
      to: `${auth.basePaths.auth}/${auth.viewPaths.auth.signIn}?redirectTo=${redirectTo}`
    })
  })

  return (
    <div class={cn("w-full space-y-4 md:space-y-6", props.class)}>
      <div>
        <h1 class="text-2xl font-semibold">
          {auth.localization.settings.settings}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          Manage account and security settings for the current session.
        </p>
      </div>

      <nav aria-label={auth.localization.settings.settings} class="flex gap-2">
        <Link
          class={cn(
            "rounded-md px-3 py-2 text-sm font-medium",
            currentView() === "account"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          params={{ path: auth.viewPaths.settings.account }}
          to="/settings/$path"
        >
          {auth.localization.settings.account}
        </Link>
        <Link
          class={cn(
            "rounded-md px-3 py-2 text-sm font-medium",
            currentView() === "security"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          params={{ path: auth.viewPaths.settings.security }}
          to="/settings/$path"
        >
          {auth.localization.settings.security}
        </Link>
      </nav>

      <Separator />

      <Show
        when={!session.isPending && session.data}
        fallback={
          <p class="text-sm text-muted-foreground">Loading settings…</p>
        }
      >
        <Show when={!("redirectTo" in activeRoute())}>
          {(() => {
            const route = activeRoute() as SettingsPanel
            const Component = route.component

            return <Component session={session} />
          })()}
        </Show>
      </Show>
    </div>
  )
}
