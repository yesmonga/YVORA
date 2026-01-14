import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 })
    }

    const response = await fetch('https://api.2captcha.com/getBalance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientKey: apiKey }),
    })

    const data = await response.json()

    if (data.errorId === 0) {
      return NextResponse.json({ balance: data.balance })
    } else {
      return NextResponse.json({ error: data.errorDescription || 'Invalid API key' }, { status: 400 })
    }
  } catch (error) {
    console.error('2Captcha balance check failed:', error)
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 })
  }
}
