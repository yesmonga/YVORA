'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

  useEffect(() => {
    fetchAccounts()
  }, [])

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
        <Button variant="cyber" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
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
