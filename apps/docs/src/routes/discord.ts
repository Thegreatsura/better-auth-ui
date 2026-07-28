import { createFileRoute, redirect } from "@tanstack/react-router"

const discordInviteUrl = "https://discord.gg/GKPC4npz8K"

export const Route = createFileRoute("/discord")({
  beforeLoad: () => {
    throw redirect({
      href: discordInviteUrl,
      statusCode: 302
    })
  }
})
