import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingSettings = await prisma.settings.findFirst()
    
    if (!existingSettings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    const webhooks = existingSettings.webhooks as { discord?: Array<{ id: string }> } || {}
    const discordWebhooks = webhooks.discord || []
    
    const updatedWebhooks = discordWebhooks.filter(w => w.id !== params.id)
    
    await prisma.settings.update({
      where: { id: existingSettings.id },
      data: {
        webhooks: {
          ...webhooks,
          discord: updatedWebhooks,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete webhook:', error)
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
  }
}
