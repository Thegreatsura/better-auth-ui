/**
 * Configuration for account deletion in the UI (mirrors server `user.deleteUser` flags).
 */
export interface DeleteUserConfig {
  /**
   * Whether the delete user feature is enabled.
   */
  enabled?: boolean
  /**
   * When `true`, matches server `sendDeleteAccountVerification`: deletion starts by sending a
   * verification email instead of deleting immediately in this request.
   */
  sendDeleteAccountVerification?: boolean
}
