import { MagicLinkEmail } from "@better-auth-ui/react"
import { render } from "@react-email/render"

const html = await render(
  <MagicLinkEmail
    url="https://better-auth-ui.com/auth/verify?token=example-token"
    appName="Better Auth UI"
    logoURL={{
      light: "/favicon-96x96.png",
      dark: "/favicon-96x96-inverted.png"
    }}
    email="user@example.com"
    expirationMinutes={5}
    darkMode={true}
    poweredBy={true}
  />
)

export function MagicLinkEmailDemo() {
  return (
    <iframe
      title="Magic Link Email Preview"
      srcDoc={html}
      className="h-[600px] w-full rounded-xl border-0 bg-background"
    />
  )
}
