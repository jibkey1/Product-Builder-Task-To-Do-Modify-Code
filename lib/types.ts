export interface TodoItem {
  id: string
  text: string
  completed: boolean
  flagged: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  priority: number
  items: TodoItem[]
}
