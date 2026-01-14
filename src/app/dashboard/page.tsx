'use client'

import { useEffect, useState } from 'react'
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  ShoppingCart,
  Zap,
  Target,
  Users,
  Globe,
  Loader2
} from 'lucide-react'

interface Stats {
  totalTasks: number
  successTasks: number
  activeTasks: number
  totalProxies: number
  totalAccounts: number
  totalProfiles: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    successTasks: 0,
    activeTasks: 0,
    totalProxies: 0,
    totalAccounts: 0,
    totalProfiles: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const successRate = stats.totalTasks > 0 
    ? ((stats.successTasks / stats.totalTasks) * 100).toFixed(1) 
    : '0'

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks.toString(),
      icon: Target,
      color: 'text-primary',
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Active Now',
      value: stats.activeTasks.toString(),
      icon: Activity,
      color: 'text-yellow-500',
    },
    {
      label: 'Checkouts',
      value: stats.successTasks.toString(),
      icon: ShoppingCart,
      color: 'text-primary',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your automation performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="yvora-card p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-yvora-body ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="yvora-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Resources</h2>
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-yvora-body">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span>Profiles</span>
              </div>
              <span className="text-sm font-medium">{stats.totalProfiles}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yvora-body">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Accounts</span>
              </div>
              <span className="text-sm font-medium">{stats.totalAccounts}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yvora-body">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-green-500" />
                <span>Proxies</span>
              </div>
              <span className="text-sm font-medium">{stats.totalProxies}</span>
            </div>
          </div>
        </div>

        <div className="yvora-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">System Status</h2>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-yvora-body">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Bot Engine</span>
              </div>
              <span className="text-xs text-primary">Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yvora-body">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-gray-500" />
                <span>Captcha Solver</span>
              </div>
              <span className="text-xs text-muted-foreground">Not Configured</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yvora-body">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-gray-500" />
                <span>Discord Webhooks</span>
              </div>
              <span className="text-xs text-muted-foreground">Not Configured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
