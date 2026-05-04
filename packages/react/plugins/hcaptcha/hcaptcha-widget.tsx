import HCaptcha from "@hcaptcha/react-hcaptcha"
import { useCallback, useEffect } from "react"
import { useFetchOptions } from "../../../src/components/auth/fetch-options-provider"
import { useAuthPlugin } from "../../../src/hooks/use-auth-plugin"
import { hcaptchaPlugin } from "./hcaptcha-plugin"

export function HCaptchaWidget() {
  const plugin = useAuthPlugin(hcaptchaPlugin)
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
    <HCaptcha
      sitekey={plugin.siteKey}
      onVerify={handleVerify}
      onExpire={handleClear}
      onError={handleClear}
    />
  )
}
