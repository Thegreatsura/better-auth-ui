"use client"

import { createAuthPlugin } from "@better-auth-ui/core"
import {
  type ComponentType,
  type ReactNode,
  useCallback,
  useEffect
} from "react"
import { useFetchOptions } from "../components/auth/fetch-options-provider"
import { useAuthPlugin } from "../hooks/use-auth-plugin"

/** Props passed to the consumer's `render` component. */
export type CaptchaRenderProps = {
  /**
   * Call once the user solves the captcha.
   * Sets the `x-captcha-response` header on subsequent Better Auth requests.
   */
  setToken: (token: string) => void
  /** Call on error/expire/reset to clear the header. */
  clearToken: () => void
  /**
   * Wire your widget's `reset()` here. Each captcha-protected form calls it
   * (via `resetFetchOptions`) on submission failure so the next attempt has a
   * fresh token — captcha tokens are single-use across all supported
   * providers (Turnstile, hCaptcha, CaptchaFox, reCAPTCHA), and Better
   * Auth's captcha middleware consumes the token via `/siteverify` even when
   * the auth handler later fails (e.g. wrong password, email already taken).
   * Without a reset, retries send a spent token and are rejected as
   * `timeout-or-duplicate`.
   *
   * Pass `null` to clear the registration on unmount.
   */
  setReset: (reset: (() => void) | null) => void
}

export type CaptchaPluginOptions = {
  /**
   * Component that renders the captcha widget. Wire your provider's success
   * callback to `setToken`, its error/expire callbacks to `clearToken`, and
   * its `reset()` to `setReset` so failed retries get a fresh token.
   *
   * Mounted as a real component so hooks (e.g. `useTheme`) work inside it.
   * Inline definitions must be PascalCase so React's rules-of-hooks lint
   * recognises them as components.
   *
   * @example Cloudflare Turnstile
   * ```tsx
   * captchaPlugin({
   *   render: function TurnstileWidget({ setToken, clearToken, setReset }) {
   *     const ref = useRef<TurnstileInstance>(null)
   *     useEffect(() => {
   *       setReset(() => ref.current?.reset())
   *       return () => setReset(null)
   *     }, [setReset])
   *     return (
   *       <Turnstile
   *         ref={ref}
   *         siteKey={env.TURNSTILE_SITE_KEY}
   *         onSuccess={setToken}
   *         onError={clearToken}
   *         onExpire={clearToken}
   *       />
   *     )
   *   }
   * })
   * ```
   */
  render: ComponentType<CaptchaRenderProps>
}

function CaptchaWidget(): ReactNode {
  const { render: Render } = useAuthPlugin(captchaPlugin)
  const { setFetchOptions, registerReset } = useFetchOptions()

  const setToken = useCallback(
    (token: string) => {
      setFetchOptions({ headers: { "x-captcha-response": token } })
    },
    [setFetchOptions]
  )

  const clearToken = useCallback(() => {
    setFetchOptions(undefined)
  }, [setFetchOptions])

  // Forward the consumer's reset handler into FetchOptionsProvider so any
  // form (sign-in, sign-up, forgot-password) can refresh the widget by
  // calling `resetFetchOptions()` from its `onError`.
  const setReset = useCallback(
    (reset: (() => void) | null) => {
      registerReset(reset)
    },
    [registerReset]
  )

  useEffect(() => {
    return () => {
      setFetchOptions(undefined)
      registerReset(null)
    }
  }, [setFetchOptions, registerReset])

  return (
    <Render setToken={setToken} clearToken={clearToken} setReset={setReset} />
  )
}

/**
 * Provider-agnostic captcha plugin.
 *
 * Pass a `render` component that mounts your captcha provider's React
 * widget (Turnstile, hCaptcha, CaptchaFox, reCAPTCHA, etc.). The plugin
 * forwards the resolved token via the `x-captcha-response` header on Better
 * Auth requests, matching `better-auth/plugins` `captcha`.
 *
 * Each captcha-protected form (sign-in, sign-up, forgot-password) calls
 * `resetFetchOptions()` from `useFetchOptions` after a failed submission,
 * which clears the spent token and triggers the widget's `reset()` so the
 * next attempt has a fresh token — captcha tokens are single-use.
 *
 * Note: the Better Auth `captcha` plugin protects `/sign-up/email`,
 * `/sign-in/email`, and `/request-password-reset` by default. To also cover
 * `/sign-in/username`, include it in the plugin's `endpoints` option on the
 * server.
 */
export const captchaPlugin = createAuthPlugin(
  "captcha",
  ({ render }: CaptchaPluginOptions) => ({
    render,
    captchaComponent: CaptchaWidget
  })
)
