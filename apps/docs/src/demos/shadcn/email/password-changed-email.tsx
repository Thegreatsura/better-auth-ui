import { PasswordChangedEmail } from "@better-auth-ui/react"
import { render } from "@react-email/render"

const html = await render(
  <PasswordChangedEmail
    email="user@example.com"
    timestamp="January 15, 2024 at 3:30 PM"
    appName="Better Auth UI"
    logoURL={{
      light: "/favicon-96x96.png",
      dark: "/favicon-96x96-inverted.png"
    }}
    supportEmail="support@example.com"
    secureAccountURL="https://better-auth-ui.com/secure-account"
    darkMode={true}
    poweredBy={true}
  />
)

export function PasswordChangedEmailDemo() {
  return (
    <iframe
      title="Password Changed Email Preview"
      srcDoc={html}
      className="h-[720px] w-full rounded-xl border-0 bg-background"
    />
  )
}
