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
}

export type CaptchaPluginOptions = {
  /**
   * Component that renders the captcha widget. Wire your provider's success
   * callback to `setToken` and its error/expire callbacks to `clearToken`.
   *
   * Mounted as a real component so hooks (e.g. `useTheme`) work inside it.
   * Inline definitions must be PascalCase so React's rules-of-hooks lint
   * recognises them as components.
   *
   * @example Cloudflare Turnstile
   * ```tsx
   * captchaPlugin({
   *   render: ({ setToken, clearToken }) => (
   *     <Turnstile
   *       siteKey={env.TURNSTILE_SITE_KEY}
   *       onSuccess={setToken}
   *       onError={clearToken}
   *       onExpire={clearToken}
   *     />
   *   )
   * })
   * ```
   *
   * @example Inline with hooks (note the PascalCase name)
   * ```tsx
   * captchaPlugin({
   *   render: function HCaptchaWidget({ setToken, clearToken }) {
   *     const { theme } = useTheme()
   *     return <HCaptcha sitekey="..." onVerify={setToken} theme={theme} />
   *   }
   * })
   * ```
   */
  render: ComponentType<CaptchaRenderProps>
}

function CaptchaWidget(): ReactNode {
  const plugin = useAuthPlugin(captchaPlugin)
  const { setFetchOptions } = useFetchOptions()

  const setToken = useCallback(
    (token: string) => {
      setFetchOptions({ headers: { "x-captcha-response": token } })
    },
    [setFetchOptions]
  )

  const clearToken = useCallback(() => {
    setFetchOptions(undefined)
  }, [setFetchOptions])

  useEffect(() => {
    return () => setFetchOptions(undefined)
  }, [setFetchOptions])

  const Render = plugin.render
  return <Render setToken={setToken} clearToken={clearToken} />
}

/**
 * Provider-agnostic captcha plugin.
 *
 * Pass a `render` component that mounts your captcha provider's React
 * widget (Turnstile, hCaptcha, CaptchaFox, reCAPTCHA, etc.). The plugin
 * forwards the resolved token via the `x-captcha-response` header on Better
 * Auth requests, matching `better-auth/plugins` `captcha`.
 */
export const captchaPlugin = createAuthPlugin(
  "captcha",
  ({ render }: CaptchaPluginOptions) => ({
    render,
    captchaComponent: CaptchaWidget
  })
)
