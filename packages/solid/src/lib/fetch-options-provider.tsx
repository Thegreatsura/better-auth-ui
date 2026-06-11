import {
  type Accessor,
  createContext,
  createSignal,
  type JSX,
  useContext
} from "solid-js"

/** Subset of Better Auth fetch options used by auth flows. Add fields as use-cases arise. */
export type FetchOptions = {
  headers?: Record<string, string>
  body?: Record<string, unknown>
  credentials?: RequestCredentials
  signal?: AbortSignal
}

export type FetchOptionsContextValue = {
  /** Current fetchOptions, or `undefined` when none are set. */
  fetchOptions: Accessor<FetchOptions | undefined>
  /** Overrides the entire fetchOptions object. Pass `undefined` to clear. */
  setFetchOptions: (fetchOptions: FetchOptions | undefined) => void
  /** Clears fetchOptions and runs the registered reset callback. */
  resetFetchOptions: () => void
  /** Register a reset handler. Used by `captchaPlugin`. Pass `null` to clear. */
  registerReset: (reset: (() => void) | null) => void
}

const FetchOptionsContext = createContext<FetchOptionsContextValue>()

export type FetchOptionsProviderProps = {
  children?: JSX.Element | (() => JSX.Element)
}

const resolveProviderChildren = (
  children: FetchOptionsProviderProps["children"]
) => (typeof children === "function" ? children() : children)

export function FetchOptionsProvider(props: FetchOptionsProviderProps) {
  const [fetchOptions, setFetchOptions] = createSignal<
    FetchOptions | undefined
  >()
  let reset: (() => void) | null = null

  const registerReset = (nextReset: (() => void) | null) => {
    reset = nextReset
  }

  const resetFetchOptions = () => {
    setFetchOptions(undefined)
    reset?.()
  }

  return (
    <FetchOptionsContext.Provider
      value={{
        fetchOptions,
        setFetchOptions,
        resetFetchOptions,
        registerReset
      }}
    >
      {resolveProviderChildren(props.children)}
    </FetchOptionsContext.Provider>
  )
}

export function useFetchOptions(): FetchOptionsContextValue {
  const context = useContext(FetchOptionsContext)

  if (!context) {
    throw new Error(
      "[Better Auth UI] useFetchOptions must be used within FetchOptionsProvider"
    )
  }

  return context
}
