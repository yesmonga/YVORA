import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const sanitized = profiles.map((p) => ({
      ...p,
      cardNumber: undefined,
      cardCvv: undefined,
    }))
    return NextResponse.json(sanitized)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const profile = await prisma.profile.create({
      data: {
        name: body.name,
        shippingFirstName: body.shippingFirstName,
        shippingLastName: body.shippingLastName,
        shippingAddress1: body.shippingAddress1,
        shippingAddress2: body.shippingAddress2,
        shippingCity: body.shippingCity,
        shippingState: body.shippingState,
        shippingZip: body.shippingZip,
        shippingCountry: body.shippingCountry,
        shippingPhone: body.shippingPhone,
        sameAsShipping: body.sameAsShipping ?? true,
        billingFirstName: body.billingFirstName,
        billingLastName: body.billingLastName,
        billingAddress1: body.billingAddress1,
        billingAddress2: body.billingAddress2,
        billingCity: body.billingCity,
        billingState: body.billingState,
        billingZip: body.billingZip,
        billingCountry: body.billingCountry,
        cardHolder: body.cardHolder,
        cardNumber: body.cardNumber,
        cardExpMonth: body.cardExpMonth,
        cardExpYear: body.cardExpYear,
        cardCvv: body.cardCvv,
        autoJig: body.autoJig || false,
        userId: body.userId,
      },
    })
    return NextResponse.json({ id: profile.id, name: profile.name }, { status: 201 })
  } catch (error) {
    console.error('Failed to create profile:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}
