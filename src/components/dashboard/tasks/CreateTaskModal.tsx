'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  amazonModes,
  carrefourModes,
  amazonRegions,
  slotPreferences,
} from '@/lib/validations/task'
import { ShoppingCart, Package, Loader2 } from 'lucide-react'

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TaskFormData) => Promise<void>
  profiles: Array<{ id: string; name: string }>
  proxyGroups: Array<{ id: string; name: string }>
  accountGroups: Array<{ id: string; name: string }>
  taskGroupId: string
}

const formSchema = z.object({
  store: z.enum(['AMAZON', 'CARREFOUR']),
  productSku: z.string().min(1, 'Requis'),
  mode: z.string().min(1, 'Requis'),
  profileId: z.string().min(1, 'Profile requis'),
  proxyGroupId: z.string().optional(),
  accountGroupId: z.string().optional(),
  quantity: z.number().min(1).max(20),
  priceLimit: z.number().optional(),
  // Amazon
  offerId: z.string().optional(),
  region: z.string().optional(),
  loginMethod: z.enum(['browser', 'request']).optional(),
  // Carrefour
  zipCode: z.string().optional(),
  slotPreference: z.string().optional(),
  allowSubstitution: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.store === 'AMAZON') {
    if (!data.region) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Région requise', path: ['region'] })
    }
    if (data.mode === 'FAST' && !data.offerId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'OfferID requis pour FAST', path: ['offerId'] })
    }
  }
  if (data.store === 'CARREFOUR' && data.mode === 'DRIVE') {
    if (!data.zipCode || data.zipCode.length < 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Code postal requis', path: ['zipCode'] })
    }
    if (!data.slotPreference) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Créneau requis', path: ['slotPreference'] })
    }
  }
})

type TaskFormData = z.infer<typeof formSchema>

export function CreateTaskModal({
  open,
  onOpenChange,
  onSubmit,
  profiles,
  proxyGroups,
  accountGroups,
  taskGroupId,
}: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store: 'AMAZON',
      quantity: 1,
      loginMethod: 'browser',
      allowSubstitution: false,
    },
  })

  const store = watch('store')
  const mode = watch('mode')

  useEffect(() => {
    if (store === 'AMAZON') {
      setValue('mode', 'NORMAL')
      setValue('region', 'fr')
    } else {
      setValue('mode', 'DRIVE')
    }
  }, [store, setValue])

  const handleFormSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      reset()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getModes = () => store === 'AMAZON' ? amazonModes : carrefourModes

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Créer une Tâche
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
          {/* Store Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue('store', 'AMAZON')}
              className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                store === 'AMAZON'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#FF9900] flex items-center justify-center">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <div className="text-left">
                <p className="font-semibold">Amazon</p>
                <p className="text-xs text-muted-foreground">FR, DE, IT, ES, UK</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setValue('store', 'CARREFOUR')}
              className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                store === 'CARREFOUR'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#004E9F] flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="text-left">
                <p className="font-semibold">Carrefour</p>
                <p className="text-xs text-muted-foreground">Drive & Delivery</p>
              </div>
            </button>
          </div>

          {/* Amazon Fields */}
          {store === 'AMAZON' && (
            <div className="space-y-4 p-4 rounded-lg bg-cyber-card border border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Configuration Amazon
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ASIN *</Label>
                  <Input
                    {...register('productSku')}
                    placeholder="B0XXXXXXXX"
                    className="bg-cyber-body font-mono"
                  />
                  {errors.productSku && (
                    <p className="text-xs text-red-500">{errors.productSku.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>OfferID {mode === 'FAST' && '*'}</Label>
                  <Input
                    {...register('offerId')}
                    placeholder="Optionnel (requis si FAST)"
                    className="bg-cyber-body font-mono"
                  />
                  {errors.offerId && (
                    <p className="text-xs text-red-500">{errors.offerId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Région *</Label>
                  <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-cyber-body">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {amazonRegions.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.region && (
                    <p className="text-xs text-red-500">{errors.region.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Mode *</Label>
                  <Controller
                    name="mode"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-cyber-body">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {amazonModes.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Méthode de Login</Label>
                <Controller
                  name="loginMethod"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-cyber-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="browser">Browser (Plus lent, plus sûr)</SelectItem>
                        <SelectItem value="request">Request (Rapide)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          )}

          {/* Carrefour Fields */}
          {store === 'CARREFOUR' && (
            <div className="space-y-4 p-4 rounded-lg bg-cyber-card border border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Configuration Carrefour
              </h3>

              <div className="space-y-2">
                <Label>Product ID / URL *</Label>
                <Input
                  {...register('productSku')}
                  placeholder="ID produit ou URL complète"
                  className="bg-cyber-body"
                />
                {errors.productSku && (
                  <p className="text-xs text-red-500">{errors.productSku.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Mode *</Label>
                <Controller
                  name="mode"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-cyber-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {carrefourModes.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {mode === 'DRIVE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Code Postal *</Label>
                    <Input
                      {...register('zipCode')}
                      placeholder="75001"
                      className="bg-cyber-body"
                    />
                    {errors.zipCode && (
                      <p className="text-xs text-red-500">{errors.zipCode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Créneau *</Label>
                    <Controller
                      name="slotPreference"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="bg-cyber-body">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Matin (8h-12h)</SelectItem>
                            <SelectItem value="afternoon">Midi (12h-17h)</SelectItem>
                            <SelectItem value="evening">Soir (17h-21h)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.slotPreference && (
                      <p className="text-xs text-red-500">{errors.slotPreference.message}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Controller
                  name="allowSubstitution"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label className="cursor-pointer">Autoriser les substitutions</Label>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-4 p-4 rounded-lg bg-cyber-card border border-border">
            <h3 className="font-semibold">Configuration Commune</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Profile *</Label>
                <Controller
                  name="profileId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-cyber-body">
                        <SelectValue placeholder="Sélectionner un profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.profileId && (
                  <p className="text-xs text-red-500">{errors.profileId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Proxy Group</Label>
                <Controller
                  name="proxyGroupId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-cyber-body">
                        <SelectValue placeholder="Aucun (Localhost)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucun</SelectItem>
                        {proxyGroups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Group</Label>
              <Controller
                name="accountGroupId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-cyber-body">
                      <SelectValue placeholder="Aucun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {accountGroups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantité: {watch('quantity')}</Label>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      value={[field.value]}
                      onValueChange={(v) => field.onChange(v[0])}
                      min={1}
                      max={20}
                      step={1}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Prix Maximum (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('priceLimit', { valueAsNumber: true })}
                  placeholder="Optionnel"
                  className="bg-cyber-body"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" variant="cyber" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la Tâche'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
