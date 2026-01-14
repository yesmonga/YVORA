'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Loader2,
} from 'lucide-react'

interface Account {
  id: string
  email: string
  store: string
  status: string
  lastLogin?: string
}

const statusConfig: Record<string, { label: string; class: string }> = {
  READY: { label: 'Ready', class: 'bg-green-500/20 text-green-400' },
  BANNED: { label: 'Banned', class: 'bg-red-500/20 text-red-400' },
  LOGIN_FAILED: { label: 'Login Failed', class: 'bg-red-500/20 text-red-400' },
  CODE_REQUIRED: { label: '2FA Required', class: 'bg-yellow-500/20 text-yellow-400' },
  CAPTCHA_REQUIRED: { label: 'Captcha', class: 'bg-purple-500/20 text-purple-400' },
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [bulkInput, setBulkInput] = useState('')
  const [store, setStore] = useState('AMAZON')

  useEffect(() => {
    fetchAccounts()
  }, [])

  const createAccounts = async () => {
    if (!bulkInput.trim()) return
    setCreating(true)
    const lines = bulkInput.split('\n').filter(l => l.trim())
    const accountsData = lines.map(line => {
      const parts = line.trim().split(':')
      return {
        store,
        email: parts[0],
        password: parts[1] || '',
        imapConfig: parts[2] && parts[3] ? { host: 'imap.gmail.com', port: 993, user: parts[2], pass: parts[3] } : null,
      }
    }).filter(a => a.email && a.password)

    try {
      const res = await fetch('/api/bot/accounts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts: accountsData }),
      })
      if (res.ok) {
        await fetchAccounts()
        setIsCreateOpen(false)
        setBulkInput('')
      }
    } catch (error) {
      console.error('Failed to create accounts:', error)
    } finally {
      setCreating(false)
    }
  }

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/bot/accounts')
      if (res.ok) {
        const data = await res.json()
        setAccounts(data)
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async (accountId: string) => {
    try {
      const res = await fetch(`/api/bot/accounts/${accountId}`, { method: 'DELETE' })
      if (res.ok) {
        setAccounts(accounts.filter(a => a.id !== accountId))
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
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
          <h1 className="text-2xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">Manage your store accounts</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="cyber" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Accounts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Store</Label>
                <Select value={store} onValueChange={setStore}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMAZON">Amazon</SelectItem>
                    <SelectItem value="CARREFOUR">Carrefour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Accounts (one per line)</Label>
                <p className="text-xs text-muted-foreground">Format: email:password or email:password:imapUser:imapPass</p>
                <Textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="user@gmail.com:password123&#10;user2@outlook.com:pass456:imap@gmail.com:appPass"
                  className="font-mono text-xs h-32"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button variant="cyber" onClick={createAccounts} disabled={creating || !bulkInput.trim()}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : `Import ${bulkInput.split('\n').filter(l => l.trim()).length} Accounts`}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="yvora-card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="bg-yvora-body">
              <tr className="border-b border-yvora-border">
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Site</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No accounts yet. Click "Add Account" to add one.
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                  <tr key={account.id} className="border-b border-yvora-border hover:bg-yvora-border/30">
                    <td className="p-4">
                      {account.store === 'AMAZON' ? (
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
                      <span className="text-sm">{account.email}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={cn('text-xs', statusConfig[account.status]?.class || 'bg-gray-500/20')}>
                        {statusConfig[account.status]?.label || account.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => deleteAccount(account.id)}
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
