'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus, CreditCard, Trash2, Wand2, Loader2 } from 'lucide-react'

interface Profile {
  id: string
  name: string
  shippingFirstName: string
  shippingLastName: string
  shippingCity: string
  shippingCountry: string
  cardNumber?: string
  autoJig: boolean
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/bot/profiles')
      if (res.ok) {
        const data = await res.json()
        setProfiles(data)
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProfile = async (profileId: string) => {
    try {
      const res = await fetch(`/api/bot/profiles/${profileId}`, { method: 'DELETE' })
      if (res.ok) {
        setProfiles(profiles.filter(p => p.id !== profileId))
      }
    } catch (error) {
      console.error('Failed to delete profile:', error)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profiles</h1>
          <p className="text-muted-foreground">
            Manage your billing and shipping profiles
          </p>
        </div>
        <Button variant="cyber" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Profile
        </Button>
      </div>

      {profiles.length === 0 ? (
        <div className="yvora-card p-8 text-center text-muted-foreground">
          No profiles yet. Click "Create Profile" to add one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="yvora-card p-4 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.shippingFirstName} {profile.shippingLastName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteProfile(profile.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative rounded-lg p-4 mb-4 bg-gradient-to-br from-purple-600 to-purple-800">
                <div className="flex items-center justify-between mb-6">
                  <CreditCard className="h-8 w-8 text-white/80" />
                  {profile.autoJig && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 text-xs text-white">
                      <Wand2 className="h-3 w-3" />
                      Auto-Jig
                    </div>
                  )}
                </div>
                <p className="font-mono text-lg text-white tracking-wider mb-2">
                  •••• •••• •••• ****
                </p>
                <div className="flex justify-between text-sm text-white/80">
                  <span>{profile.shippingFirstName} {profile.shippingLastName}</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                📍 {profile.shippingCity || 'N/A'}, {profile.shippingCountry || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
