"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"
import { getQueryClient } from "@/lib/query-client"
import { AuthProvider } from "./auth/auth-provider"
import { Toaster } from "./ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        appearance={{ theme, setTheme }}
        deleteUser={{ enabled: true }}
        multiSession
        redirectTo="/settings/account"
        socialProviders={["google", "github"]}
        navigate={({ to, replace }) =>
          replace ? router.replace(to) : router.push(to)
        }
        Link={Link}
      >
        {children}

        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
