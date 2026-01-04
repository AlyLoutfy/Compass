import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified ScrollArea for now (just a div with custom scrollbars via CSS in index.css)
// But we provide the component interface for future Radix upgrade if needed.

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative overflow-auto custom-scrollbar", className)}
    {...props}
  >
    {children}
  </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
