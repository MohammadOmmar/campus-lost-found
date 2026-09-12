import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-sm border border-border-default bg-base-800 px-3 py-2 text-sm text-text-primary transition-all duration-200 outline-none file:inline-flex file:h-10 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:border-accent/50 focus-visible:ring-1 focus-visible:ring-accent/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-base-700 disabled:opacity-50 aria-invalid:border-status-lost aria-invalid:ring-1 aria-invalid:ring-status-lost/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
