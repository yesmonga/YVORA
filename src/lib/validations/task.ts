import { z } from 'zod'

export const amazonModes = ['NORMAL', 'FAST', 'SAFE', 'SCRAPE', 'FULL_ACCOUNT'] as const
export const carrefourModes = ['DRIVE', 'DELIVERY'] as const
export const amazonRegions = ['fr', 'de', 'it', 'es', 'uk'] as const
export const slotPreferences = ['morning', 'afternoon', 'evening'] as const

export const amazonConfigSchema = z.object({
  offerId: z.string().optional(),
  region: z.enum(amazonRegions),
  loginMethod: z.enum(['browser', 'request']).default('browser'),
})

export const carrefourConfigSchema = z.object({
  zipCode: z.string().min(5, 'Code postal requis'),
  slotPreference: z.enum(slotPreferences),
  allowSubstitution: z.boolean().default(false),
})

const baseTaskSchema = z.object({
  profileId: z.string().min(1, 'Profile requis'),
  proxyGroupId: z.string().optional(),
  accountGroupId: z.string().optional(),
  quantity: z.number().min(1).max(20).default(1),
  priceLimit: z.number().optional(),
  size: z.string().optional(),
})

export const amazonTaskSchema = baseTaskSchema.extend({
  store: z.literal('AMAZON'),
  productSku: z.string().min(1, 'ASIN requis'),
  mode: z.enum(amazonModes),
  amazonConfig: amazonConfigSchema,
}).superRefine((data, ctx) => {
  if (data.mode === 'FAST' && (!data.amazonConfig.offerId || data.amazonConfig.offerId.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'OfferID requis pour le mode FAST',
      path: ['amazonConfig', 'offerId'],
    })
  }
})

export const carrefourTaskSchema = baseTaskSchema.extend({
  store: z.literal('CARREFOUR'),
  productSku: z.string().min(1, 'Product ID requis'),
  mode: z.enum(carrefourModes),
  carrefourConfig: carrefourConfigSchema,
})

export const createTaskSchema = z.union([amazonTaskSchema, carrefourTaskSchema])

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type AmazonTaskInput = z.infer<typeof amazonTaskSchema>
export type CarrefourTaskInput = z.infer<typeof carrefourTaskSchema>
export type AmazonConfig = z.infer<typeof amazonConfigSchema>
export type CarrefourConfig = z.infer<typeof carrefourConfigSchema>
