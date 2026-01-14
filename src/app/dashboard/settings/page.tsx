'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Play,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Link,
  MessageSquare,
  Shield,
} from 'lucide-react'

interface Webhook {
  id: string
  name: string
  url: string
  status: string
}

export default function SettingsPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [twoCaptchaKey, setTwoCaptchaKey] = useState('')
  const [heroSmsKey, setHeroSmsKey] = useState('')
  const [twoCaptchaBalance, setTwoCaptchaBalance] = useState<string | null>(null)
  const [heroSmsBalance, setHeroSmsBalance] = useState<string | null>(null)
  const [checkingTwoCaptcha, setCheckingTwoCaptcha] = useState(false)
  const [checkingHeroSms, setCheckingHeroSms] = useState(false)
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null)
  const [isAddWebhookOpen, setIsAddWebhookOpen] = useState(false)
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '' })
  const [addingWebhook, setAddingWebhook] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setTwoCaptchaKey(data.twoCaptchaKey || '')
        setHeroSmsKey(data.heroSmsKey || '')
        setWebhooks(data.webhooks || [])
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const checkTwoCaptchaBalance = async () => {
    if (!twoCaptchaKey) return
    setCheckingTwoCaptcha(true)
    setTwoCaptchaBalance(null)
    try {
      const res = await fetch('/api/settings/test-2captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: twoCaptchaKey }),
      })
      const data = await res.json()
      if (data.balance !== undefined) {
        setTwoCaptchaBalance(`$${data.balance.toFixed(2)}`)
      } else {
        setTwoCaptchaBalance('Error: ' + (data.error || 'Invalid key'))
      }
    } catch {
      setTwoCaptchaBalance('Error: Connection failed')
    } finally {
      setCheckingTwoCaptcha(false)
    }
  }

  const checkHeroSmsBalance = async () => {
    if (!heroSmsKey) return
    setCheckingHeroSms(true)
    setHeroSmsBalance(null)
    try {
      const res = await fetch('/api/settings/test-herosms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: heroSmsKey }),
      })
      const data = await res.json()
      if (data.balance !== undefined) {
        setHeroSmsBalance(`$${data.balance}`)
      } else {
        setHeroSmsBalance('Error: ' + (data.error || 'Invalid key'))
      }
    } catch {
      setHeroSmsBalance('Error: Connection failed')
    } finally {
      setCheckingHeroSms(false)
    }
  }

  const testWebhook = async (webhook: Webhook) => {
    setTestingWebhook(webhook.id)
    try {
      const res = await fetch('/api/settings/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhook.url, name: webhook.name }),
      })
      if (res.ok) {
        setWebhooks(webhooks.map(w => w.id === webhook.id ? { ...w, status: 'Active' } : w))
      } else {
        setWebhooks(webhooks.map(w => w.id === webhook.id ? { ...w, status: 'Failed' } : w))
      }
    } catch {
      setWebhooks(webhooks.map(w => w.id === webhook.id ? { ...w, status: 'Failed' } : w))
    } finally {
      setTestingWebhook(null)
    }
  }

  const addWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url) return
    setAddingWebhook(true)
    try {
      const res = await fetch('/api/settings/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWebhook),
      })
      if (res.ok) {
        const webhook = await res.json()
        setWebhooks([...webhooks, webhook])
        setNewWebhook({ name: '', url: '' })
        setIsAddWebhookOpen(false)
      }
    } catch (error) {
      console.error('Failed to add webhook:', error)
    } finally {
      setAddingWebhook(false)
    }
  }

  const deleteWebhook = async (id: string) => {
    try {
      const res = await fetch(`/api/settings/webhooks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setWebhooks(webhooks.filter(w => w.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete webhook:', error)
    }
  }

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const saveApiKeys = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twoCaptchaKey, heroSmsKey }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure webhooks, captcha, and SMS providers</p>
      </div>

      {/* Discord Webhooks */}
      <div className="yvora-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Discord Webhooks</h2>
        </div>
        <p className="text-sm text-muted-foreground">Create and test all the webhooks you'll need</p>
        
        <div className="overflow-hidden rounded-lg border border-yvora-border">
          <table className="w-full">
            <thead className="bg-yvora-body">
              <tr className="border-b border-yvora-border">
                <th className="p-3 text-left text-xs font-medium text-muted-foreground">#</th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                  <Link className="h-4 w-4 inline mr-1" /> Webhook
                </th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No webhooks configured
                  </td>
                </tr>
              ) : (
                webhooks.map((webhook, index) => (
                  <tr key={webhook.id} className="border-b border-yvora-border hover:bg-yvora-border/30">
                    <td className="p-3 text-sm">{index + 1}</td>
                    <td className="p-3 text-sm">{webhook.name}</td>
                    <td className="p-3 text-sm">
                      <span className={webhook.status === 'Active' ? 'text-green-400' : webhook.status === 'Failed' ? 'text-red-400' : 'text-muted-foreground'}>
                        {webhook.status || 'Idle'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-400"
                          onClick={() => testWebhook(webhook)}
                          disabled={testingWebhook === webhook.id}
                        >
                          {testingWebhook === webhook.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400"
                          onClick={() => deleteWebhook(webhook.id)}
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

        <Dialog open={isAddWebhookOpen} onOpenChange={setIsAddWebhookOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              ADD WEBHOOK
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Webhook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Success Notifications"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  placeholder="https://discord.com/api/webhooks/..."
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsAddWebhookOpen(false)}>Cancel</Button>
                <Button variant="cyber" onClick={addWebhook} disabled={addingWebhook || !newWebhook.name || !newWebhook.url}>
                  {addingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Webhook'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2Captcha */}
      <div className="yvora-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">2Captcha</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={checkTwoCaptchaBalance}
            disabled={checkingTwoCaptcha || !twoCaptchaKey}
          >
            {checkingTwoCaptcha ? <Loader2 className="h-4 w-4 animate-spin" /> : 'CHECK BALANCE'}
          </Button>
        </div>
        <Input
          placeholder="Your 2Captcha API Key"
          value={twoCaptchaKey}
          onChange={(e) => setTwoCaptchaKey(e.target.value)}
          onBlur={saveApiKeys}
          className="font-mono"
        />
        {twoCaptchaBalance && (
          <p className={`text-sm ${twoCaptchaBalance.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
            Balance: {twoCaptchaBalance}
          </p>
        )}
      </div>

      {/* Hero SMS */}
      <div className="yvora-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Hero SMS</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={checkHeroSmsBalance}
            disabled={checkingHeroSms || !heroSmsKey}
          >
            {checkingHeroSms ? <Loader2 className="h-4 w-4 animate-spin" /> : 'CHECK BALANCE'}
          </Button>
        </div>
        <Input
          placeholder="Your Hero SMS API Key"
          value={heroSmsKey}
          onChange={(e) => setHeroSmsKey(e.target.value)}
          onBlur={saveApiKeys}
          className="font-mono"
        />
        {heroSmsBalance && (
          <p className={`text-sm ${heroSmsBalance.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
            Balance: {heroSmsBalance}
          </p>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <Button variant="cyber" onClick={saveApiKeys} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save API Keys'}
        </Button>
        {saved && <span className="text-sm text-green-400">✓ Saved successfully!</span>}
      </div>
    </div>
  )
}
