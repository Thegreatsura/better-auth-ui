import { createAuthPlugin } from "@better-auth-ui/core"
import {
  usernamePlugin as coreUsernamePlugin,
  type UsernamePluginOptions
} from "@better-auth-ui/core/plugins"

import { SignInUsername } from "../../components/auth/username/sign-in-username"

export const usernamePlugin = createAuthPlugin(
  coreUsernamePlugin.id,
  (options: UsernamePluginOptions = {}) => {
    return {
      ...coreUsernamePlugin(options),
      views: {
        auth: { signInUsername: SignInUsername }
      }
    }
  }
)
