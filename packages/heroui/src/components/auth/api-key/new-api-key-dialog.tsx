import { useAuth, useAuthPlugin } from "@better-auth-ui/react"
import { Check, Copy, Key } from "@gravity-ui/icons"
import {
  AlertDialog,
  Button,
  InputGroup,
  Label,
  TextField,
  toast
} from "@heroui/react"
import { useState } from "react"

import { apiKeyPlugin } from "../../../lib/auth/api-key-plugin"

export type NewApiKeyDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  name: string | null
  secretKey: string | null
}

export function NewApiKeyDialog({
  isOpen,
  onOpenChange,
  name,
  secretKey
}: NewApiKeyDialogProps) {
  const { localization } = useAuth()
  const { localization: apiKeyLocalization } = useAuthPlugin(apiKeyPlugin)

  const [copied, setCopied] = useState(false)

  const copySecretKey = async () => {
    if (!secretKey) return

    try {
      await navigator.clipboard.writeText(secretKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      toast.danger(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <AlertDialog.CloseTrigger />

          <AlertDialog.Header>
            <AlertDialog.Icon status="warning">
              <Key />
            </AlertDialog.Icon>

            <AlertDialog.Heading>
              {apiKeyLocalization.newApiKey}
            </AlertDialog.Heading>
          </AlertDialog.Header>

          <AlertDialog.Body className="flex flex-col gap-4 overflow-visible">
            <p className="text-muted text-sm">
              {apiKeyLocalization.newApiKeyWarning}
            </p>

            <TextField value={secretKey ?? ""} className="font-mono text-xs">
              <Label>{name || apiKeyLocalization.apiKey}</Label>

              <InputGroup variant="secondary">
                <InputGroup.Input readOnly className="font-mono text-xs" />

                <InputGroup.Suffix className="px-0">
                  <Button
                    isIconOnly
                    aria-label={localization.settings.copyToClipboard}
                    size="sm"
                    variant="ghost"
                    onPress={copySecretKey}
                  >
                    {copied ? <Check /> : <Copy />}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <Button slot="close">{apiKeyLocalization.dismissNewKey}</Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  )
}
