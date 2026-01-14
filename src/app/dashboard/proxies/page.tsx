'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Globe,
  Trash2,
  Loader2,
} from 'lucide-react'

interface Proxy {
  id: string
  host: string
  port: number
  username?: string
  status: string
  latency?: number
}

const statusConfig: Record<string, { label: string; class: string }> = {
  WORKING: { label: 'Working', class: 'text-green-400' },
  SLOW: { label: 'Slow', class: 'text-yellow-400' },
  DEAD: { label: 'Dead', class: 'text-red-400' },
  UNTESTED: { label: 'Untested', class: 'text-muted-foreground' },
}

export default function ProxiesPage() {
  const [proxies, setProxies] = useState<Proxy[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [bulkInput, setBulkInput] = useState('')

  useEffect(() => {
    fetchProxies()
  }, [])

  const createProxies = async () => {
    if (!bulkInput.trim()) return
    setCreating(true)
    const lines = bulkInput.split('\n').filter(l => l.trim())
    const proxyStrings = lines.map(line => line.trim())

    try {
      const res = await fetch('/api/bot/proxies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxies: proxyStrings, proxyGroupId: 'default' }),
      })
      if (res.ok) {
        await fetchProxies()
        setIsCreateOpen(false)
        setBulkInput('')
      }
    } catch (error) {
      console.error('Failed to create proxies:', error)
    } finally {
      setCreating(false)
    }
  }

  const fetchProxies = async () => {
    try {
      const res = await fetch('/api/bot/proxies')
      if (res.ok) {
        const data = await res.json()
        setProxies(data)
      }
    } catch (error) {
      console.error('Failed to fetch proxies:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProxy = async (proxyId: string) => {
    try {
      const res = await fetch(`/api/bot/proxies/${proxyId}`, { method: 'DELETE' })
      if (res.ok) {
        setProxies(proxies.filter(p => p.id !== proxyId))
      }
    } catch (error) {
      console.error('Failed to delete proxy:', error)
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
        <div>
          <h1 className="text-2xl font-bold">Proxies</h1>
          <p className="text-muted-foreground">Manage your proxy pool</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="cyber" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Proxies
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Proxies</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Proxies (one per line)</Label>
                <p className="text-xs text-muted-foreground">Format: ip:port or ip:port:user:pass</p>
                <Textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="192.168.1.1:8080&#10;10.0.0.1:3128:user:pass"
                  className="font-mono text-xs h-48"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button variant="cyber" onClick={createProxies} disabled={creating || !bulkInput.trim()}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : `Add ${bulkInput.split('\n').filter(l => l.trim()).length} Proxies`}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="yvora-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{proxies.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <div className="yvora-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Globe className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{proxies.filter(p => p.status === 'WORKING').length}</p>
              <p className="text-xs text-muted-foreground">Working</p>
            </div>
          </div>
        </div>
        <div className="yvora-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Globe className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{proxies.filter(p => p.status === 'SLOW').length}</p>
              <p className="text-xs text-muted-foreground">Slow</p>
            </div>
          </div>
        </div>
        <div className="yvora-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Globe className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{proxies.filter(p => p.status === 'DEAD').length}</p>
              <p className="text-xs text-muted-foreground">Dead</p>
            </div>
          </div>
        </div>
      </div>

      <div className="yvora-card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="bg-yvora-body">
              <tr className="border-b border-yvora-border">
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Host</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Port</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Latency</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proxies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No proxies yet. Click "Add Proxies" to add some.
                  </td>
                </tr>
              ) : (
                proxies.map((proxy) => (
                  <tr key={proxy.id} className="border-b border-yvora-border hover:bg-yvora-border/30">
                    <td className="p-4">
                      <span className="font-mono text-sm">{proxy.host}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-muted-foreground">{proxy.port}</span>
                    </td>
                    <td className="p-4">
                      <span className={cn('text-sm font-medium', statusConfig[proxy.status]?.class || 'text-muted-foreground')}>
                        {statusConfig[proxy.status]?.label || proxy.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-mono text-muted-foreground">
                        {proxy.latency ? `${proxy.latency}ms` : '—'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => deleteProxy(proxy.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
