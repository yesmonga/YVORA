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
        avatar_url: 'https://i.imgur.com/AfFp7pu.png',
        username: 'YVORA',
        content: null,
        embeds: [{
          title: '**YVORA Webhook Test**',
          url: 'https://github.com/yesmonga/YVORA',
          color: 0xa855f7, // Purple color matching YVORA theme
          description: `\`\`\`Webhook "${name || 'Unknown'}" is working correctly!\`\`\``,
          timestamp: new Date().toISOString(),
          footer: {
            icon_url: 'https://i.imgur.com/AfFp7pu.png',
            text: 'YVORA Bot Controller',
          },
          thumbnail: {
            url: 'https://i.imgur.com/AfFp7pu.png',
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
