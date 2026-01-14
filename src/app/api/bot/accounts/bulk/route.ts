import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface AccountInput {
  store: 'AMAZON' | 'CARREFOUR'
  email: string
  password: string
  imapConfig?: {
    host: string
    port: number
    user: string
    pass: string
  } | null
  accountGroupId?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { accounts, accountGroupId } = body as { 
      accounts: AccountInput[]
      accountGroupId?: string 
    }

    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      return NextResponse.json(
        { error: 'No accounts provided' },
        { status: 400 }
      )
    }

    let targetGroupId = accountGroupId

    if (!targetGroupId) {
      const defaultGroup = await prisma.accountGroup.findFirst({
        where: { name: 'Default' },
      })
      
      if (defaultGroup) {
        targetGroupId = defaultGroup.id
      } else {
        const newGroup = await prisma.accountGroup.create({
          data: {
            name: 'Imported Accounts',
            userId: 'default-user',
          },
        })
        targetGroupId = newGroup.id
      }
    }

    const accountsToCreate = accounts.map((acc) => ({
      store: acc.store,
      email: acc.email,
      password: acc.password,
      imapConfig: acc.imapConfig || undefined,
      accountGroupId: targetGroupId!,
    }))

    const result = await prisma.account.createMany({
      data: accountsToCreate,
      skipDuplicates: true,
    })

    return NextResponse.json(
      { 
        success: true, 
        created: result.count,
        message: `${result.count} comptes importés avec succès`
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Failed to import accounts' },
      { status: 500 }
    )
  }
}
