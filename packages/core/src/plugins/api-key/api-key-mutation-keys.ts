/**
 * Mutation keys contributed by the API key plugin.
 */
export const apiKeyMutationKeys = {
  /** Key for `apiKey.create`. */
  createApiKey: ["auth", "apiKey", "create"] as const,
  /** Key for `apiKey.delete`. */
  deleteApiKey: ["auth", "apiKey", "delete"] as const
} as const
