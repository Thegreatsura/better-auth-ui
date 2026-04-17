import { OtpEmail } from "@better-auth-ui/react"
import { render } from "@react-email/render"

const html = await render(
  <OtpEmail
    verificationCode="123456"
    email="user@example.com"
    appName="Better Auth UI"
    logoURL={{
      light: "/favicon-96x96.png",
      dark: "/favicon-96x96-inverted.png"
    }}
    expirationMinutes={10}
    darkMode={true}
    poweredBy={true}
  />
)

export function OtpEmailDemo() {
  return (
    <iframe
      title="OTP Email Preview"
      srcDoc={html}
      className="h-[620px] w-full rounded-xl border-0 bg-background"
    />
  )
}
