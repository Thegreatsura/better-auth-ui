import type { MagicLinkAuthClient } from "@better-auth-ui/solid"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { AuthProvider } from "@/components/auth/auth-provider"
import { MagicLink } from "@/components/auth/magic-link"
import { magicLinkPlugin } from "@/lib/auth/magic-link-plugin"

const mockAuthClient = {
  signIn: {
    magicLink: async () => ({ data: null, error: null })
  }
} as unknown as MagicLinkAuthClient

function MagicLinkStory() {
  return (
    <AuthProvider
      authClient={mockAuthClient}
      baseURL="http://localhost:3000"
      emailAndPassword={{ enabled: false }}
      plugins={[magicLinkPlugin()]}
      redirectTo="/settings/account"
    >
      {() => (
        <main class="mx-auto flex min-h-[420px] w-full max-w-xl items-center justify-center bg-background p-6 text-foreground">
          <MagicLink />
        </main>
      )}
    </AuthProvider>
  )
}

const meta = {
  title: "Zaidan/Plugins/Magic Link",
  component: MagicLinkStory,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof MagicLinkStory>

export default meta

type Story = StoryObj<typeof meta>

export const Preview: Story = {}
