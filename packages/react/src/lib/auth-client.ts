import { passkeyClient } from "@better-auth/passkey/client"
import {
  magicLinkClient,
  multiSessionClient,
  usernameClient
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export type AuthClient = ReturnType<typeof createAuthClient>

// The per-plugin clients below are never used at runtime — they exist solely
// so TypeScript can infer the fully-typed client shape for each plugin via
// `typeof`. Marking them `/* @__PURE__ */` lets bundlers drop the calls in
// downstream builds.

const magicLinkAuthClient = /* @__PURE__ */ createAuthClient({
  plugins: [magicLinkClient()]
})
export type MagicLinkAuthClient = typeof magicLinkAuthClient

const multiSessionAuthClient = /* @__PURE__ */ createAuthClient({
  plugins: [multiSessionClient()]
})
export type MultiSessionAuthClient = typeof multiSessionAuthClient

const passkeyAuthClient = /* @__PURE__ */ createAuthClient({
  plugins: [passkeyClient()]
})
export type PasskeyAuthClient = typeof passkeyAuthClient

const usernameAuthClient = /* @__PURE__ */ createAuthClient({
  plugins: [usernameClient()]
})
export type UsernameAuthClient = typeof usernameAuthClient

/**
 * Unwraps a Better Auth client method's `data` payload.
 *
 * Pass the method type directly, e.g. `TAuthClient["getSession"]` or
 * `TAuthClient["passkey"]["listUserPasskeys"]`. Keeping it method-typed
 * (instead of a path-string utility) preserves IntelliSense on the derived
 * types.
 */
export type InferData<TMethod> = TMethod extends (
  ...args: infer _Args
) => Promise<infer TResult extends { data: unknown }>
  ? TResult["data"]
  : never
