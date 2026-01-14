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
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newProfile, setNewProfile] = useState({
    name: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress1: '',
    shippingCity: '',
    shippingZip: '',
    shippingCountry: 'FR',
    shippingPhone: '',
    cardHolder: '',
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCvv: '',
  })

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

  const createProfile = async () => {
    if (!newProfile.name || !newProfile.shippingFirstName) return
    setCreating(true)
    try {
      const res = await fetch('/api/bot/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProfile, userId: 'default' }),
      })
      if (res.ok) {
        await fetchProfiles()
        setIsCreateOpen(false)
        setNewProfile({
          name: '', shippingFirstName: '', shippingLastName: '', shippingAddress1: '',
          shippingCity: '', shippingZip: '', shippingCountry: 'FR', shippingPhone: '',
          cardHolder: '', cardNumber: '', cardExpMonth: '', cardExpYear: '', cardCvv: '',
        })
      }
    } catch (error) {
      console.error('Failed to create profile:', error)
    } finally {
      setCreating(false)
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
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="cyber" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Profile Name</Label>
                <Input placeholder="Main Profile" value={newProfile.name} onChange={(e) => setNewProfile({...newProfile, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" value={newProfile.shippingFirstName} onChange={(e) => setNewProfile({...newProfile, shippingFirstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" value={newProfile.shippingLastName} onChange={(e) => setNewProfile({...newProfile, shippingLastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="123 Main Street" value={newProfile.shippingAddress1} onChange={(e) => setNewProfile({...newProfile, shippingAddress1: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input placeholder="Paris" value={newProfile.shippingCity} onChange={(e) => setNewProfile({...newProfile, shippingCity: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Zip</Label>
                  <Input placeholder="75001" value={newProfile.shippingZip} onChange={(e) => setNewProfile({...newProfile, shippingZip: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+33 6 12 34 56 78" value={newProfile.shippingPhone} onChange={(e) => setNewProfile({...newProfile, shippingPhone: e.target.value})} />
                </div>
              </div>
              <hr className="border-yvora-border" />
              <div className="space-y-2">
                <Label>Card Holder</Label>
                <Input placeholder="JOHN DOE" value={newProfile.cardHolder} onChange={(e) => setNewProfile({...newProfile, cardHolder: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input placeholder="4242 4242 4242 4242" value={newProfile.cardNumber} onChange={(e) => setNewProfile({...newProfile, cardNumber: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Exp Month</Label>
                  <Input placeholder="12" value={newProfile.cardExpMonth} onChange={(e) => setNewProfile({...newProfile, cardExpMonth: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Exp Year</Label>
                  <Input placeholder="25" value={newProfile.cardExpYear} onChange={(e) => setNewProfile({...newProfile, cardExpYear: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input type="password" placeholder="***" value={newProfile.cardCvv} onChange={(e) => setNewProfile({...newProfile, cardCvv: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button variant="cyber" onClick={createProfile} disabled={creating || !newProfile.name}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Profile'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
