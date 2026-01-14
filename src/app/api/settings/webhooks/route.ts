import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  try {
    const { name, url } = await request.json()
    
    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL required' }, { status: 400 })
    }

    const newWebhook = {
      id: randomUUID(),
      name,
      url,
      status: 'Idle',
    }

    const existingSettings = await prisma.settings.findFirst()
    
    if (existingSettings) {
      const webhooks = existingSettings.webhooks as { discord?: Array<typeof newWebhook> } || {}
      const discordWebhooks = webhooks.discord || []
      
      await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          webhooks: {
            ...webhooks,
            discord: [...discordWebhooks, newWebhook],
          },
        },
      })
    } else {
      await prisma.settings.create({
        data: {
          userId: 'default',
          webhooks: {
            discord: [newWebhook],
          },
        },
      })
    }

    return NextResponse.json(newWebhook, { status: 201 })
  } catch (error) {
    console.error('Failed to add webhook:', error)
    return NextResponse.json({ error: 'Failed to add webhook' }, { status: 500 })
  }
}
