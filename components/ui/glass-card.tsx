import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: boolean // true = glass (backdrop-blur), false = glass-solid (opaque, default)
}

export function GlassCard({ className, blur = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        blur ? "glass" : "glass-solid",
        "shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    />
  )
}
