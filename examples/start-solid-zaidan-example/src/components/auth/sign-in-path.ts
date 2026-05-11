const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SignInPathInput = {
  identifier: string
  usernameAuth: boolean
}

export type SignInPath =
  | { kind: "email"; email: string }
  | { kind: "username"; username: string }

export type SubmittedSignInInput = {
  formData: FormData
  usernameAuth: boolean
}

export type SubmittedSignIn = {
  password: string
  signInPath: SignInPath
}

const getFormValue = (formData: FormData, name: string) => {
  const value = formData.get(name)

  return typeof value === "string" ? value : ""
}

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

export function resolveSubmittedSignIn({
  formData,
  usernameAuth
}: SubmittedSignInInput): SubmittedSignIn {
  const identifier = usernameAuth
    ? getFormValue(formData, "username")
    : getFormValue(formData, "email")

  return {
    password: getFormValue(formData, "password"),
    signInPath: resolveSignInPath({ identifier, usernameAuth })
  }
}
