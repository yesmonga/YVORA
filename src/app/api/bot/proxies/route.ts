import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const proxies = await prisma.proxy.findMany({
      include: { proxyGroup: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(proxies)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proxies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const proxiesToCreate = body.proxies.map((p: string) => {
      const parts = p.split(':')
      return {
        host: parts[0],
        port: parseInt(parts[1]),
        username: parts[2] || null,
        password: parts[3] || null,
        proxyGroupId: body.proxyGroupId,
      }
    })
    const result = await prisma.proxy.createMany({ data: proxiesToCreate })
    return NextResponse.json({ created: result.count }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create proxies' }, { status: 500 })
  }
}
