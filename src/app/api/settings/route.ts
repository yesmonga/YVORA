import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface WebhookData {
  id: string
  name: string
  url: string
  status: string
}

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    const webhooks = (settings?.webhooks as unknown as WebhookData[]) || []
    
    return NextResponse.json({
      twoCaptchaKey: settings?.twoCaptchaKey || '',
      heroSmsKey: settings?.heroSmsKey || '',
      webhooks,
    })
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json({
      twoCaptchaKey: '',
      heroSmsKey: '',
      webhooks: [],
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const existingSettings = await prisma.settings.findFirst()
    
    // Safe webhooks data with proper typing for Prisma Json field
    const webhooksData = (body.webhooks ?? existingSettings?.webhooks ?? []) as any

    if (existingSettings) {
      await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          twoCaptchaKey: body.twoCaptchaKey ?? existingSettings.twoCaptchaKey,
          heroSmsKey: body.heroSmsKey ?? existingSettings.heroSmsKey,
          webhooks: webhooksData,
        },
      })
    } else {
      await prisma.settings.create({
        data: {
          twoCaptchaKey: body.twoCaptchaKey || null,
          heroSmsKey: body.heroSmsKey || null,
          webhooks: (body.webhooks ?? []) as any,
        },
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
