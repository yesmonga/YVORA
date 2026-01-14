import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      include: { accountGroup: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(accounts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const account = await prisma.account.create({
      data: {
        store: body.store,
        email: body.email,
        password: body.password,
        twoFactorSecret: body.twoFactorSecret,
        imapConfig: body.imapConfig,
        cookies: body.cookies,
        accountGroupId: body.accountGroupId,
      },
    })
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error('Failed to create account:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
