'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useTaskStore, type Task, type TaskGroup } from '@/store/tasks'
import {
  Plus,
  FolderPlus,
  Play,
  Square,
  Trash2,
  Copy,
  Edit,
  MoreHorizontal,
  Search,
  ShoppingBag,
  Store,
} from 'lucide-react'

const mockTaskGroups: TaskGroup[] = [
  { id: '1', name: 'All Tasks', color: '#2bea8e', taskCount: 24 },
  { id: '2', name: 'Drop PS5', color: '#f59e0b', taskCount: 8 },
  { id: '3', name: 'Carrefour Mardi', color: '#3b82f6', taskCount: 6 },
  { id: '4', name: 'Amazon Daily', color: '#8b5cf6', taskCount: 10 },
]

const mockTasks: Task[] = [
  {
    id: 'T001',
    taskGroupId: '1',
    site: 'amazon',
    productName: 'PlayStation 5 Console',
    productImage: '',
    quantity: 1,
    status: 'idle',
    profileName: 'Main Profile',
    proxyGroupName: 'US Residential',
    asin: 'B09DFCB66S',
    amazonRegion: 'FR',
    amazonMode: 'preload',
  },
  {
    id: 'T002',
    taskGroupId: '1',
    site: 'amazon',
    productName: 'RTX 4090 Graphics Card',
    productImage: '',
    quantity: 1,
    status: 'starting',
    profileName: 'Backup Profile',
    proxyGroupName: 'EU Datacenter',
    asin: 'B0BG95N8RZ',
    amazonRegion: 'DE',
    amazonMode: 'fast',
  },
  {
    id: 'T003',
    taskGroupId: '1',
    site: 'carrefour',
    productName: 'iPhone 15 Pro Max',
    productImage: '',
    quantity: 2,
    status: 'carting',
    profileName: 'Main Profile',
    proxyGroupName: 'FR Residential',
    carrefourMode: 'drive',
    zipCode: '75001',
  },
  {
    id: 'T004',
    taskGroupId: '1',
    site: 'amazon',
    productName: 'Steam Deck 512GB',
    productImage: '',
    quantity: 1,
    status: 'success',
    profileName: 'Main Profile',
    proxyGroupName: 'US Residential',
    asin: 'B0BN5QBLZM',
    amazonRegion: 'FR',
    amazonMode: 'normal',
  },
  {
    id: 'T005',
    taskGroupId: '1',
    site: 'carrefour',
    productName: 'Nintendo Switch OLED',
    productImage: '',
    quantity: 1,
    status: 'error',
    statusMessage: 'Out of stock',
    profileName: 'Backup Profile',
    proxyGroupName: 'FR Residential',
    carrefourMode: 'delivery',
  },
]

const statusConfig: Record<string, { label: string; class: string }> = {
  idle: { label: 'Idle', class: 'status-idle' },
  starting: { label: 'Starting', class: 'status-starting' },
  monitoring: { label: 'Monitoring', class: 'status-monitoring' },
  carting: { label: 'Carting', class: 'status-carting' },
  checkout: { label: 'Checkout', class: 'status-checkout' },
  success: { label: 'Success', class: 'status-success' },
  error: { label: 'Error', class: 'status-error' },
}

export default function TasksPage() {
  const [selectedGroup, setSelectedGroup] = useState<string>('1')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [taskGroups] = useState(mockTaskGroups)
  const [tasks] = useState(mockTasks)

  const filteredTasks = tasks.filter(
    (task) =>
      task.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.asin?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    )
  }

  const toggleAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map((t) => t.id))
    }
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Task Groups Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="cyber-card h-full flex flex-col">
          <div className="p-4 border-b border-cyber-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Task Groups</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {taskGroups.map((group) => (
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
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="text-sm">{group.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {group.taskCount}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Tasks Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 bg-cyber-card"
              />
            </div>
            {selectedTasks.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Play className="h-3 w-3" />
                  Start ({selectedTasks.length})
                </Button>
                <Button variant="secondary" size="sm" className="gap-2">
                  <Square className="h-3 w-3" />
                  Stop
                </Button>
                <Button variant="secondary" size="sm" className="gap-2">
                  <Copy className="h-3 w-3" />
                  Clone
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            )}
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button variant="cyber" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <CreateTaskForm onClose={() => setIsCreateModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks Table */}
        <div className="cyber-card flex-1 overflow-hidden">
          <div className="overflow-auto h-full">
            <table className="w-full">
              <thead className="bg-cyber-body sticky top-0">
                <tr className="border-b border-cyber-border">
                  <th className="p-4 w-12">
                    <Checkbox
                      checked={
                        selectedTasks.length === filteredTasks.length &&
                        filteredTasks.length > 0
                      }
                      onCheckedChange={toggleAllTasks}
                    />
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    ID
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Site
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Product
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Mode
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Profile
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Proxy
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-cyber-border hover:bg-cyber-border/30 transition-colors"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => toggleTaskSelection(task.id)}
                      />
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono text-muted-foreground">
                        {task.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {task.site === 'amazon' ? (
                          <div className="p-1.5 rounded bg-orange-500/20">
                            <ShoppingBag className="h-4 w-4 text-orange-400" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded bg-blue-500/20">
                            <Store className="h-4 w-4 text-blue-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">
                          {task.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {task.asin || task.carrefourPid || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm capitalize">
                        {task.amazonMode || task.carrefourMode || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{task.profileName}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {task.proxyGroupName}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={cn(
                          'text-xs',
                          statusConfig[task.status]?.class
                        )}
                      >
                        {statusConfig[task.status]?.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          {task.status === 'idle' ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
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

function CreateTaskForm({ onClose }: { onClose: () => void }) {
  const [site, setSite] = useState<'amazon' | 'carrefour'>('amazon')
  const [amazonMode, setAmazonMode] = useState('normal')
  const [carrefourMode, setCarrefourMode] = useState('drive')

  return (
    <div className="space-y-6 py-4">
      {/* Site Selection */}
      <div className="space-y-2">
        <Label>Site</Label>
        <div className="flex gap-3">
          <button
            onClick={() => setSite('amazon')}
            className={cn(
              'flex-1 p-4 rounded-lg border-2 transition-all',
              site === 'amazon'
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-cyber-border hover:border-cyber-border/80'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-orange-500/20">
                <ShoppingBag className="h-5 w-5 text-orange-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">Amazon</p>
                <p className="text-xs text-muted-foreground">
                  FR, DE, IT, ES, UK
                </p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setSite('carrefour')}
            className={cn(
              'flex-1 p-4 rounded-lg border-2 transition-all',
              site === 'carrefour'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-cyber-border hover:border-cyber-border/80'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-blue-500/20">
                <Store className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">Carrefour</p>
                <p className="text-xs text-muted-foreground">Drive & Delivery</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Amazon Fields */}
      {site === 'amazon' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ASIN</Label>
              <Input placeholder="B09DFCB66S" className="bg-cyber-body" />
            </div>
            <div className="space-y-2">
              <Label>Offer ID (Optional)</Label>
              <Input placeholder="For Fast mode" className="bg-cyber-body" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select defaultValue="FR">
                <SelectTrigger className="bg-cyber-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FR">France (amazon.fr)</SelectItem>
                  <SelectItem value="DE">Germany (amazon.de)</SelectItem>
                  <SelectItem value="IT">Italy (amazon.it)</SelectItem>
                  <SelectItem value="ES">Spain (amazon.es)</SelectItem>
                  <SelectItem value="UK">UK (amazon.co.uk)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mode</Label>
              <Select value={amazonMode} onValueChange={setAmazonMode}>
                <SelectTrigger className="bg-cyber-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preload">
                    Preload (Cart & Wait)
                  </SelectItem>
                  <SelectItem value="normal">Normal (Standard Flow)</SelectItem>
                  <SelectItem value="fast">Fast (Direct Checkout)</SelectItem>
                  <SelectItem value="scrape">Scrape (Monitor Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Max Price (€)</Label>
            <Input
              type="number"
              placeholder="Leave empty for no limit"
              className="bg-cyber-body"
            />
          </div>
        </>
      )}

      {/* Carrefour Fields */}
      {site === 'carrefour' && (
        <>
          <div className="space-y-2">
            <Label>Product ID / URL</Label>
            <Input
              placeholder="Enter product URL or ID"
              className="bg-cyber-body"
            />
          </div>
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select value={carrefourMode} onValueChange={setCarrefourMode}>
              <SelectTrigger className="bg-cyber-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drive">Drive (Pick-up)</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {carrefourMode === 'drive' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input placeholder="75001" className="bg-cyber-body" />
              </div>
              <div className="space-y-2">
                <Label>Slot Preference</Label>
                <Select defaultValue="morning">
                  <SelectTrigger className="bg-cyber-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Checkbox id="substitutions" />
            <Label htmlFor="substitutions" className="text-sm">
              Allow Substitutions
            </Label>
          </div>
        </>
      )}

      {/* Common Fields */}
      <div className="border-t border-cyber-border pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Profile</Label>
            <Select>
              <SelectTrigger className="bg-cyber-body">
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Profile</SelectItem>
                <SelectItem value="backup">Backup Profile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Proxy Group</Label>
            <Select>
              <SelectTrigger className="bg-cyber-body">
                <SelectValue placeholder="Select proxies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-res">US Residential</SelectItem>
                <SelectItem value="eu-dc">EU Datacenter</SelectItem>
                <SelectItem value="fr-res">FR Residential</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              defaultValue={1}
              min={1}
              className="bg-cyber-body"
            />
          </div>
          <div className="space-y-2">
            <Label>Account Group</Label>
            <Select>
              <SelectTrigger className="bg-cyber-body">
                <SelectValue placeholder="Select account group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Accounts</SelectItem>
                <SelectItem value="backup">Backup Accounts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Scheduled Start (Optional)</Label>
          <Input type="datetime-local" className="bg-cyber-body" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-cyber-border">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="cyber" onClick={onClose}>
          Create Task
        </Button>
      </div>
    </div>
  )
}
