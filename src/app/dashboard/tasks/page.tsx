'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
  Plus,
  Play,
  Square,
  Trash2,
  Search,
  ShoppingBag,
  Store,
  Loader2,
} from 'lucide-react'

interface Task {
  id: string
  store: string
  productSku: string
  productName?: string
  mode: string
  status: string
  quantity: number
  profile?: { name: string }
  proxyGroup?: { name: string }
}

const statusConfig: Record<string, { label: string; class: string }> = {
  IDLE: { label: 'Idle', class: 'bg-gray-500/20 text-gray-400' },
  STARTING: { label: 'Starting', class: 'bg-yellow-500/20 text-yellow-400' },
  MONITORING: { label: 'Monitoring', class: 'bg-blue-500/20 text-blue-400' },
  ADD_TO_CART: { label: 'Carting', class: 'bg-orange-500/20 text-orange-400' },
  SUBMITTING_ORDER: { label: 'Checkout', class: 'bg-purple-500/20 text-purple-400' },
  SUCCESS: { label: 'Success', class: 'bg-green-500/20 text-green-400' },
  ERROR_PAYMENT: { label: 'Error', class: 'bg-red-500/20 text-red-400' },
  ERROR_CAPTCHA: { label: 'Captcha', class: 'bg-purple-500/20 text-purple-400' },
  ERROR_LOGIN: { label: 'Login Error', class: 'bg-red-500/20 text-red-400' },
  STOPPED: { label: 'Stopped', class: 'bg-gray-500/20 text-gray-400' },
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/bot/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/bot/tasks/${taskId}`, { method: 'DELETE' })
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId))
        setSelectedTasks(selectedTasks.filter(id => id !== taskId))
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const deleteSelectedTasks = async () => {
    for (const taskId of selectedTasks) {
      await deleteTask(taskId)
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.productSku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }

  const toggleAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map((t) => t.id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-yvora-card"
            />
          </div>
          {selectedTasks.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 text-red-400 hover:text-red-300"
              onClick={deleteSelectedTasks}
            >
              <Trash2 className="h-3 w-3" />
              Delete ({selectedTasks.length})
            </Button>
          )}
        </div>
        <Button variant="cyber" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="yvora-card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="bg-yvora-body">
              <tr className="border-b border-yvora-border">
                <th className="p-4 w-12">
                  <Checkbox
                    checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                    onCheckedChange={toggleAllTasks}
                  />
                </th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Site</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Product</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Mode</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Profile</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No tasks yet. Click "Create Task" to add one.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-yvora-border hover:bg-yvora-border/30">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => toggleTaskSelection(task.id)}
                      />
                    </td>
                    <td className="p-4">
                      {task.store === 'AMAZON' ? (
                        <div className="p-1.5 rounded bg-orange-500/20 w-fit">
                          <ShoppingBag className="h-4 w-4 text-orange-400" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded bg-blue-500/20 w-fit">
                          <Store className="h-4 w-4 text-blue-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">
                          {task.productName || task.productSku}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{task.productSku}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{task.mode}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{task.profile?.name || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={cn('text-xs', statusConfig[task.status]?.class || 'bg-gray-500/20')}>
                        {statusConfig[task.status]?.label || task.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
