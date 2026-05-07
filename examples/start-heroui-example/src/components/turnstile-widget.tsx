import type { CaptchaRenderProps } from "@better-auth-ui/react/plugins"
import { Turnstile } from "@marsidev/react-turnstile"

export function TurnstileWidget({ setToken, clearToken }: CaptchaRenderProps) {
  return (
    <Turnstile
      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
      onSuccess={setToken}
      onError={clearToken}
      onExpire={clearToken}
      options={{ size: "flexible" }}
    />
  )
}
