import * as React from "react"
import { cn } from "../../lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "accent"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    
    const variantClasses = {
      default: "border-transparent bg-primary text-primary-foreground hover:opacity-80",
      secondary: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      outline: "text-foreground",
      accent: "border-transparent bg-accent text-accent-foreground hover:opacity-80",
    }

    return (
      <div
        className={cn(baseClasses, variantClasses[variant], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"

export { Badge }