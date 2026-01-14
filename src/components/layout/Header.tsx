'use client'

import { useTaskStore } from '@/store/tasks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Square, Key, Shield } from 'lucide-react'

export function Header() {
  const { isRunningAll, startAll, stopAll, tasks } = useTaskStore()
  
  const activeTasks = tasks.filter(t => 
    ['starting', 'monitoring', 'carting', 'checkout'].includes(t.status)
  ).length
  
  const successTasks = tasks.filter(t => t.status === 'success').length

  return (
    <header className="h-16 border-b border-cyber-border bg-cyber-card/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Active: <span className="text-white font-medium">{activeTasks}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">
              Success: <span className="text-green-500 font-medium">{successTasks}</span>
            </span>
          </div>
        </div>

        {/* Center: License */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2 px-3 py-1">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-primary">Lifetime</span>
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Key className="h-3 w-3" />
            <span className="font-mono">XXXX-XXXX-XXXX</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {isRunningAll ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={stopAll}
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              Stop All
            </Button>
          ) : (
            <Button
              variant="cyber"
              size="sm"
              onClick={startAll}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Start All
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
