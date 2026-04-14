import { createAuthClient } from "better-auth/react"

const DEMO_SESSION_TOKEN = "demo_sess_current"
const DEMO_OTHER_SESSION_TOKEN = "demo_sess_mobile"

const customFetchImpl: typeof fetch = async (input, _init) => {
  const endpoint =
    typeof input === "string"
      ? new URL(input, "http://localhost").pathname
      : input instanceof URL
        ? input.pathname
        : new URL(input.url).pathname

  if (endpoint === "/api/auth/list-accounts") {
    const now = new Date().toISOString()
    return new Response(
      JSON.stringify([
        {
          id: "acc_demo_credential",
          providerId: "credential",
          accountId: "123",
          userId: "123",
          createdAt: now,
          updatedAt: now,
          scopes: []
        },
        {
          id: "acc_demo_github",
          providerId: "github",
          accountId: "12345678",
          userId: "123",
          createdAt: now,
          updatedAt: now,
          scopes: []
        }
      ]),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }

  if (endpoint === "/api/auth/account-info") {
    return new Response(
      JSON.stringify({
        user: {
          id: "demo-github-user",
          name: "daveycodez",
          email: "daveycodez@example.com",
          emailVerified: true,
          image: "/avatars/daveycodez.png"
        },
        data: {
          login: "daveycodez"
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }

  if (endpoint === "/api/auth/get-session") {
    return new Response(
      JSON.stringify({
        session: {
          id: "123",
          userId: "123",
          token: DEMO_SESSION_TOKEN,
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        user: {
          id: "123",
          name: "daveycodez",
          email: "daveycodez@example.com",
          emailVerified: true,
          image: "/avatars/daveycodez.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  }

  if (endpoint === "/api/auth/list-sessions") {
    const now = Date.now()
    return new Response(
      JSON.stringify([
        {
          id: "123",
          userId: "123",
          token: DEMO_SESSION_TOKEN,
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          ipAddress: "203.0.113.10",
          createdAt: new Date(now - 3_600_000).toISOString(),
          updatedAt: new Date(now - 3_600_000).toISOString(),
          expiresAt: new Date(now + 86_400_000).toISOString()
        },
        {
          id: "456",
          userId: "123",
          token: DEMO_OTHER_SESSION_TOKEN,
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1",
          ipAddress: "198.51.100.44",
          createdAt: new Date(now - 86_400_000 * 2).toISOString(),
          updatedAt: new Date(now - 86_400_000 * 2).toISOString(),
          expiresAt: new Date(now + 86_400_000).toISOString()
        }
      ]),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }

  if (endpoint === "/api/auth/revoke-session") {
    return new Response(JSON.stringify({ status: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  }

  if (endpoint === "/api/auth/multi-session/list-device-sessions") {
    return new Response(
      JSON.stringify([
        {
          session: {
            id: "123",
            userId: "123",
            expiresAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          user: {
            id: "123",
            name: "daveycodez",
            email: "daveycodez@example.com",
            emailVerified: true,
            image: "/avatars/daveycodez.png",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        {
          session: {
            id: "456",
            userId: "456",
            expiresAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          user: {
            id: "456",
            name: "John Doe",
            email: "john.doe@example.com",
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      ]),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(JSON.stringify({ message: "Demo" }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  })
}

export const authClient = createAuthClient({
  fetchOptions: {
    customFetchImpl
  }
})
