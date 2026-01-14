import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface WebhookData {
  id: string
  name: string
  url: string
  status: string
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingSettings = await prisma.settings.findFirst()
    
    if (!existingSettings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    const currentWebhooks = (existingSettings.webhooks as unknown as WebhookData[]) || []
    const updatedWebhooks = currentWebhooks.filter(w => w.id !== params.id)
    
    await prisma.settings.update({
      where: { id: existingSettings.id },
      data: {
        webhooks: updatedWebhooks as unknown as object,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete webhook:', error)
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
  }
}
