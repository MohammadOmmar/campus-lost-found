import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent/30 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-status-lost aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-accent text-base-950 [a]:hover:bg-accent/80",
        secondary:
          "bg-base-700 text-text-primary [a]:hover:bg-base-700/80",
        destructive:
          "bg-status-lost/10 text-status-lost focus-visible:ring-status-lost/20 [a]:hover:bg-status-lost/20",
        outline:
          "border-border-subtle text-text-primary [a]:hover:bg-base-700 [a]:hover:text-text-primary",
        ghost:
          "hover:bg-base-700 hover:text-text-primary",
        link: "text-text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
