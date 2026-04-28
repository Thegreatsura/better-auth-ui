/**
 * Hierarchical mutation key factory for every Better Auth mutation managed by
 * this library.
 *
 * Mutation keys are mostly used for `useIsMutating` and global
 * `MutationCache` observers (e.g. toast handling), so the keys are static
 * tuples rather than parameterised factories. Each grouping exposes an
 * `all` prefix so consumers can match a whole feature at once:
 *
 * ```ts
 * useIsMutating({ mutationKey: authMutationKeys.all })
 * useIsMutating({ mutationKey: authMutationKeys.signIn.all })
 * useIsMutating({ mutationKey: authMutationKeys.signIn.email })
 * ```
 *
 * This factory lives in `@better-auth-ui/core` so it can be shared across
 * framework packages (`@better-auth-ui/react`, a future `/solid` package,
 * etc.) — the mutation cache entries line up regardless of which framework
 * package the mutation options factory came from.
 *
 * For query keys, see `authQueryKeys` in `./auth-query-keys`.
 */
export const authMutationKeys = {
  /** Root key for every Better Auth mutation. */
  all: ["auth"] as const,

  /** Sign-in mutations, grouped by strategy. */
  signIn: {
    /** Prefix matching every sign-in mutation. */
    all: ["auth", "signIn"] as const,
    /** Key for `signIn.email`. */
    email: ["auth", "signIn", "email"] as const,
    /** Key for `signIn.social`. */
    social: ["auth", "signIn", "social"] as const,
    /** Key for `signIn.magicLink`. */
    magicLink: ["auth", "signIn", "magicLink"] as const,
    /** Key for `signIn.passkey`. */
    passkey: ["auth", "signIn", "passkey"] as const,
    /** Key for `signIn.username`. */
    username: ["auth", "signIn", "username"] as const
  },

  /** Sign-up mutations, grouped by strategy. */
  signUp: {
    /** Prefix matching every sign-up mutation. */
    all: ["auth", "signUp"] as const,
    /** Key for `signUp.email`. */
    email: ["auth", "signUp", "email"] as const
  },

  /** Key for `signOut`. */
  signOut: ["auth", "signOut"] as const,

  /** Key for `requestPasswordReset`. */
  requestPasswordReset: ["auth", "requestPasswordReset"] as const,
  /** Key for `resetPassword`. */
  resetPassword: ["auth", "resetPassword"] as const,
  /** Key for `sendVerificationEmail`. */
  sendVerificationEmail: ["auth", "sendVerificationEmail"] as const,

  /** Passkey mutations. */
  passkey: {
    /** Prefix matching every passkey mutation. */
    all: ["auth", "passkey"] as const,
    /** Key for `passkey.addPasskey`. */
    addPasskey: ["auth", "passkey", "addPasskey"] as const,
    /** Key for `passkey.deletePasskey`. */
    deletePasskey: ["auth", "passkey", "deletePasskey"] as const
  },

  /** Multi-session mutations. */
  multiSession: {
    /** Prefix matching every multi-session mutation. */
    all: ["auth", "multiSession"] as const,
    /** Key for `multiSession.revoke`. */
    revoke: ["auth", "multiSession", "revoke"] as const,
    /** Key for `multiSession.setActive`. */
    setActive: ["auth", "multiSession", "setActive"] as const
  },

  /** Key for `changeEmail`. */
  changeEmail: ["auth", "changeEmail"] as const,
  /** Key for `changePassword`. */
  changePassword: ["auth", "changePassword"] as const,
  /** Key for `deleteUser`. */
  deleteUser: ["auth", "deleteUser"] as const,
  /** Key for `linkSocial`. */
  linkSocial: ["auth", "linkSocial"] as const,
  /** Key for `revokeSession`. */
  revokeSession: ["auth", "revokeSession"] as const,
  /** Key for `unlinkAccount`. */
  unlinkAccount: ["auth", "unlinkAccount"] as const,
  /** Key for `updateUser`. */
  updateUser: ["auth", "updateUser"] as const,

  /**
   * Key for `isUsernameAvailable`. This is technically a read, but it's
   * exposed via better-auth's mutation surface and lives under the mutation
   * factories for parity with other username flows.
   */
  isUsernameAvailable: ["auth", "isUsernameAvailable"] as const
} as const
