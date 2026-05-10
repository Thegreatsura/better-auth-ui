export type SolidRegistryFile = {
  path: `src/${string}`
  type: "registry:component" | "registry:lib" | "registry:file"
}

export type SolidRegistryItem = {
  name: string
  type: "registry:component" | "registry:lib"
  title: string
  description: string
  dependencies: string[]
  registryDependencies: string[]
  files: SolidRegistryFile[]
}

export type SolidRegistryManifest = {
  name: string
  namespace: "solid"
  homepage: string
  items: SolidRegistryItem[]
}

const solidDependencies = [
  "@better-auth-ui/solid@latest",
  "@better-auth-ui/core@latest",
  "@tanstack/solid-query",
  "better-auth",
  "solid-js"
]

export const solidRegistryManifest = {
  name: "better-auth-ui-solid",
  namespace: "solid",
  homepage: "https://better-auth-ui.com",
  items: [
    {
      name: "auth-provider",
      type: "registry:component",
      title: "Solid Auth Provider",
      description:
        "Solid provider wrapper for Better Auth UI using Solid Query and the Solid package surface.",
      dependencies: solidDependencies,
      registryDependencies: [],
      files: [
        {
          path: "src/components/auth/auth-provider.tsx",
          type: "registry:component"
        }
      ]
    },
    {
      name: "forgot-password",
      type: "registry:component",
      title: "Solid Forgot Password",
      description:
        "Minimal Solid forgot-password component using the Solid password reset mutation options.",
      dependencies: solidDependencies,
      registryDependencies: ["solid/auth-provider"],
      files: [
        {
          path: "src/components/auth/forgot-password.tsx",
          type: "registry:component"
        }
      ]
    },
    {
      name: "reset-password",
      type: "registry:component",
      title: "Solid Reset Password",
      description:
        "Minimal Solid reset-password component using the Solid password reset mutation options.",
      dependencies: solidDependencies,
      registryDependencies: ["solid/auth-provider"],
      files: [
        {
          path: "src/components/auth/reset-password.tsx",
          type: "registry:component"
        }
      ]
    },
    {
      name: "sign-up",
      type: "registry:component",
      title: "Solid Sign Up",
      description:
        "Minimal Solid sign-up component using the Solid email sign-up mutation options.",
      dependencies: solidDependencies,
      registryDependencies: ["solid/auth-provider"],
      files: [
        {
          path: "src/components/auth/sign-up.tsx",
          type: "registry:component"
        }
      ]
    },
    {
      name: "sign-in",
      type: "registry:component",
      title: "Solid Sign In",
      description:
        "Minimal Solid sign-in component wired to the Solid Better Auth UI provider.",
      dependencies: solidDependencies,
      registryDependencies: ["solid/auth-provider"],
      files: [
        {
          path: "src/components/auth/sign-in.tsx",
          type: "registry:component"
        }
      ]
    },
    {
      name: "sign-out",
      type: "registry:component",
      title: "Solid Sign Out",
      description:
        "Minimal Solid sign-out component that ends the session and returns to sign in.",
      dependencies: solidDependencies,
      registryDependencies: ["solid/auth-provider"],
      files: [
        {
          path: "src/components/auth/sign-out.tsx",
          type: "registry:component"
        }
      ]
    }
  ]
} satisfies SolidRegistryManifest
