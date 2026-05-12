/**
 * Mutation keys contributed by the API key plugin.
 */
export const apiKeyMutationKeys = {
  /** Key for `apiKey.create`. */
  create: ["auth", "apiKey", "create"] as const,
  /** Key for `apiKey.delete`. */
  delete: ["auth", "apiKey", "delete"] as const
} as const
