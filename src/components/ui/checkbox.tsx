"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-md border border-zinc-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-brand-gold border-brand-gold text-white" : "bg-white",
          className
        )}
        onClick={() => onCheckedChange?.(!checked)}
        ref={ref}
        {...props}
      >
        <span className={cn(
          "flex items-center justify-center transition-opacity",
          checked ? "opacity-100" : "opacity-0"
        )}>
          <Check className="h-3 w-3 stroke-[3]" />
        </span>
      </button>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
