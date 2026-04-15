import { ResetPasswordEmail } from "@better-auth-ui/heroui"
import { render } from "@react-email/render"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/demos/heroui/email/reset-password-email"
)({
  component: RouteComponent
})

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

function RouteComponent() {
  return (
    <iframe
      title="Reset Password Email Preview"
      srcDoc={html}
      className="grow w-full border-0"
    />
  )
}
