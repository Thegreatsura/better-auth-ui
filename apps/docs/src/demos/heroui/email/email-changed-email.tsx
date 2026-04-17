import { EmailChangedEmail } from "@better-auth-ui/heroui"
import { render } from "@react-email/render"

const html = await render(
  <EmailChangedEmail
    oldEmail="old@example.com"
    newEmail="new@example.com"
    appName="Better Auth UI"
    logoURL={{
      light: "/favicon-96x96.png",
      dark: "/favicon-96x96-inverted.png"
    }}
    supportEmail="support@example.com"
    revertURL="https://better-auth-ui.com/revert-email"
    darkMode={true}
    poweredBy={true}
  />
)

export function EmailChangedEmailDemo() {
  return (
    <iframe
      title="Email Changed Email Preview"
      srcDoc={html}
      className="h-[740px] w-full rounded-xl border-0 bg-background"
    />
  )
}
