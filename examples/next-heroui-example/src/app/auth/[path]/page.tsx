import { Auth } from "@better-auth-ui/heroui"
import { resolveViewPaths } from "@better-auth-ui/heroui/core"
import { notFound } from "next/navigation"

import { authPlugins } from "@/lib/auth-plugins"

export default async function AuthPage({
  params
}: {
  params: Promise<{
    path: string
  }>
}) {
  const { path } = await params

  if (!Object.values(resolveViewPaths(authPlugins).auth).includes(path)) {
    notFound()
  }

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      <Auth path={path} />
    </div>
  )
}
