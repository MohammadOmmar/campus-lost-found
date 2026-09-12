import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-border-subtle bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-text-muted focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:bg-base-800/50 disabled:opacity-50 aria-invalid:border-status-lost aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-base-800/30 dark:disabled:bg-base-800/80 dark:aria-invalid:border-status-lost/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
