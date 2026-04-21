import { Auth } from "@better-auth-ui/heroui"
import { viewPaths } from "@better-auth-ui/heroui/core"
import { magicLinkPlugin } from "@better-auth-ui/heroui/plugins"
import { notFound } from "next/navigation"

export default async function AuthPage({
  params
}: {
  params: Promise<{
    path: string
  }>
}) {
  const { path } = await params

  if (
    !Object.values({
      ...viewPaths.auth,
      ...magicLinkPlugin().viewPaths?.auth
    }).includes(path)
  ) {
    notFound()
  }

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      <Auth path={path} />
    </div>
  )
}
