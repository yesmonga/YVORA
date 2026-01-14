'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sparkles,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  ShoppingBag,
  Store,
} from 'lucide-react'

interface LogEntry {
  id: string
  time: string
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
}

const mockLogs: LogEntry[] = [
  { id: '1', time: '14:32:15', type: 'info', message: 'Starting account generation...' },
  { id: '2', time: '14:32:16', type: 'info', message: 'Generating email: user_38291@catchall.io' },
  { id: '3', time: '14:32:18', type: 'success', message: 'Email verified successfully' },
  { id: '4', time: '14:32:20', type: 'info', message: 'Requesting SMS verification...' },
  { id: '5', time: '14:32:25', type: 'success', message: 'SMS code received: 482917' },
  { id: '6', time: '14:32:28', type: 'success', message: 'Account created: user_38291@catchall.io' },
  { id: '7', time: '14:32:30', type: 'info', message: 'Generating email: user_48291@catchall.io' },
  { id: '8', time: '14:32:35', type: 'error', message: 'SMS verification timeout - retrying...' },
  { id: '9', time: '14:32:40', type: 'warning', message: 'Rate limit detected, waiting 30s...' },
]

export default function GeneratorPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [quantity, setQuantity] = useState([10])
  const [verifyPhone, setVerifyPhone] = useState(true)
  const [logs] = useState(mockLogs)

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* Configuration Panel */}
      <div className="cyber-card p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Account Generator</h2>
            <p className="text-sm text-muted-foreground">
              Automated account creation
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label>Service</Label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-lg border-2 border-orange-500 bg-orange-500/10 transition-all">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-orange-400" />
                  <span className="font-medium">Amazon</span>
                </div>
              </button>
              <button className="p-4 rounded-lg border-2 border-cyber-border hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-blue-400" />
                  <span className="font-medium">Carrefour</span>
                </div>
              </button>
            </div>
          </div>

          {/* Email Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Configuration
            </h3>
            <div className="space-y-2">
              <Label>Catchall Domain</Label>
              <Input
                placeholder="@yourdomaine.com"
                className="bg-cyber-body"
              />
            </div>
            <div className="space-y-2">
              <Label>Master Email (Forwarding)</Label>
              <Input
                placeholder="master@gmail.com"
                className="bg-cyber-body"
              />
            </div>
          </div>

          {/* SMS Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Phone className="h-4 w-4" />
              SMS Verification
            </h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-body">
              <div>
                <p className="font-medium text-sm">Verify Phone Number</p>
                <p className="text-xs text-muted-foreground">
                  Use SMS service for verification
                </p>
              </div>
              <Switch checked={verifyPhone} onCheckedChange={setVerifyPhone} />
            </div>
            {verifyPhone && (
              <>
                <div className="space-y-2">
                  <Label>SMS Provider</Label>
                  <Select defaultValue="5sim">
                    <SelectTrigger className="bg-cyber-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5sim">5sim.net</SelectItem>
                      <SelectItem value="smsactivate">SMS-Activate</SelectItem>
                      <SelectItem value="smspva">SMSPVA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>SMS API Key</Label>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    className="bg-cyber-body"
                  />
                </div>
              </>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Quantity</Label>
              <span className="text-2xl font-bold text-primary">{quantity[0]}</span>
            </div>
            <Slider
              value={quantity}
              onValueChange={setQuantity}
              min={1}
              max={100}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button
          variant="cyber"
          size="lg"
          className="w-full mt-6 h-14 text-lg gap-3"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? (
            <>
              <Square className="h-5 w-5" />
              Stop Generation
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Start Generation
            </>
          )}
        </Button>
      </div>

      {/* Logs Panel */}
      <div className="cyber-card flex flex-col">
        <div className="p-4 border-b border-cyber-border flex items-center justify-between">
          <h2 className="font-semibold">Generation Logs</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-primary">
              <CheckCircle2 className="h-4 w-4" />5
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <XCircle className="h-4 w-4" />1
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              <Clock className="h-4 w-4" />3
            </span>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2 font-mono text-sm">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2 rounded bg-cyber-body"
              >
                <span className="text-muted-foreground">[{log.time}]</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-primary'
                      : log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'warning'
                      ? 'text-yellow-400'
                      : 'text-muted-foreground'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
