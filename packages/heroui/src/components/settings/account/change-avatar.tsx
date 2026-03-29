import { useAuth, useSession, useUpdateUser } from "@better-auth-ui/react"
import { Button, Label, Spinner, toast } from "@heroui/react"
import { type ChangeEvent, useRef, useState } from "react"
import { UserAvatar } from "../../user/user-avatar"

export type ChangeAvatarProps = {
  className?: string
}

export function ChangeAvatar({ className }: ChangeAvatarProps) {
  const {
    localization,
    settings: { avatar }
  } = useAuth()
  const { data: sessionData } = useSession()

  const { mutate: updateUser, isPending: updatePending } = useUpdateUser({
    onError: (error) => toast.danger(error.error?.message || error.message),
    onSuccess: () => toast.success(localization.settings.avatarChangedSuccess)
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  const isPending = updatePending || isUploading

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ""

    setIsUploading(true)
    try {
      const size = avatar.size
      const extension = avatar.extension ?? "png"
      const resized = avatar.resize
        ? await avatar.resize(file, size, extension)
        : file

      if (avatar.upload) {
        const imageUrl = await avatar.upload(resized)
        updateUser({ image: imageUrl })
      } else {
        const { fileToBase64 } = await import("@better-auth-ui/core")
        const base64 = await fileToBase64(resized)
        updateUser({ image: base64 })
      }
    } catch (error) {
      toast.danger(
        error instanceof Error ? error.message : "Failed to upload avatar"
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={className}>
      <Label isDisabled={!sessionData}>{localization.settings.avatar}</Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-4">
        <Button
          type="button"
          isIconOnly
          variant="ghost"
          className="p-0 h-auto w-auto rounded-full"
          isDisabled={!sessionData || isPending}
          onPress={openFilePicker}
        >
          <UserAvatar size="lg" isPending={isPending} />
        </Button>

        <Button
          isDisabled={!sessionData || isPending}
          size="sm"
          variant="secondary"
          onPress={openFilePicker}
        >
          {isPending && <Spinner size="sm" />}

          {localization.settings.changeAvatar}
        </Button>
      </div>
    </div>
  )
}
