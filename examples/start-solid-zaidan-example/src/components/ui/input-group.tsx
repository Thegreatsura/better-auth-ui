import { cva, type VariantProps } from "class-variance-authority"
import { type ComponentProps, splitProps } from "solid-js"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type InputGroupProps = ComponentProps<"fieldset">

const InputGroup = (props: InputGroupProps) => {
  const [local, others] = splitProps(props, ["class"])

  return (
    <fieldset
      class={cn(
        "group/input-group z-input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input outline-none transition-colors has-disabled:bg-input/50 has-disabled:opacity-50 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80",
        local.class
      )}
      data-slot="input-group"
      {...others}
    />
  )
}

const inputGroupAddonVariants = cva(
  "z-input-group-addon flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 font-medium text-muted-foreground text-sm group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-2",
        "inline-end": "order-last pr-2",
        "block-start": "order-first w-full justify-start px-2.5 pt-2",
        "block-end": "order-last w-full justify-start px-2.5 pb-2"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
)

type InputGroupAddonProps = ComponentProps<"fieldset"> &
  VariantProps<typeof inputGroupAddonVariants>

const InputGroupAddon = (props: InputGroupAddonProps) => {
  const [local, others] = splitProps(props, ["class", "align"])
  const align = () => local.align ?? "inline-start"

  return (
    <fieldset
      class={cn(inputGroupAddonVariants({ align: align() }), local.class)}
      data-align={align()}
      data-slot="input-group-addon"
      {...others}
    />
  )
}

const inputGroupButtonVariants = cva("flex items-center gap-2 text-sm", {
  variants: {
    size: {
      xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
      sm: "",
      "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
      "icon-sm": "size-8 p-0 has-[>svg]:p-0"
    }
  },
  defaultVariants: {
    size: "xs"
  }
})

type InputGroupButtonProps = Omit<ButtonProps, "size"> &
  VariantProps<typeof inputGroupButtonVariants>

const InputGroupButton = (props: InputGroupButtonProps) => {
  const [local, others] = splitProps(props, ["class", "size", "type"])
  const size = () => local.size ?? "xs"

  return (
    <Button
      class={cn(inputGroupButtonVariants({ size: size() }), local.class)}
      data-size={size()}
      size={size() === "sm" ? "sm" : "xs"}
      type={local.type ?? "button"}
      variant="ghost"
      {...others}
    />
  )
}

type InputGroupTextProps = ComponentProps<"span">

const InputGroupText = (props: InputGroupTextProps) => {
  const [local, others] = splitProps(props, ["class"])

  return (
    <span
      class={cn(
        "z-input-group-text flex items-center gap-2 text-muted-foreground text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        local.class
      )}
      data-slot="input-group-text"
      {...others}
    />
  )
}

type InputGroupInputProps = ComponentProps<"input">

const InputGroupInput = (props: InputGroupInputProps) => {
  const [local, others] = splitProps(props, ["class"])

  return (
    <Input
      class={cn(
        "z-input-group-input flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        local.class
      )}
      data-slot="input-group-control"
      {...others}
    />
  )
}

type InputGroupTextareaProps = ComponentProps<"textarea">

const InputGroupTextarea = (props: InputGroupTextareaProps) => {
  const [local, others] = splitProps(props, ["class"])

  return (
    <Textarea
      class={cn(
        "z-input-group-textarea flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        local.class
      )}
      data-slot="input-group-control"
      {...others}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
}
