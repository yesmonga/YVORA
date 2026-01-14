import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: {
        taskGroup: true,
        profile: {
          select: {
            id: true,
            name: true,
            shippingFirstName: true,
            shippingLastName: true,
            shippingAddress1: true,
            shippingAddress2: true,
            shippingCity: true,
            shippingState: true,
            shippingZip: true,
            shippingCountry: true,
            shippingPhone: true,
            billingFirstName: true,
            billingLastName: true,
            billingAddress1: true,
            billingCity: true,
            billingZip: true,
            billingCountry: true,
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
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Failed to fetch task:', error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.status !== undefined) updateData.status = body.status
    if (body.statusMessage !== undefined) updateData.statusMessage = body.statusMessage
    if (body.productName !== undefined) updateData.productName = body.productName
    if (body.productImage !== undefined) updateData.productImage = body.productImage

    if (body.status === 'SUCCESS') {
      updateData.completedAt = new Date()
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
      include: {
        taskGroup: true,
        profile: true,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
