import * as React from "react"
import NextLink from "next/link"
import { cn } from "../../lib/utils"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: "default" | "button" | "accent"
  external?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, variant = "default", external = false, children, ...props }, ref) => {
    const baseClasses = "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    
    const variantClasses = {
      default: "text-primary hover:text-primary/80 underline-offset-4 hover:underline",
      button: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 h-10 px-4 py-2",
      accent: "text-accent-foreground hover:text-accent-foreground/80 underline-offset-4 hover:underline",
    }

    const linkClasses = cn(baseClasses, variantClasses[variant], className)

    if (external || href.startsWith('http')) {
      return (
        <a
          href={href}
          className={linkClasses}
          ref={ref}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      )
    }

    return (
      <NextLink
        href={href}
        className={linkClasses}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = "Link"

export { Link }