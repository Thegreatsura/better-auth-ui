const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SignInPathInput = {
  identifier: string
  usernameAuth: boolean
}

export type SignInPath =
  | { kind: "email"; email: string }
  | { kind: "username"; username: string }

export function resolveSignInPath({
  identifier,
  usernameAuth
}: SignInPathInput): SignInPath {
  const normalizedIdentifier = identifier.trim()

  if (usernameAuth && !emailPattern.test(normalizedIdentifier)) {
    return { kind: "username", username: normalizedIdentifier }
  }

  return { kind: "email", email: normalizedIdentifier }
}
