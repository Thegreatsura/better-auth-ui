import { useAuth } from "@better-auth-ui/solid"
import { Fingerprint } from "lucide-solid"
import { passkeyLabels } from "@/components/auth/passkey/passkey-localization"
import { Button } from "@/components/ui/button"

export function PasskeysEmpty(props: { onAddPress: () => void }) {
  const auth = useAuth()
  const labels = () => passkeyLabels(auth)

  return (
    <div class="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div class="flex size-10 items-center justify-center rounded-md bg-muted">
        <Fingerprint class="size-4.5" />
      </div>

      <div class="flex flex-col items-center justify-center gap-1">
        <p class="font-semibold text-sm">{labels().noPasskeys}</p>
        <p class="text-muted-foreground text-xs">
          {labels().passkeysDescription}
        </p>
      </div>

      <Button onClick={props.onAddPress} size="sm" type="button">
        {labels().addPasskey}
      </Button>
    </div>
  )
}
