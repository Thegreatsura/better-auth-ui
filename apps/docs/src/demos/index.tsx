import type { ComponentType } from "react"

import { UserButtonDemo as HeroUIUserButtonDemo } from "./heroui/user/user-button"
import { UserButtonDemo as ShadcnUserButtonDemo } from "./shadcn/user/user-button"

export interface DemoItem {
  component: ComponentType
}

// Registry mapping demo names to their components
export const demos: Record<string, ComponentType> = {
  // Accordion demos
  "heroui-user-button": HeroUIUserButtonDemo,
  "shadcn-user-button": ShadcnUserButtonDemo
}
