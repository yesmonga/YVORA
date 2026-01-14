'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  FolderPlus,
  ShoppingBag,
  Store,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Edit,
  Mail,
  Key,
  Cookie,
} from 'lucide-react'

interface Account {
  id: string
  email: string
  site: 'amazon' | 'carrefour'
  status: 'ready' | 'banned' | 'login_failed' | '2fa_required'
  lastLogin?: string
}

interface AccountGroup {
  id: string
  name: string
  accountCount: number
}

const mockAccountGroups: AccountGroup[] = [
  { id: '1', name: 'All Accounts', accountCount: 24 },
  { id: '2', name: 'Amazon Main', accountCount: 12 },
  { id: '3', name: 'Amazon Backup', accountCount: 8 },
  { id: '4', name: 'Carrefour', accountCount: 4 },
]

const mockAccounts: Account[] = [
  { id: '1', email: 'user1@gmail.com', site: 'amazon', status: 'ready', lastLogin: '2 hours ago' },
  { id: '2', email: 'user2@outlook.com', site: 'amazon', status: 'ready', lastLogin: '1 day ago' },
  { id: '3', email: 'shopper@yahoo.com', site: 'amazon', status: '2fa_required', lastLogin: '3 days ago' },
  { id: '4', email: 'buyer@gmail.com', site: 'carrefour', status: 'ready', lastLogin: '5 hours ago' },
  { id: '5', email: 'test@proton.me', site: 'amazon', status: 'banned' },
  { id: '6', email: 'account@gmail.com', site: 'carrefour', status: 'login_failed' },
]

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'outline' }> = {
  ready: { label: 'Ready', variant: 'success' },
  banned: { label: 'Banned', variant: 'error' },
  login_failed: { label: 'Login Failed', variant: 'error' },
  '2fa_required': { label: '2FA Required', variant: 'warning' },
}

export default function AccountsPage() {
  const [selectedGroup, setSelectedGroup] = useState('1')
  const [showPasswords, setShowPasswords] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Account Groups Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="cyber-card h-full flex flex-col">
          <div className="p-4 border-b border-cyber-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Account Groups</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {mockAccountGroups.map((group) => (
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
                  <span className="text-sm">{group.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {group.accountCount}
                  </span>
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
              onClick={() => setShowPasswords(!showPasswords)}
              className="gap-2"
            >
              {showPasswords ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showPasswords ? 'Hide' : 'Show'} Passwords
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Verify All
            </Button>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button variant="cyber" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Account</DialogTitle>
              </DialogHeader>
              <AddAccountForm onClose={() => setIsCreateModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Accounts Table */}
        <div className="cyber-card flex-1 overflow-hidden">
          <div className="overflow-auto h-full">
            <table className="w-full">
              <thead className="bg-cyber-body sticky top-0">
                <tr className="border-b border-cyber-border">
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Site
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Email
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Password
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Last Login
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="border-b border-cyber-border hover:bg-cyber-border/30"
                  >
                    <td className="p-4">
                      {account.site === 'amazon' ? (
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
                      <span className="text-sm font-mono text-muted-foreground">
                        {showPasswords ? 'password123' : '••••••••••'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusConfig[account.status].variant}>
                        {statusConfig[account.status].label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {account.lastLogin || 'Never'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
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

interface ParsedAccount {
  email: string
  password: string
  imapUser?: string
  imapPass?: string
}

function parseAccountLine(line: string): ParsedAccount | null {
  const parts = line.trim().split(':')
  if (parts.length < 2) return null
  
  return {
    email: parts[0],
    password: parts[1],
    imapUser: parts[2] || undefined,
    imapPass: parts[3] || undefined,
  }
}

function AddAccountForm({ onClose }: { onClose: () => void }) {
  const [site, setSite] = useState<'AMAZON' | 'CARREFOUR'>('AMAZON')
  const [bulkInput, setBulkInput] = useState('')
  const [parsedAccounts, setParsedAccounts] = useState<ParsedAccount[]>([])
  const [parseError, setParseError] = useState('')

  const handleBulkParse = () => {
    const lines = bulkInput.split('\n').filter(l => l.trim())
    const parsed: ParsedAccount[] = []
    const errors: string[] = []

    lines.forEach((line, index) => {
      const account = parseAccountLine(line)
      if (account) {
        parsed.push(account)
      } else {
        errors.push(`Ligne ${index + 1}: Format invalide`)
      }
    })

    setParsedAccounts(parsed)
    setParseError(errors.length > 0 ? errors.join(', ') : '')
  }

  const handleBulkImport = async () => {
    if (parsedAccounts.length === 0) return

    const accounts = parsedAccounts.map(acc => ({
      store: site,
      email: acc.email,
      password: acc.password,
      imapConfig: acc.imapUser && acc.imapPass ? {
        host: acc.email.includes('gmail') ? 'imap.gmail.com' : 'imap.mail.yahoo.com',
        port: 993,
        user: acc.imapUser,
        pass: acc.imapPass,
      } : null,
    }))

    try {
      await fetch('/api/bot/accounts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts }),
      })
      onClose()
    } catch (error) {
      console.error('Import failed:', error)
    }
  }

  return (
    <Tabs defaultValue="manual" className="py-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="manual">Manual</TabsTrigger>
        <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="manual" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label>Site</Label>
          <Select value={site} onValueChange={(v) => setSite(v as 'AMAZON' | 'CARREFOUR')}>
            <SelectTrigger className="bg-cyber-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AMAZON">Amazon</SelectItem>
              <SelectItem value="CARREFOUR">Carrefour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input placeholder="email@example.com" className="bg-cyber-body" />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" className="bg-cyber-body" />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="cyber" onClick={onClose}>Add Account</Button>
        </div>
      </TabsContent>

      <TabsContent value="bulk" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label>Site</Label>
          <Select value={site} onValueChange={(v) => setSite(v as 'AMAZON' | 'CARREFOUR')}>
            <SelectTrigger className="bg-cyber-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AMAZON">Amazon</SelectItem>
              <SelectItem value="CARREFOUR">Carrefour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Format: email:password:imapUser:imapPass</Label>
          <Textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder={`user1@gmail.com:password123:user1@gmail.com:appPassword1
user2@outlook.com:pass456
user3@yahoo.com:secret789:user3@yahoo.com:imapPass3`}
            className="bg-cyber-body font-mono text-xs h-32"
          />
          <p className="text-xs text-muted-foreground">
            Format: <code>email:password</code> ou <code>email:password:imapUser:imapPass</code>
          </p>
        </div>

        <Button variant="secondary" onClick={handleBulkParse} className="w-full">
          Parser ({bulkInput.split('\n').filter(l => l.trim()).length} lignes)
        </Button>

        {parseError && (
          <p className="text-xs text-red-400">{parseError}</p>
        )}

        {parsedAccounts.length > 0 && (
          <div className="space-y-2">
            <Label>Aperçu ({parsedAccounts.length} comptes)</Label>
            <div className="max-h-32 overflow-auto bg-cyber-body rounded-lg p-2 space-y-1">
              {parsedAccounts.slice(0, 5).map((acc, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-primary">✓</span>
                  <span>{acc.email}</span>
                  {acc.imapUser && (
                    <Badge variant="outline" className="text-xs">IMAP</Badge>
                  )}
                </div>
              ))}
              {parsedAccounts.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  ... et {parsedAccounts.length - 5} autres
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button 
            variant="cyber" 
            onClick={handleBulkImport}
            disabled={parsedAccounts.length === 0}
          >
            Importer {parsedAccounts.length} comptes
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            2FA Secret (TOTP)
          </Label>
          <Input placeholder="JBSWY3DPEHPK3PXP" className="bg-cyber-body font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            IMAP Configuration
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="imap.gmail.com" className="bg-cyber-body" />
            <Input placeholder="993" className="bg-cyber-body" />
          </div>
          <Input placeholder="IMAP Username" className="bg-cyber-body" />
          <Input type="password" placeholder="IMAP Password" className="bg-cyber-body" />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Cookie className="h-4 w-4" />
            Session Cookies (JSON)
          </Label>
          <Textarea
            placeholder='[{"name": "session-id", "value": "..."}]'
            className="bg-cyber-body font-mono text-xs h-24"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="cyber" onClick={onClose}>Save Account</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
