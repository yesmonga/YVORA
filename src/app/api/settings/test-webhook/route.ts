import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url, name } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'Webhook URL required' }, { status: 400 })
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '✅ YVORA Webhook Test',
          description: `Webhook **${name || 'Unknown'}** is working correctly!`,
          color: 0xa855f7, // Purple color matching YVORA theme
          timestamp: new Date().toISOString(),
          footer: {
            text: 'YVORA Bot Controller',
          },
        }],
      }),
    })

    if (response.ok || response.status === 204) {
      return NextResponse.json({ success: true })
    } else {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || 'Webhook test failed' }, { status: 400 })
    }
  } catch (error) {
    console.error('Webhook test failed:', error)
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 })
  }
}
