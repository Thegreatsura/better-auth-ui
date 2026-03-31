import { Settings } from "@better-auth-ui/heroui"
import { viewPaths } from "@better-auth-ui/heroui/core"
import { notFound } from "next/navigation"

export default async function SettingsPage({
  params
}: {
  params: Promise<{
    path: string
  }>
}) {
  const { path } = await params

  if (!Object.values(viewPaths.settings).includes(path)) {
    notFound()
  }

  return (
    <Settings path={path} className="w-full max-w-3xl mx-auto p-4 md:p-6" />
  )
}
