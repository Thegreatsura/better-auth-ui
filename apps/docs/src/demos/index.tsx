import type { ComponentType } from "react"
import { UserButtonDemo as HeroUIUserButtonDemo } from "./heroui/user/user-button"
import { UserButtonIconDemo as HeroUIUserButtonIconDemo } from "./heroui/user/user-button-icon"
import { UserButtonDemo as ShadcnUserButtonDemo } from "./shadcn/user/user-button"
import { UserButtonIconDemo as ShadcnUserButtonIconDemo } from "./shadcn/user/user-button-icon"

export interface DemoItem {
  component: ComponentType
}

// Registry mapping demo names to their components
export const demos: Record<string, ComponentType> = {
  // Accordion demos
  "heroui-user-button": HeroUIUserButtonDemo,
  "heroui-user-button-icon": HeroUIUserButtonIconDemo,
  "shadcn-user-button": ShadcnUserButtonDemo,
  "shadcn-user-button-icon": ShadcnUserButtonIconDemo
}
