import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] outline-none select-none focus-visible:ring-1 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-accent text-base-950 hover:bg-accent-dim active:bg-accent/80 shadow-[0_0_20px_rgba(200,255,0,0.15)]",
        outline: "border-border-default bg-transparent text-text-primary hover:bg-base-800 hover:border-border-strong active:bg-base-700",
        secondary: "bg-base-700 text-text-primary hover:bg-base-600 active:bg-base-500 border border-border-subtle",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-base-800 active:bg-base-700",
        destructive: "bg-status-lost/10 text-status-lost border border-status-lost/20 hover:bg-status-lost/20 active:bg-status-lost/30",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4 text-sm rounded-sm",
        sm: "h-8 gap-1.5 px-3 text-xs rounded-xs",
        lg: "h-11 gap-2.5 px-5 text-sm rounded-md",
        xl: "h-13 gap-3 px-7 text-base rounded-md",
        icon: "size-10 rounded-md",
        "icon-sm": "size-8 rounded-sm",
        "icon-lg": "size-12 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : ButtonPrimitive
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
