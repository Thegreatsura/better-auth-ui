import type { AuthView } from "@better-auth-ui/core"
import {
  magicLinkPlugin as coreMagicLinkPlugin,
  type MagicLinkLocalization,
  magicLinkLocalization
} from "@better-auth-ui/core/plugins"
import { useAuth } from "@better-auth-ui/solid"
import { Link } from "@tanstack/solid-router"
import { Lock, Mail } from "lucide-solid"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type MagicLinkButtonProps = {
  view?: AuthView
}

export function MagicLinkButton(props: MagicLinkButtonProps) {
  const auth = useAuth()
  const magicLinkPluginConfig = () =>
    auth.plugins.find((plugin) => plugin.id === coreMagicLinkPlugin.id)
  const magicLinkLabels = (): MagicLinkLocalization => ({
    ...magicLinkLocalization,
    ...(magicLinkPluginConfig()?.localization as
      | Partial<MagicLinkLocalization>
      | undefined)
  })
  const magicLinkView = () =>
    (
      magicLinkPluginConfig()?.viewPaths as
        | { auth?: { magicLink?: string } }
        | undefined
    )?.auth?.magicLink ?? coreMagicLinkPlugin().viewPaths.auth.magicLink
  const isMagicLinkView = () => props.view === "magicLink"

  if (isMagicLinkView() && !auth.emailAndPassword?.enabled) return null

  return (
    <Link
      class={cn(buttonVariants({ variant: "outline" }), "w-full")}
      params={{
        path: isMagicLinkView() ? auth.viewPaths.auth.signIn : magicLinkView()
      }}
      to="/auth/$path"
    >
      {isMagicLinkView() ? <Lock /> : <Mail />}
      {auth.localization.auth.continueWith.replace(
        "{{provider}}",
        isMagicLinkView()
          ? auth.localization.auth.password
          : magicLinkLabels().magicLink
      )}
    </Link>
  )
}
