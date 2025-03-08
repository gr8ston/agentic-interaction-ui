
"use client"

import { cn } from "@/lib/utils"

export function MessageLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1 items-center", className)}>
      <div className="h-2 w-2 rounded-full bg-current opacity-50 animate-bounce" />
      <div className="h-2 w-2 rounded-full bg-current opacity-50 animate-bounce delay-75" />
      <div className="h-2 w-2 rounded-full bg-current opacity-50 animate-bounce delay-150" />
    </div>
  )
}
