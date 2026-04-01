"use client"

import { useAuthenticate } from "@better-auth-ui/react"
import Link from "next/link"

import { Spinner } from "@/components/ui/spinner"

export default function Dashboard() {
  const { data: sessionData } = useAuthenticate()

  if (!sessionData) {
    return (
      <div className="flex justify-center my-auto">
        <Spinner color="current" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center my-auto">
      <h1 className="text-2xl">Hello, {sessionData.user.email}</h1>

      <Link href="/auth/sign-out">Sign Out</Link>
    </div>
  )
}
