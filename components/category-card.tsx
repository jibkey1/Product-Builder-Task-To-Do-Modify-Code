"use client"

import { ChevronRight, GripVertical } from "lucide-react"
import { Category } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  category: Category
  onClick: () => void
  isDragging?: boolean
}

export function CategoryCard({ category, onClick, isDragging }: CategoryCardProps) {
  const completedCount = category.items.filter(item => item.completed).length
  const totalCount = category.items.length
  const flaggedCount = category.items.filter(item => item.flagged && !item.completed).length

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-card rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group",
        isDragging && "opacity-50"
      )}
    >
      <div className="cursor-grab active:cursor-grabbing touch-none">
        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
      </div>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: category.color + "20" }}
      >
        <div
          className="w-5 h-5 rounded-md"
          style={{ backgroundColor: category.color }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{category.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalCount} completed
          </span>
          {flaggedCount > 0 && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-accent-foreground font-medium">
                {flaggedCount} flagged
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-muted-foreground">{totalCount}</span>
        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}
