import { CaptchaFox } from "@captchafox/react"
import { useCallback, useEffect } from "react"
import { useFetchOptions } from "../../components/auth/fetch-options-provider"
import { useAuthPlugin } from "../../hooks/use-auth-plugin"
import { captchafoxPlugin } from "./captchafox-plugin"

export function CaptchaFoxWidget() {
  const plugin = useAuthPlugin(captchafoxPlugin)
  const { setFetchOptions } = useFetchOptions()

  const handleVerify = useCallback(
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
    <CaptchaFox
      sitekey={plugin.siteKey}
      onVerify={handleVerify}
      onExpire={handleClear}
      onError={handleClear}
    />
  )
}
