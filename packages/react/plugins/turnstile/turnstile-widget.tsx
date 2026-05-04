import { Turnstile } from "@marsidev/react-turnstile"
import { useCallback, useEffect } from "react"
import { useFetchOptions } from "../../../src/components/auth/fetch-options-provider"
import { useAuthPlugin } from "../../../src/hooks/use-auth-plugin"
import { turnstilePlugin } from "./turnstile-plugin"

export function TurnstileWidget() {
  const plugin = useAuthPlugin(turnstilePlugin)
  const { setFetchOptions } = useFetchOptions()

  const handleSuccess = useCallback(
    (token: string) => {
      setFetchOptions({ headers: { "x-captcha-response": token } })
    },
    [setFetchOptions]
  )

  const handleClear = useCallback(() => {
    setFetchOptions(undefined)
  }, [setFetchOptions])

  useEffect(() => {
    return () => setFetchOptions(undefined)
  }, [setFetchOptions])

  return (
    <Turnstile
      siteKey={plugin.siteKey}
      onSuccess={handleSuccess}
      onError={handleClear}
      onExpire={handleClear}
      options={{ size: "normal" }}
    />
  )
}
