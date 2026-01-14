'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Play,
  Square,
  Trash2,
  MoreVertical,
  Edit,
  Copy,
  ExternalLink,
} from 'lucide-react'

type TaskStatus =
  | 'IDLE'
  | 'STARTING'
  | 'LOGIN'
  | 'MONITORING'
  | 'ADD_TO_CART'
  | 'SUBMITTING_ORDER'
  | 'SUCCESS'
  | 'ERROR_PAYMENT'
  | 'ERROR_CAPTCHA'
  | 'ERROR_RATELIMIT'
  | 'ERROR_LOGIN'
  | 'ERROR_OUT_OF_STOCK'
  | 'STOPPED'

interface Task {
  id: string
  store: 'AMAZON' | 'CARREFOUR'
  productSku: string
  productName?: string
  productImage?: string
  mode: string
  status: TaskStatus
  statusMessage?: string
  quantity: number
  profile: { name: string }
}

interface TaskTableProps {
  tasks: Task[]
  selectedTasks: string[]
  onSelectTask: (taskId: string) => void
  onSelectAll: () => void
  onStartTask: (taskId: string) => void
  onStopTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (taskId: string) => void
  onDuplicateTask: (taskId: string) => void
}

const statusConfig: Record<TaskStatus, { label: string; className: string; pulse?: boolean }> = {
  IDLE: {
    label: 'Idle',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
  STARTING: {
    label: 'Starting',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    pulse: true,
  },
  LOGIN: {
    label: 'Login',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    pulse: true,
  },
  MONITORING: {
    label: 'Monitoring',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pulse: true,
  },
  ADD_TO_CART: {
    label: 'Adding to Cart',
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    pulse: true,
  },
  SUBMITTING_ORDER: {
    label: 'Submitting',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pulse: true,
  },
  SUCCESS: {
    label: 'Success',
    className: 'bg-[#2bea8e]/20 text-[#2bea8e] border-[#2bea8e]/30',
  },
  ERROR_PAYMENT: {
    label: 'Payment Error (406)',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  ERROR_CAPTCHA: {
    label: 'Captcha (418)',
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  ERROR_RATELIMIT: {
    label: 'Rate Limited (429)',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  ERROR_LOGIN: {
    label: 'Login Failed',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  ERROR_OUT_OF_STOCK: {
    label: 'Out of Stock',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
  STOPPED: {
    label: 'Stopped',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status] || statusConfig.IDLE

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${config.pulse ? 'animate-pulse' : ''}`}
    >
      {config.label}
    </Badge>
  )
}

function StoreIcon({ store }: { store: 'AMAZON' | 'CARREFOUR' }) {
  if (store === 'AMAZON') {
    return (
      <div className="w-6 h-6 rounded-full bg-[#FF9900] flex items-center justify-center flex-shrink-0">
        <span className="text-black font-bold text-xs">A</span>
      </div>
    )
  }
  return (
    <div className="w-6 h-6 rounded-full bg-[#004E9F] flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-xs">C</span>
    </div>
  )
}

export function TaskTable({
  tasks,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onStartTask,
  onStopTask,
  onDeleteTask,
  onEditTask,
  onDuplicateTask,
}: TaskTableProps) {
  const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length
  const isRunning = (status: TaskStatus) =>
    ['STARTING', 'LOGIN', 'MONITORING', 'ADD_TO_CART', 'SUBMITTING_ORDER'].includes(status)

  return (
    <div className="cyber-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            <th className="p-4 w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
            </th>
            <th className="p-4">Store</th>
            <th className="p-4">Product</th>
            <th className="p-4">Mode</th>
            <th className="p-4">Profile</th>
            <th className="p-4">Qty</th>
            <th className="p-4">Status</th>
            <th className="p-4 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-8 text-center text-muted-foreground">
                Aucune tâche. Cliquez sur "New Task" pour en créer une.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr
                key={task.id}
                className={`border-b border-border/50 hover:bg-cyber-card/50 transition-colors ${
                  selectedTasks.includes(task.id) ? 'bg-primary/5' : ''
                }`}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={() => onSelectTask(task.id)}
                  />
                </td>
                <td className="p-4">
                  <StoreIcon store={task.store} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {task.productImage ? (
                      <img
                        src={task.productImage}
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-cyber-body flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">N/A</span>
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-sm">{task.productSku}</p>
                      {task.productName && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {task.productName}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium">{task.mode}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm">{task.profile.name}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm">{task.quantity}</span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <StatusBadge status={task.status} />
                    {task.statusMessage && (
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {task.statusMessage}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {isRunning(task.status) ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onStopTask(task.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onStartTask(task.id)}
                        className="h-8 w-8 p-0 text-primary hover:text-primary/80"
                        disabled={task.status === 'SUCCESS'}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditTask(task.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicateTask(task.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(
                            task.store === 'AMAZON'
                              ? `https://amazon.fr/dp/${task.productSku}`
                              : `https://carrefour.fr/p/${task.productSku}`,
                            '_blank'
                          )}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir le produit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteTask(task.id)}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
