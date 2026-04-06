"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Flag, Trash2 } from "lucide-react"
import { Category, TodoItem } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { generateId } from "@/lib/store"

interface NoteDetailProps {
  category: Category
  onBack: () => void
  onUpdateCategory: (category: Category) => void
}

export function NoteDetail({ category, onBack, onUpdateCategory }: NoteDetailProps) {
  const [newItemText, setNewItemText] = useState("")

  const handleToggleComplete = (itemId: string) => {
    const updatedItems = category.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    )
    onUpdateCategory({ ...category, items: updatedItems })
  }

  const handleToggleFlag = (itemId: string) => {
    const updatedItems = category.items.map(item =>
      item.id === itemId ? { ...item, flagged: !item.flagged } : item
    )
    onUpdateCategory({ ...category, items: updatedItems })
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = category.items.filter(item => item.id !== itemId)
    onUpdateCategory({ ...category, items: updatedItems })
  }

  const handleAddItem = () => {
    if (!newItemText.trim()) return
    
    const newItem: TodoItem = {
      id: generateId(),
      text: newItemText.trim(),
      completed: false,
      flagged: false,
      createdAt: new Date(),
    }
    
    onUpdateCategory({ ...category, items: [...category.items, newItem] })
    setNewItemText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem()
    }
  }

  const incompleteItems = category.items.filter(item => !item.completed)
  const completedItems = category.items.filter(item => item.completed)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-9 w-9 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h1 className="text-lg font-semibold">{category.name}</h1>
        </div>
        <span className="text-sm text-muted-foreground">
          {category.items.filter(i => !i.completed).length} remaining
        </span>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-auto">
        {/* Add new item */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <div className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/30" />
          <Input
            placeholder="Add a new item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
            className="h-8 w-8 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Incomplete items */}
        {incompleteItems.length > 0 && (
          <div className="divide-y divide-border">
            {incompleteItems.map(item => (
              <TodoItemRow
                key={item.id}
                item={item}
                categoryColor={category.color}
                onToggleComplete={() => handleToggleComplete(item.id)}
                onToggleFlag={() => handleToggleFlag(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Completed items */}
        {completedItems.length > 0 && (
          <div className="mt-6">
            <div className="px-4 py-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Completed ({completedItems.length})
              </p>
            </div>
            <div className="divide-y divide-border opacity-60">
              {completedItems.map(item => (
                <TodoItemRow
                  key={item.id}
                  item={item}
                  categoryColor={category.color}
                  onToggleComplete={() => handleToggleComplete(item.id)}
                  onToggleFlag={() => handleToggleFlag(item.id)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {category.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <p className="text-muted-foreground text-center">No items yet</p>
            <p className="text-sm text-muted-foreground/70 text-center mt-1">
              Add your first item above
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface TodoItemRowProps {
  item: TodoItem
  categoryColor: string
  onToggleComplete: () => void
  onToggleFlag: () => void
  onDelete: () => void
}

function TodoItemRow({ item, categoryColor, onToggleComplete, onToggleFlag, onDelete }: TodoItemRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-secondary/50 transition-colors group">
      <div onClick={onToggleComplete} className="cursor-pointer">
        <Checkbox
          checked={item.completed}
          className="h-5 w-5 rounded-full border-2"
          style={{ borderColor: categoryColor }}
        />
      </div>
      <p className={cn(
        "flex-1 text-sm",
        item.completed && "line-through text-muted-foreground"
      )}>
        {item.text}
      </p>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFlag}
          className={cn(
            "h-8 w-8 rounded-full",
            item.flagged && "text-accent-foreground bg-accent/30"
          )}
        >
          <Flag className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {item.flagged && (
        <Flag className="w-4 h-4 text-accent-foreground flex-shrink-0 group-hover:hidden" />
      )}
    </div>
  )
}
