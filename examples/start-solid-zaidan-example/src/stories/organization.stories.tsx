import { authQueryKeys } from "@better-auth-ui/core"
import { organizationQueryKeys } from "@better-auth-ui/core/plugins"
import type { OrganizationAuthClient } from "@better-auth-ui/solid"
import { QueryClient } from "@tanstack/solid-query"
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useNavigate
} from "@tanstack/solid-router"
import type { Organization } from "better-auth/client"
import type { JSX } from "solid-js"
import type { Meta, StoryObj } from "storybook-solidjs-vite"
import { AuthProvider } from "@/components/auth/auth-provider"
import { OrganizationSwitcher } from "@/components/auth/organization/organization-switcher"
import { OrganizationsSettings } from "@/components/auth/organization/organizations-settings"
import { organizationPlugin } from "@/lib/auth/organization-plugin"

const userId = "user_organization_docs"

const sessionData = {
  session: {
    createdAt: new Date("2026-01-12T10:30:00Z"),
    expiresAt: new Date("2026-01-12T11:30:00Z"),
    id: "session_organization_docs",
    token: "",
    updatedAt: new Date("2026-01-12T10:30:00Z"),
    userId
  },
  user: {
    email: "ada@example.com",
    emailVerified: true,
    id: userId,
    image: null,
    name: "Ada Lovelace"
  }
}

const organizations = [
  {
    createdAt: new Date("2026-01-01T09:00:00Z"),
    id: "org_acme_docs",
    logo: null,
    metadata: null,
    name: "Acme Labs",
    slug: "acme"
  },
  {
    createdAt: new Date("2026-01-02T09:00:00Z"),
    id: "org_northwind_docs",
    logo: null,
    metadata: null,
    name: "Northwind Traders",
    slug: "northwind"
  }
] satisfies Organization[]

const userInvitations = [
  {
    createdAt: new Date("2026-01-08T14:15:00Z"),
    id: "invitation_docs_billing",
    organizationName: "Billing Guild",
    role: "admin"
  }
]

const mockAuthClient = {
  getSession: async () => sessionData,
  organization: {
    acceptInvitation: async () => null,
    create: async () => organizations[0],
    getFullOrganization: async () => organizations[0],
    list: async () => organizations,
    listUserInvitations: async () => userInvitations,
    rejectInvitation: async () => null,
    setActive: async () => null
  }
} as unknown as OrganizationAuthClient

function createStoryQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Number.POSITIVE_INFINITY
      }
    }
  })

  queryClient.setQueryData(authQueryKeys.session, sessionData)
  queryClient.setQueryData(organizationQueryKeys.list(userId), organizations)
  queryClient.setQueryData(
    organizationQueryKeys.activeOrganization(userId, {
      organizationSlug: "acme"
    }),
    organizations[0]
  )
  queryClient.setQueryData(
    organizationQueryKeys.userInvitations.list(userId),
    userInvitations
  )

  return queryClient
}

type OrganizationStoryProviderProps = {
  children: JSX.Element
  queryClient: QueryClient
  slug?: string | null
}

function OrganizationStoryProvider(props: OrganizationStoryProviderProps) {
  const navigate = useNavigate()

  return (
    <AuthProvider
      authClient={mockAuthClient}
      navigate={navigate}
      plugins={[organizationPlugin({ slug: props.slug })]}
      queryClient={props.queryClient}
    >
      {props.children}
    </AuthProvider>
  )
}

function createStoryRouter(component: () => JSX.Element) {
  const rootRoute = createRootRoute({ component })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component
  })

  return createRouter({
    history: createMemoryHistory({ initialEntries: ["/"] }),
    routeTree: rootRoute.addChildren([indexRoute])
  })
}

function OrganizationSwitcherPreviewContent() {
  const queryClient = createStoryQueryClient()

  return (
    <OrganizationStoryProvider queryClient={queryClient} slug="acme">
      <main class="mx-auto flex min-h-[360px] w-full max-w-xl items-center justify-center bg-background p-6 text-foreground">
        <OrganizationSwitcher hideCreate hideSlug={false} />
      </main>
    </OrganizationStoryProvider>
  )
}

function OrganizationsSettingsPreviewContent() {
  const queryClient = createStoryQueryClient()

  return (
    <OrganizationStoryProvider queryClient={queryClient} slug={null}>
      <main class="mx-auto min-h-[520px] w-full max-w-2xl bg-background p-6 text-foreground">
        <OrganizationsSettings />
      </main>
    </OrganizationStoryProvider>
  )
}

const meta = {
  title: "Zaidan/Plugins/Organization",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const OrganizationSwitcherPreview: Story = {
  render: () => (
    <RouterProvider
      router={createStoryRouter(OrganizationSwitcherPreviewContent)}
    />
  )
}

export const OrganizationsSettingsPreview: Story = {
  render: () => (
    <RouterProvider
      router={createStoryRouter(OrganizationsSettingsPreviewContent)}
    />
  )
}
