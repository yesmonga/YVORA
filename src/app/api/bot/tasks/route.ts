import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const store = searchParams.get('store')
    const taskGroupId = searchParams.get('taskGroupId')
    const active = searchParams.get('active')

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    if (store) {
      where.store = store
    }

    if (taskGroupId) {
      where.taskGroupId = taskGroupId
    }

    if (active === 'true') {
      where.status = {
        notIn: ['IDLE', 'STOPPED', 'SUCCESS', 'ERROR_PAYMENT', 'ERROR_CAPTCHA', 'ERROR_RATELIMIT', 'ERROR_LOGIN', 'ERROR_OUT_OF_STOCK'],
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        taskGroup: true,
        profile: {
          select: {
            id: true,
            name: true,
            shippingFirstName: true,
            shippingLastName: true,
            shippingAddress1: true,
            shippingCity: true,
            shippingZip: true,
            shippingCountry: true,
            shippingPhone: true,
            cardNumber: true,
            cardExpMonth: true,
            cardExpYear: true,
            cardCvv: true,
            cardHolder: true,
          },
        },
        proxyGroup: {
          include: {
            proxies: {
              where: { status: 'WORKING' },
              take: 10,
            },
          },
        },
        accountGroup: {
          include: {
            accounts: {
              where: { status: 'READY' },
              select: {
                id: true,
                email: true,
                password: true,
                cookies: true,
                imapConfig: true,
                twoFactorSecret: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const taskData: Record<string, unknown> = {
      store: body.store,
      productSku: body.productSku,
      mode: body.mode,
      quantity: body.quantity || 1,
      priceLimit: body.priceLimit,
      size: body.size,
      profileId: body.profileId,
      proxyGroupId: body.proxyGroupId || null,
      accountGroupId: body.accountGroupId || null,
      taskGroupId: body.taskGroupId,
      scheduledStart: body.scheduledStart ? new Date(body.scheduledStart) : null,
    }

    if (body.store === 'AMAZON') {
      taskData.amazonConfig = {
        offerId: body.offerId,
        region: body.region || 'fr',
        loginMethod: body.loginMethod || 'browser',
      }
    } else if (body.store === 'CARREFOUR') {
      taskData.carrefourConfig = {
        zipCode: body.zipCode,
        slotPreference: body.slotPreference,
        allowSubstitution: body.allowSubstitution || false,
      }
    }

    const task = await prisma.task.create({
      data: taskData as Parameters<typeof prisma.task.create>[0]['data'],
      include: {
        taskGroup: true,
        profile: true,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
