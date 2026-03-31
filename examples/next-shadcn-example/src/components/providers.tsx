"use client"

import { AuthProvider } from "@better-auth-ui/shadcn/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider
        authClient={authClient}
        navigate={({ to, replace }) =>
          replace ? router.replace(to) : router.push(to)
        }
        Link={Link}
      >
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
