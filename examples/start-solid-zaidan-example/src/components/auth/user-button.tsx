import { useAuth, useSession } from "@better-auth-ui/solid"
import {
  ChevronsUpDown,
  LogIn,
  LogOut,
  Settings,
  User,
  UserPlus2
} from "lucide-solid"
import { Match, Show, Switch } from "solid-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const authHref = (basePath: string, viewPath: string) =>
  `${basePath}/${viewPath}`

const resolveUserLabel = (
  username?: string | null,
  name?: string | null,
  email?: string | null
) => username || name || email || "Account"

const resolveUserSecondaryLabel = (
  username?: string | null,
  name?: string | null,
  email?: string | null
) => (username || name ? email : undefined)

const resolveUserInitials = (
  username?: string | null,
  name?: string | null,
  email?: string | null
) => resolveUserLabel(username, name, email).slice(0, 2).toUpperCase()

export function UserButton() {
  const auth = useAuth()
  const session = useSession(auth.authClient)
  const settingsLabel = () => auth.localization.settings.settings

  const signInHref = authHref(auth.basePaths.auth, auth.viewPaths.auth.signIn)
  const signUpHref = authHref(auth.basePaths.auth, auth.viewPaths.auth.signUp)
  const signOutHref = authHref(auth.basePaths.auth, auth.viewPaths.auth.signOut)

  const userLabel = () =>
    resolveUserLabel(
      undefined,
      session.data?.user.name,
      session.data?.user.email
    )

  const userSecondaryLabel = () =>
    resolveUserSecondaryLabel(
      undefined,
      session.data?.user.name,
      session.data?.user.email
    )

  const userInitials = () =>
    resolveUserInitials(
      undefined,
      session.data?.user.name,
      session.data?.user.email
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        class={cn(
          buttonVariants({ size: "lg", variant: "ghost" }),
          "h-auto w-full max-w-sm justify-between gap-3 rounded-full px-3 py-2.5"
        )}
      >
        <div class="flex min-w-0 items-center gap-3 text-left">
          <Avatar class="size-9 rounded-full bg-muted text-muted-foreground">
            <AvatarImage
              alt={userLabel()}
              src={session.data?.user.image ?? undefined}
            />
            <AvatarFallback class="rounded-full bg-muted text-muted-foreground">
              <Show when={session.data} fallback={<User class="size-4" />}>
                {userInitials()}
              </Show>
            </AvatarFallback>
          </Avatar>

          <div class="grid min-w-0 flex-1 text-sm leading-tight">
            <span class="truncate font-medium text-foreground">
              <Switch>
                <Match when={session.isPending}>
                  {`${auth.localization.auth.account}…`}
                </Match>
                <Match when={session.data}>{userLabel()}</Match>
                <Match when={!session.data}>
                  {auth.localization.auth.account}
                </Match>
              </Switch>
            </span>

            <span class="truncate text-xs text-muted-foreground">
              <Show
                when={session.data}
                fallback={auth.localization.auth.needToCreateAnAccount}
              >
                {userSecondaryLabel() ?? auth.localization.auth.signIn}
              </Show>
            </span>
          </div>
        </div>

        <ChevronsUpDown class="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-72 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
        <DropdownMenuLabel class="px-2 py-1.5 text-sm font-normal text-foreground">
          <div class="flex items-center gap-3">
            <Avatar class="size-10 rounded-full bg-muted text-muted-foreground">
              <AvatarImage
                alt={userLabel()}
                src={session.data?.user.image ?? undefined}
              />
              <AvatarFallback class="rounded-full bg-muted text-muted-foreground">
                <Show when={session.data} fallback={<User class="size-4" />}>
                  {userInitials()}
                </Show>
              </AvatarFallback>
            </Avatar>

            <div class="grid min-w-0 flex-1 gap-0.5">
              <span class="truncate font-medium text-foreground">
                {userLabel()}
              </span>
              <Show when={session.data?.user.email}>
                <span class="truncate text-xs text-muted-foreground">
                  {session.data?.user.email}
                </span>
              </Show>
            </div>
          </div>
        </DropdownMenuLabel>

        <Separator class="my-1" />

        <Show
          when={session.data}
          fallback={
            <>
              <DropdownMenuItem
                as="a"
                class="gap-2 rounded-md px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground"
                href={signInHref}
              >
                <LogIn class="size-4 text-muted-foreground" />
                {auth.localization.auth.signIn}
              </DropdownMenuItem>

              <DropdownMenuItem
                as="a"
                class="gap-2 rounded-md px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground"
                href={signUpHref}
              >
                <UserPlus2 class="size-4 text-muted-foreground" />
                {auth.localization.auth.signUp}
              </DropdownMenuItem>
            </>
          }
        >
          <DropdownMenuItem
            class="gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground"
            disabled
          >
            <Settings class="size-4 text-muted-foreground" />
            {settingsLabel()}
          </DropdownMenuItem>

          <DropdownMenuSeparator class="my-1 bg-border" />

          <DropdownMenuItem
            as="a"
            class="gap-2 rounded-md px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground"
            href={signOutHref}
          >
            <LogOut class="size-4 text-muted-foreground" />
            {auth.localization.auth.signOut}
          </DropdownMenuItem>
        </Show>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
