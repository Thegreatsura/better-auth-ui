"use client"

import {
  ThemePreviewDark,
  ThemePreviewLight,
  ThemePreviewSystem,
  useAuth,
  useSession
} from "@better-auth-ui/react"
import { Monitor, Moon, Sun } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

export type AppearanceProps = {
  className?: string
}

/**
 * Renders a theme selector card with visual theme previews.
 *
 * Displays a card containing radio buttons for selecting between system, light,
 * and dark themes. Each option shows a visual preview of the theme. Only renders
 * if theme settings are configured (theme, setTheme, and themes are provided).
 *
 * @param className - Optional additional CSS class names for the card container.
 * @returns A JSX element containing the theme selector card, or null if theme settings are not configured.
 */
export function Appearance({ className }: AppearanceProps) {
  const {
    localization,
    settings: {
      appearance: { theme, setTheme, themes }
    }
  } = useAuth()
  const { data: sessionData } = useSession()

  if (!setTheme || !themes?.length) {
    return null
  }

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        {localization.settings.appearance}
      </h2>

      <Card className={cn(className)}>
        <CardContent>
          <Label className="mb-3">{localization.settings.theme}</Label>

          <RadioGroup
            value={sessionData ? theme : ""}
            onValueChange={setTheme}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            disabled={!sessionData || !theme}
          >
            {themes.includes("system") && (
              <FieldLabel htmlFor="system">
                <Field orientation="horizontal">
                  <FieldContent className="gap-2">
                    <div className="flex items-center gap-2 justify-between">
                      <FieldTitle>
                        <Monitor className="size-4 text-muted-foreground" />

                        {localization.settings.system}
                      </FieldTitle>

                      <RadioGroupItem value="system" id="system" />
                    </div>

                    <ThemePreviewSystem className="w-full" />
                  </FieldContent>
                </Field>
              </FieldLabel>
            )}

            {themes.includes("light") && (
              <FieldLabel htmlFor="light">
                <Field orientation="horizontal">
                  <FieldContent className="gap-2">
                    <div className="flex items-center gap-2 justify-between">
                      <FieldTitle>
                        <Sun className="size-4 text-muted-foreground" />

                        {localization.settings.light}
                      </FieldTitle>

                      <RadioGroupItem value="light" id="light" />
                    </div>

                    <ThemePreviewLight className="w-full" />
                  </FieldContent>
                </Field>
              </FieldLabel>
            )}

            {themes.includes("dark") && (
              <FieldLabel htmlFor="dark">
                <Field orientation="horizontal">
                  <FieldContent className="gap-3">
                    <div className="flex items-center gap-2 justify-between">
                      <FieldTitle>
                        <Moon className="size-4 text-muted-foreground" />

                        {localization.settings.dark}
                      </FieldTitle>

                      <RadioGroupItem value="dark" id="dark" />
                    </div>

                    <ThemePreviewDark className="w-full" />
                  </FieldContent>
                </Field>
              </FieldLabel>
            )}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}
