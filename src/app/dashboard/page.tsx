'use client'

import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp,
  ShoppingCart,
  Zap,
  Target
} from 'lucide-react'

const stats = [
  {
    label: 'Total Tasks',
    value: '247',
    change: '+12%',
    icon: Target,
    color: 'text-primary',
  },
  {
    label: 'Success Rate',
    value: '94.2%',
    change: '+2.1%',
    icon: TrendingUp,
    color: 'text-green-500',
  },
  {
    label: 'Active Now',
    value: '18',
    change: '',
    icon: Activity,
    color: 'text-yellow-500',
  },
  {
    label: 'Checkouts Today',
    value: '32',
    change: '+8',
    icon: ShoppingCart,
    color: 'text-blue-500',
  },
]

const recentActivity = [
  { id: 1, product: 'PS5 Console', site: 'Amazon', status: 'success', time: '2 min ago' },
  { id: 2, product: 'RTX 4090', site: 'Amazon', status: 'success', time: '5 min ago' },
  { id: 3, product: 'iPhone 15 Pro', site: 'Carrefour', status: 'error', time: '8 min ago' },
  { id: 4, product: 'Air Jordan 1', site: 'Amazon', status: 'success', time: '12 min ago' },
  { id: 5, product: 'Steam Deck', site: 'Amazon', status: 'success', time: '15 min ago' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your automation performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="cyber-card p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-primary mt-1">{stat.change}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-cyber-body ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="cyber-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-cyber-body"
              >
                <div className="flex items-center gap-3">
                  {item.status === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-xs text-muted-foreground">{item.site}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="cyber-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">System Status</h2>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-body">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Bot Engine</span>
              </div>
              <span className="text-xs text-primary">Running</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-body">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Proxy Pool</span>
              </div>
              <span className="text-xs text-primary">127 Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-body">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Captcha Solver</span>
              </div>
              <span className="text-xs text-primary">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-body">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                <span>Discord Webhooks</span>
              </div>
              <span className="text-xs text-yellow-500">1 Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-body">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Accounts</span>
              </div>
              <span className="text-xs text-muted-foreground">24 Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
