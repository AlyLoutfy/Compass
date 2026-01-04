import * as React from "react"
import { cn } from "@/lib/utils"

const AvatarContext = React.createContext<{ 
  bgStatus: 'loading' | 'loaded' | 'error', 
  setBgStatus: (status: 'loading' | 'loaded' | 'error') => void 
} | null>(null)

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [bgStatus, setBgStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <AvatarContext.Provider value={{ bgStatus, setBgStatus }}>
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  )
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, ...props }, ref) => {
  const context = React.useContext(AvatarContext)
  
  // Reset status when src changes
  React.useLayoutEffect(() => {
    if (context && src) context.setBgStatus('loading')
    else if (context && !src) context.setBgStatus('error')
  }, [src, context])

  const handleLoad = React.useCallback(() => {
     context?.setBgStatus('loaded')
  }, [context])

  const handleError = React.useCallback(() => {
     context?.setBgStatus('error')
  }, [context])

  if (!src || context?.bgStatus === 'error') return null

  return (
    <img
      ref={ref}
      src={src}
      onLoad={handleLoad}
      onError={handleError}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(AvatarContext)
  
  if (context?.bgStatus === 'loaded') return null

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
