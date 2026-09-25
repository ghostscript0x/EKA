import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { calculateStreak } from '@/lib/streak'

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const date = params.date

  const dayRecord = await prisma.dayRecord.upsert({
    where: { date_userId: { date, userId: session.user.id } },
    update: {},
    create: { date, userId: session.user.id },
    include: { checkedItems: true, extraTasks: true }
  })

  // Get active templates and sections
  const templates = await prisma.templateItem.findMany({
    where: { userId: session.user.id, active: true },
    orderBy: { order: 'asc' }
  })

  const sections = await prisma.section.findMany({
    where: { userId: session.user.id, active: true },
    orderBy: { order: 'asc' }
  })

  // Calculate streak (walking backward from today)
  const streak = await calculateStreak(session.user.id)

  return NextResponse.json({
    dayRecord,
    templates,
    sections,
    streak
  })
}
