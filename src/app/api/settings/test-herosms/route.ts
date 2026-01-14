import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 })
    }

    const response = await fetch(
      `https://hero-sms.com/stubs/handler_api.php?action=getBalance&api_key=${apiKey}`
    )

    const text = await response.text()

    // Hero SMS returns "ACCESS_BALANCE:<amount>" on success
    if (text.startsWith('ACCESS_BALANCE:')) {
      const balance = text.split(':')[1]
      return NextResponse.json({ balance: parseFloat(balance) })
    } else if (text.includes('BAD_KEY') || text.includes('ERROR')) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 400 })
    } else {
      return NextResponse.json({ error: text }, { status: 400 })
    }
  } catch (error) {
    console.error('Hero SMS balance check failed:', error)
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 })
  }
}
