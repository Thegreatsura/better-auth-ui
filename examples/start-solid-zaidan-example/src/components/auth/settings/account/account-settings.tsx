import { useAuth } from "@better-auth-ui/solid"
import type { Component } from "solid-js"
import { For, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import { ChangeEmail } from "@/components/auth/settings/account/change-email"
import { UserProfile } from "@/components/auth/settings/account/user-profile"
import { cn } from "@/lib/utils"

export type AccountSettingsProps = {
  class?: string
}

type AccountCardPlugin = {
  id: string
  accountCards?: Component[]
}

export function AccountSettings(props: AccountSettingsProps = {}) {
  const auth = useAuth()
  const pluginAccountCards = () =>
    (auth.plugins as AccountCardPlugin[]).flatMap((plugin) =>
      (plugin.accountCards ?? []).map((AccountCard, index) => ({
        AccountCard,
        id: `${plugin.id}-${index.toString()}`
      }))
    )
  const showChangeEmail = () =>
    Boolean(
      auth.emailAndPassword?.enabled ||
        auth.plugins.some((plugin) => plugin.id === "magicLink")
    )

  return (
    <div class={cn("flex w-full flex-col gap-4 md:gap-6", props.class)}>
      <UserProfile />

      <Show when={showChangeEmail()}>
        <ChangeEmail />
      </Show>

      <For each={pluginAccountCards()}>
        {(item) => <Dynamic component={item.AccountCard} />}
      </For>
    </div>
  )
}
