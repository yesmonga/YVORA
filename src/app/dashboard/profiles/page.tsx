'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, maskCardNumber } from '@/lib/utils'
import { Plus, CreditCard, Edit, Trash2, Copy, Wand2 } from 'lucide-react'

interface Profile {
  id: string
  name: string
  shippingFirstName: string
  shippingLastName: string
  shippingCity: string
  shippingCountry: string
  cardLast4: string
  cardType: string
  autoJig: boolean
}

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Main Profile',
    shippingFirstName: 'John',
    shippingLastName: 'Doe',
    shippingCity: 'Paris',
    shippingCountry: 'FR',
    cardLast4: '4242',
    cardType: 'visa',
    autoJig: true,
  },
  {
    id: '2',
    name: 'Backup Profile',
    shippingFirstName: 'Jane',
    shippingLastName: 'Smith',
    shippingCity: 'Lyon',
    shippingCountry: 'FR',
    cardLast4: '1234',
    cardType: 'mastercard',
    autoJig: false,
  },
  {
    id: '3',
    name: 'Family Account',
    shippingFirstName: 'Marie',
    shippingLastName: 'Dupont',
    shippingCity: 'Marseille',
    shippingCountry: 'FR',
    cardLast4: '5678',
    cardType: 'visa',
    autoJig: true,
  },
]

export default function ProfilesPage() {
  const [profiles] = useState(mockProfiles)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profiles</h1>
          <p className="text-muted-foreground">
            Manage your billing and shipping profiles
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="cyber" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Profile</DialogTitle>
            </DialogHeader>
            <CreateProfileForm onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="cyber-card p-4 hover:border-primary/50 transition-all group"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.shippingFirstName} {profile.shippingLastName}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Card Visual */}
            <div
              className={cn(
                'relative rounded-lg p-4 mb-4 bg-gradient-to-br',
                profile.cardType === 'visa'
                  ? 'from-blue-600 to-blue-800'
                  : 'from-orange-600 to-red-700'
              )}
            >
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
                •••• •••• •••• {profile.cardLast4}
              </p>
              <div className="flex justify-between text-sm text-white/80">
                <span>
                  {profile.shippingFirstName} {profile.shippingLastName}
                </span>
                <span className="uppercase">{profile.cardType}</span>
              </div>
            </div>

            {/* Location */}
            <div className="text-sm text-muted-foreground">
              📍 {profile.shippingCity}, {profile.shippingCountry}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CreateProfileForm({ onClose }: { onClose: () => void }) {
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [autoJig, setAutoJig] = useState(false)

  return (
    <div className="space-y-6 py-4">
      {/* Profile Name */}
      <div className="space-y-2">
        <Label>Profile Name</Label>
        <Input placeholder="e.g. Main Profile" className="bg-cyber-body" />
      </div>

      {/* Shipping Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Shipping Address
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input placeholder="John" className="bg-cyber-body" />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input placeholder="Doe" className="bg-cyber-body" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Address Line 1</Label>
          <Input placeholder="123 Main Street" className="bg-cyber-body" />
        </div>
        <div className="space-y-2">
          <Label>Address Line 2 (Optional)</Label>
          <Input placeholder="Apt 4B" className="bg-cyber-body" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input placeholder="Paris" className="bg-cyber-body" />
          </div>
          <div className="space-y-2">
            <Label>State/Region</Label>
            <Input placeholder="Île-de-France" className="bg-cyber-body" />
          </div>
          <div className="space-y-2">
            <Label>Postal Code</Label>
            <Input placeholder="75001" className="bg-cyber-body" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select defaultValue="FR">
              <SelectTrigger className="bg-cyber-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+33 6 12 34 56 78" className="bg-cyber-body" />
          </div>
        </div>

        {/* Auto-Jig Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-body">
          <div className="flex items-center gap-3">
            <Wand2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Auto-Jig Address</p>
              <p className="text-xs text-muted-foreground">
                Slightly modify address to bypass limitations
              </p>
            </div>
          </div>
          <Switch checked={autoJig} onCheckedChange={setAutoJig} />
        </div>
      </div>

      {/* Billing Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="sameAsShipping"
            checked={sameAsShipping}
            onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
          />
          <Label htmlFor="sameAsShipping">Same as shipping address</Label>
        </div>

        {!sameAsShipping && (
          <div className="space-y-4 p-4 rounded-lg border border-cyber-border">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Billing Address
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="John" className="bg-cyber-body" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Doe" className="bg-cyber-body" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="123 Main Street" className="bg-cyber-body" />
            </div>
          </div>
        )}
      </div>

      {/* Payment Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Payment Information
        </h3>
        <div className="space-y-2">
          <Label>Cardholder Name</Label>
          <Input placeholder="JOHN DOE" className="bg-cyber-body" />
        </div>
        <div className="space-y-2">
          <Label>Card Number</Label>
          <Input placeholder="4242 4242 4242 4242" className="bg-cyber-body" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Exp Month</Label>
            <Select>
              <SelectTrigger className="bg-cyber-body">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Exp Year</Label>
            <Select>
              <SelectTrigger className="bg-cyber-body">
                <SelectValue placeholder="YY" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i} value={String(24 + i)}>
                    20{24 + i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>CVV</Label>
            <Input
              type="password"
              placeholder="•••"
              maxLength={4}
              className="bg-cyber-body"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-cyber-border">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="cyber" onClick={onClose}>
          Create Profile
        </Button>
      </div>
    </div>
  )
}
