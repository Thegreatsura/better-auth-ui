"use client"

import type { AuthConfig } from "@better-auth-ui/core"
import { createContext } from "react"

/** Split from `auth-provider` so HMR reloading that file does not replace this context instance. */
export const AuthContext = createContext<AuthConfig | undefined>(undefined)
