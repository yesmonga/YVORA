'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Settings,
  Bell,
  Shield,
  Webhook,
  Cpu,
  Save,
  RefreshCw,
} from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoRetry, setAutoRetry] = useState(true)

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your bot preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-2">
            <Cpu className="h-4 w-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="cyber-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">General Settings</h2>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Select color theme</p>
                </div>
                <Select defaultValue="dark">
                  <SelectTrigger className="w-40 bg-cyber-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark (Cyber)</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">Interface language</p>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-40 bg-cyber-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="cyber-card p-6 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              License
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>License Key</Label>
                <div className="flex gap-2">
                  <Input value="XXXX-XXXX-XXXX-XXXX" readOnly className="bg-cyber-body font-mono" />
                  <Button variant="secondary">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-primary">✓ Lifetime License - All features unlocked</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="cyber-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Notifications</p>
                  <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound Effects</p>
                  <p className="text-sm text-muted-foreground">Play sounds on events</p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="cyber-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Automation Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Retry on Error</p>
                  <p className="text-sm text-muted-foreground">Automatically retry failed tasks</p>
                </div>
                <Switch checked={autoRetry} onCheckedChange={setAutoRetry} />
              </div>
              <div className="space-y-2">
                <Label>Retry Delay (seconds)</Label>
                <Input type="number" defaultValue={5} className="bg-cyber-body w-32" />
              </div>
              <div className="space-y-2">
                <Label>Max Retries</Label>
                <Input type="number" defaultValue={3} className="bg-cyber-body w-32" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="cyber-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Discord Webhooks</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Success Webhook</Label>
                <Input placeholder="https://discord.com/api/webhooks/..." className="bg-cyber-body" />
              </div>
              <div className="space-y-2">
                <Label>Error Webhook</Label>
                <Input placeholder="https://discord.com/api/webhooks/..." className="bg-cyber-body" />
              </div>
              <Button variant="secondary" className="gap-2">
                <Bell className="h-4 w-4" />
                Test Webhooks
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button variant="cyber" className="gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
