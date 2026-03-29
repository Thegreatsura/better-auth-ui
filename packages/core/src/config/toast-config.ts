/**
 * Function signature for rendering a toast notification.
 *
 * @param message - The message to display in the toast.
 * @param options - Optional configuration for the toast.
 * @param options.action - Action button displayed within the toast.
 * @param options.action.label - Label text for the action button.
 * @param options.action.onClick - Callback invoked when the action button is clicked.
 * @param options.actionProps - Alternative action props (used by some toast libraries).
 * @param options.actionProps.children - Label text for the action button.
 * @param options.actionProps.onClick - Callback invoked when the action button is clicked.
 * @returns A toast identifier (type varies by toast library), or void.
 */
export type RenderToast = (
  message?: string,
  options?: {
    action?: { label: string; onClick: () => Promise<void> | void }
    actionProps?: { children: string; onClick: () => Promise<void> | void }
  }
) => string | number | unknown

/**
 * Function signature for dismissing a toast notification by its ID.
 *
 * @param id - The identifier of the toast to dismiss (returned by {@link RenderToast}).
 * @returns A toast identifier, or void.
 */
export type DismissToast = (
  // biome-ignore lint/suspicious/noExplicitAny: Flexible dismiss for toasts
  id?: number | string | unknown | any
) => string | number | unknown

/**
 * Fallback toast implementation using native browser dialogs.
 *
 * Uses `confirm()` for toasts with an action (invokes the action on confirm)
 * and `alert()` for plain messages.
 */
export const defaultToast: RenderToast = (message, options) => {
  if (options?.action) {
    if (confirm(message)) {
      options.action.onClick()
    }
  } else {
    alert(message)
  }
}

/**
 * Configuration for toast notifications used throughout the UI.
 *
 * Provide your own toast library functions (e.g. sonner, react-hot-toast)
 * to customize how notifications are displayed.
 */
export type ToastConfig = {
  /** Display an error toast notification. */
  error: RenderToast
  /** Display a danger toast notification (e.g. destructive actions). */
  danger?: RenderToast
  /** Display a success toast notification. */
  success: RenderToast
  /** Display an informational toast notification. */
  info: RenderToast
  /**
   * Dismiss a toast notification by its ID.
   * When provided, allows programmatic dismissal of active toasts.
   */
  dismiss?: DismissToast
}
