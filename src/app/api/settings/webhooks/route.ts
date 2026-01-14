import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

interface WebhookData {
  id: string
  name: string
  url: string
  status: string
}

export async function POST(request: Request) {
  try {
    const { name, url } = await request.json()
    
    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL required' }, { status: 400 })
    }

    const newWebhook: WebhookData = {
      id: randomUUID(),
      name,
      url,
      status: 'Idle',
    }

    const existingSettings = await prisma.settings.findFirst()
    
    if (existingSettings) {
      const currentWebhooks = (existingSettings.webhooks as unknown as WebhookData[]) || []
      
      await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          webhooks: [...currentWebhooks, newWebhook] as unknown as object,
        },
      })
    } else {
      await prisma.settings.create({
        data: {
          userId: 'default',
          webhooks: [newWebhook] as unknown as object,
        },
      })
    }

    return NextResponse.json(newWebhook, { status: 201 })
  } catch (error) {
    console.error('Failed to add webhook:', error)
    return NextResponse.json({ error: 'Failed to add webhook' }, { status: 500 })
  }
}
