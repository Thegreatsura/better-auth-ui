import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const docsRoot = join(import.meta.dirname, "../content/docs")
const sourceFile = join(import.meta.dirname, "../src/lib/source.tsx")

function readDocsFile(...segments: string[]) {
  return readFileSync(join(docsRoot, ...segments), "utf8")
}

function listFilesRecursive(root: string, prefix = ""): string[] {
  const current = join(root, prefix)

  return readdirSync(current).flatMap((entry) => {
    const rel = join(prefix, entry)
    const abs = join(root, rel)

    return statSync(abs).isDirectory() ? listFilesRecursive(root, rel) : [rel]
  })
}

describe("Solid docs navigation", () => {
  it("adds Solid as a root docs section with the expected page order", () => {
    const docsIndex = readDocsFile("index.mdx")
    const rootMeta = JSON.parse(readDocsFile("meta.json")) as {
      pages: string[]
    }

    expect(rootMeta.pages).toContain("solid")
    expect(rootMeta.pages).toContain("zaidan")
    expect(docsIndex).toContain("/docs/zaidan")
    expect(docsIndex).toContain("Zaidan Solid")
    expect(docsIndex).toContain("Copied Solid components for TanStack Start")

    const solidMeta = JSON.parse(readDocsFile("solid", "meta.json")) as {
      title: string
      icon: string
      root: boolean
      pages: string[]
    }

    expect(solidMeta).toMatchObject({
      title: "Solid",
      icon: "Solid",
      root: true,
      pages: ["index", "queries", "mutations", "ssr"]
    })

    const solidQueriesMeta = JSON.parse(
      readDocsFile("solid", "queries", "meta.json")
    ) as { pages: string[]; title: string }
    const solidMutationsMeta = JSON.parse(
      readDocsFile("solid", "mutations", "meta.json")
    ) as { pages: string[]; title: string }

    expect(solidQueriesMeta).toMatchObject({
      title: "Queries",
      pages: [
        "index",
        "---Auth---",
        "session",
        "user",
        "authenticate",
        "---Settings---",
        "list-accounts",
        "account-info",
        "list-sessions",
        "list-device-sessions",
        "list-passkeys",
        "list-api-keys",
        "---Organization---",
        "active-organization",
        "full-organization",
        "list-organizations",
        "list-members",
        "list-invitations",
        "list-user-invitations",
        "has-permission"
      ]
    })
    expect(solidMutationsMeta).toMatchObject({
      title: "Mutations",
      pages: [
        "index",
        "---Auth---",
        "sign-in-email",
        "sign-in-username",
        "sign-in-magic-link",
        "sign-in-passkey",
        "sign-in-social",
        "sign-up-email",
        "sign-out",
        "request-password-reset",
        "reset-password",
        "send-verification-email",
        "is-username-available",
        "---Settings---",
        "update-user",
        "change-email",
        "change-password",
        "delete-user",
        "link-social",
        "unlink-account",
        "add-passkey",
        "delete-passkey",
        "revoke-session",
        "revoke-multi-session",
        "set-active-session",
        "create-api-key",
        "delete-api-key",
        "---Organization---",
        "create-organization",
        "update-organization",
        "delete-organization",
        "set-active-organization",
        "invite-member",
        "remove-member",
        "update-member-role",
        "leave-organization",
        "accept-invitation",
        "cancel-invitation",
        "reject-invitation",
        "check-organization-slug"
      ]
    })
  })

  it("documents only the Solid runtime/package track", () => {
    const expectedPages = [
      "index.mdx",
      "mutations/accept-invitation.mdx",
      "mutations/add-passkey.mdx",
      "mutations/cancel-invitation.mdx",
      "mutations/change-email.mdx",
      "mutations/change-password.mdx",
      "mutations/check-organization-slug.mdx",
      "mutations/create-api-key.mdx",
      "mutations/create-organization.mdx",
      "mutations/delete-api-key.mdx",
      "mutations/delete-organization.mdx",
      "mutations/delete-passkey.mdx",
      "mutations/delete-user.mdx",
      "mutations/index.mdx",
      "mutations/invite-member.mdx",
      "mutations/is-username-available.mdx",
      "mutations/leave-organization.mdx",
      "mutations/link-social.mdx",
      "mutations/reject-invitation.mdx",
      "mutations/remove-member.mdx",
      "mutations/request-password-reset.mdx",
      "mutations/reset-password.mdx",
      "mutations/revoke-multi-session.mdx",
      "mutations/revoke-session.mdx",
      "mutations/send-verification-email.mdx",
      "mutations/set-active-organization.mdx",
      "mutations/set-active-session.mdx",
      "mutations/sign-in-email.mdx",
      "mutations/sign-in-magic-link.mdx",
      "mutations/sign-in-passkey.mdx",
      "mutations/sign-in-social.mdx",
      "mutations/sign-in-username.mdx",
      "mutations/sign-out.mdx",
      "mutations/sign-up-email.mdx",
      "mutations/unlink-account.mdx",
      "mutations/update-member-role.mdx",
      "mutations/update-organization.mdx",
      "mutations/update-user.mdx",
      "queries/account-info.mdx",
      "queries/active-organization.mdx",
      "queries/authenticate.mdx",
      "queries/full-organization.mdx",
      "queries/has-permission.mdx",
      "queries/index.mdx",
      "queries/list-accounts.mdx",
      "queries/list-api-keys.mdx",
      "queries/list-device-sessions.mdx",
      "queries/list-invitations.mdx",
      "queries/list-members.mdx",
      "queries/list-organizations.mdx",
      "queries/list-passkeys.mdx",
      "queries/list-sessions.mdx",
      "queries/list-user-invitations.mdx",
      "queries/session.mdx",
      "queries/user.mdx",
      "ssr.mdx"
    ]

    const actualPages = listFilesRecursive(join(docsRoot, "solid"))
      .filter((page) => page.endsWith(".mdx"))
      .sort()

    expect(actualPages).toEqual([...expectedPages].sort())

    const index = readDocsFile("solid", "index.mdx")
    const ssr = readDocsFile("solid", "ssr.mdx")

    expect(index).toContain("@better-auth-ui/solid")
    expect(index).toContain("/docs/zaidan/integrations/tanstack-start")
    expect(index).not.toContain("/docs/solid/integrations")
    expect(index).not.toContain("Solid Start")
    expect(ssr).toContain("@better-auth-ui/solid/server")
    expect(ssr).toContain("does not create routes")
  })

  it("surfaces explicit non-goals without coupling Solid docs to React runtime execution", () => {
    const index = readDocsFile("solid", "index.mdx")
    const mutations = readDocsFile("solid", "mutations", "index.mdx")
    const source = readFileSync(sourceFile, "utf8")

    expect(index).toContain("React email templates")
    expect(index).toContain("HeroUI React components")
    expect(mutations).toContain("The Solid package does not render toast UI")
    expect(mutations).toContain("installed Zaidan components")
    expect(source).toContain("Solid")
    expect(source).not.toContain("/r/solid")
  })
})
