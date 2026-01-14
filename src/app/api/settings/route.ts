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
    
    // Get or create default user first
    let user = await prisma.user.findFirst({ where: { email: 'admin@yvora.io' } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@yvora.io',
          name: 'Admin',
          password: 'admin',
        },
      })
    }
    
    const existingSettings = await prisma.settings.findFirst({ where: { userId: user.id } })
    
    if (existingSettings) {
      await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          twoCaptchaKey: body.twoCaptchaKey ?? existingSettings.twoCaptchaKey,
          heroSmsKey: body.heroSmsKey ?? existingSettings.heroSmsKey,
        },
      })
    } else {
      await prisma.settings.create({
        data: {
          userId: user.id,
          twoCaptchaKey: body.twoCaptchaKey || null,
          heroSmsKey: body.heroSmsKey || null,
        },
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
