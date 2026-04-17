import { ResetPasswordEmail } from "@better-auth-ui/react"
import { render } from "@react-email/render"

const html = await render(
  <ResetPasswordEmail
    url="https://better-auth-ui.com/auth/reset-password?token=example-token"
    appName="Better Auth UI"
    logoURL={{
      light: "/favicon-96x96.png",
      dark: "/favicon-96x96-inverted.png"
    }}
    email="user@example.com"
    expirationMinutes={60}
    darkMode={true}
    poweredBy={true}
  />
)

export function ResetPasswordEmailDemo() {
  return (
    <iframe
      title="Reset Password Email Preview"
      srcDoc={html}
      className="h-[620px] w-full rounded-xl border-0 bg-background"
    />
  )
}
