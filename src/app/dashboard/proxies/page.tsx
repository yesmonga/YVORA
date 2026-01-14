'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  Plus,
  FolderPlus,
  Globe,
  Zap,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Gauge,
} from 'lucide-react'

interface ProxyGroup {
  id: string
  name: string
  proxyCount: number
  workingCount: number
}

interface Proxy {
  id: string
  host: string
  port: number
  username?: string
  status: 'working' | 'slow' | 'dead' | 'untested'
  latency?: number
}

const mockProxyGroups: ProxyGroup[] = [
  { id: '1', name: 'All Proxies', proxyCount: 127, workingCount: 118 },
  { id: '2', name: 'US Residential', proxyCount: 50, workingCount: 48 },
  { id: '3', name: 'EU Datacenter', proxyCount: 40, workingCount: 38 },
  { id: '4', name: 'FR Residential', proxyCount: 37, workingCount: 32 },
]

const mockProxies: Proxy[] = [
  { id: '1', host: '192.168.1.100', port: 8080, username: 'user1', status: 'working', latency: 45 },
  { id: '2', host: '10.0.0.50', port: 3128, status: 'working', latency: 120 },
  { id: '3', host: '172.16.0.25', port: 8888, username: 'proxy_user', status: 'slow', latency: 350 },
  { id: '4', host: '192.168.2.200', port: 1080, status: 'dead' },
  { id: '5', host: '10.10.10.10', port: 8080, username: 'test', status: 'working', latency: 80 },
  { id: '6', host: '172.20.0.100', port: 3128, status: 'untested' },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  working: { label: 'Working', color: 'text-primary' },
  slow: { label: 'Slow', color: 'text-yellow-400' },
  dead: { label: 'Dead', color: 'text-red-400' },
  untested: { label: 'Untested', color: 'text-muted-foreground' },
}

export default function ProxiesPage() {
  const [selectedGroup, setSelectedGroup] = useState('1')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Proxy Groups Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="cyber-card h-full flex flex-col">
          <div className="p-4 border-b border-cyber-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Proxy Groups</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {mockProxyGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                    selectedGroup === group.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-cyber-border/50 text-muted-foreground hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">{group.name}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-primary">{group.workingCount}</span>
                    <span className="text-muted-foreground">/{group.proxyCount}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => setIsTesting(!isTesting)}
            >
              <RefreshCw className={cn('h-4 w-4', isTesting && 'animate-spin')} />
              Test All Proxies
            </Button>
            <Button variant="secondary" size="sm" className="gap-2 text-red-400">
              <Trash2 className="h-4 w-4" />
              Remove Dead
            </Button>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button variant="cyber" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Proxies
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Proxies</DialogTitle>
              </DialogHeader>
              <AddProxiesForm onClose={() => setIsAddModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="cyber-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
          <div className="cyber-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">118</p>
                <p className="text-xs text-muted-foreground">Working</p>
              </div>
            </div>
          </div>
          <div className="cyber-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Slow</p>
              </div>
            </div>
          </div>
          <div className="cyber-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Dead</p>
              </div>
            </div>
          </div>
        </div>

        {/* Proxies Table */}
        <div className="cyber-card flex-1 overflow-hidden">
          <div className="overflow-auto h-full">
            <table className="w-full">
              <thead className="bg-cyber-body sticky top-0">
                <tr className="border-b border-cyber-border">
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Host
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Port
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Auth
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Latency
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockProxies.map((proxy) => (
                  <tr
                    key={proxy.id}
                    className="border-b border-cyber-border hover:bg-cyber-border/30"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm">{proxy.host}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {proxy.port}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {proxy.username || 'None'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn('text-sm font-medium', statusConfig[proxy.status].color)}>
                        {statusConfig[proxy.status].label}
                      </span>
                    </td>
                    <td className="p-4">
                      {proxy.latency ? (
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <span className={cn(
                            'text-sm font-mono',
                            proxy.latency < 100 ? 'text-primary' :
                            proxy.latency < 300 ? 'text-yellow-400' : 'text-red-400'
                          )}>
                            {proxy.latency}ms
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddProxiesForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Paste Proxies</Label>
        <p className="text-xs text-muted-foreground">
          Format: ip:port or ip:port:user:pass (one per line)
        </p>
        <Textarea
          placeholder="192.168.1.1:8080&#10;10.0.0.1:3128:user:pass&#10;..."
          className="bg-cyber-body font-mono text-sm h-48"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="cyber" onClick={onClose}>
          Add Proxies
        </Button>
      </div>
    </div>
  )
}
