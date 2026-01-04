import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextType {
  value: string
  onChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  labelMap: Map<string, React.ReactNode>
  registerOption: (value: string, label: React.ReactNode) => void
  disabled?: boolean
  // Version to trigger updates when options are registered
  optionsVersion: number 
  containerRef: React.RefObject<HTMLDivElement | null>
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

const useSelect = () => {
  const context = useContext(SelectContext)
  if (!context) throw new Error("useSelect must be used within a SelectProvider")
  return context
}

// --- Root Component ---

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children, className, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [labelMap] = useState(() => new Map<string, React.ReactNode>())
  const [optionsVersion, setOptionsVersion] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const registerOption = useCallback((val: string, label: React.ReactNode) => {
    // Only set if not exists or if label changed (shallow check mainly for strings)
    if (!labelMap.has(val) || labelMap.get(val) !== label) {
        labelMap.set(val, label)
        setOptionsVersion(v => v + 1)
    }
  }, [labelMap])

  return (
    <SelectContext.Provider value={{ value, onChange: onValueChange, isOpen, setIsOpen, labelMap, registerOption, disabled, optionsVersion, containerRef }}>
      <div ref={containerRef} className={cn("relative w-full", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// --- Trigger ---

export const SelectTrigger: React.FC<{ children: React.ReactNode, className?: string, disabled?: boolean }> = ({ children, className, disabled }) => {
  const { isOpen, setIsOpen, disabled: contextDisabled } = useSelect()
  
  const isDisabled = disabled ?? contextDisabled

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => !isDisabled && setIsOpen(!isOpen)}
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-lg border border-input bg-background pl-3 pr-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
      <ChevronDown 
        className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200 ml-2", 
            isOpen && "rotate-180"
        )} 
      />
    </button>
  )
}

// --- Value Display ---

export const SelectValue: React.FC<{ placeholder?: string, className?: string, children?: React.ReactNode }> = ({ placeholder, className, children }) => {
  const { value, labelMap, optionsVersion } = useSelect()
  
  // We depend on optionsVersion to re-render when new options are registered
  const display = React.useMemo(() => {
     if (children) return children
     return labelMap.get(value) || (value ? value : placeholder)
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, labelMap, optionsVersion, placeholder, children])

  return (
    <span className={cn("block truncate", !value && "text-muted-foreground", className)}>
      {display}
    </span>
  )
}

// --- Content (Dropdown) ---

export const SelectContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const { isOpen, setIsOpen, containerRef } = useSelect()
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left: number; width: number }>({ left: 0, width: 0 })

  useEffect(() => {
    if (isOpen && containerRef.current) {
        const updatePosition = () => {
             const rect = containerRef.current!.getBoundingClientRect()
             const spaceBelow = window.innerHeight - rect.bottom
             const spaceAbove = rect.top
             
             // Flip if constrained below (less than 250px) and more space above
             const shouldFlip = spaceBelow < 250 && spaceAbove > spaceBelow
             
             if (shouldFlip) {
                setPosition('top')
                setCoords({
                    bottom: window.innerHeight - rect.top,
                    left: rect.left,
                    width: rect.width
                })
             } else {
                setPosition('bottom')
                setCoords({
                    top: rect.bottom,
                    left: rect.left,
                    width: rect.width
                })
             }
        }
        
        updatePosition()
        
        // Close on scroll to prevent detached UI
        const handleScroll = () => setIsOpen(false)
        const handleResize = () => setIsOpen(false)

        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleScroll, true)
        
        return () => {
             window.removeEventListener('resize', handleResize)
             window.removeEventListener('scroll', handleScroll, true)
        }
    }
  }, [isOpen, containerRef, setIsOpen])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: position === 'bottom' ? -10 : 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: position === 'bottom' ? -10 : 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
             position: 'fixed',
             left: coords.left,
             ...(coords.top !== undefined ? { top: coords.top } : { bottom: coords.bottom }),
             minWidth: coords.width,
             maxWidth: '90vw',
             zIndex: 9999
          }}
          className={cn(
            "overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl",
            position === 'bottom' ? "mt-2" : "mb-2",
            className
          )}
        >
          <div className="p-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// --- Item ---

export const SelectItem: React.FC<{ value: string, children: React.ReactNode, className?: string }> = ({ value, children, className }) => {
  const { value: selectedValue, onChange, setIsOpen, registerOption } = useSelect()
  
  // Register label for display
  useEffect(() => {
     registerOption(value, children)
  }, [value, children, registerOption])

  const isSelected = selectedValue === value

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onChange(value)
        setIsOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-2.5 pr-8 text-sm outline-none transition-colors",
        "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50", // Stronger hover effect
        isSelected && "bg-muted font-medium",
        className
      )}
    >
      <span className="whitespace-nowrap">{children}</span>
      {isSelected && (
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4 opacity-50 text-blue-500" />
        </span>
      )}
    </div>
  )
}
