import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalTasks,
      successTasks,
      activeTasks,
      totalProxies,
      totalAccounts,
      totalProfiles,
    ] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: 'SUCCESS' } }),
      prisma.task.count({
        where: {
          status: {
            in: ['STARTING', 'LOGIN', 'MONITORING', 'ADD_TO_CART', 'SUBMITTING_ORDER'],
          },
        },
      }),
      prisma.proxy.count(),
      prisma.account.count(),
      prisma.profile.count(),
    ])

    return NextResponse.json({
      totalTasks,
      successTasks,
      activeTasks,
      totalProxies,
      totalAccounts,
      totalProfiles,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({
      totalTasks: 0,
      successTasks: 0,
      activeTasks: 0,
      totalProxies: 0,
      totalAccounts: 0,
      totalProfiles: 0,
    })
  }
}
