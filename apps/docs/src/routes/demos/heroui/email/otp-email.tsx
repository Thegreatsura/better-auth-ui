import { OtpEmail } from "@better-auth-ui/heroui"
import { render } from "@react-email/render"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/demos/heroui/email/otp-email")({
  component: RouteComponent
})

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

function RouteComponent() {
  return (
    <iframe
      title="OTP Email Preview"
      srcDoc={html}
      className="grow w-full border-0"
    />
  )
}
