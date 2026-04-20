import type { createAuthClient } from "better-auth/react"

export type AuthClient = ReturnType<typeof createAuthClient>

type ResolvePath<
  T,
  Path extends string
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? ResolvePath<T[Key], Rest>
    : never
  : Path extends keyof T
    ? T[Path]
    : never

export type InferData<TAuthClient extends AuthClient, Path extends string> =
  ResolvePath<TAuthClient, Path> extends (
    ...args: infer _Args
  ) => Promise<infer TResult extends { data: unknown }>
    ? TResult["data"]
    : never
