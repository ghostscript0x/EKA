import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { subDays, format } from "date-fns"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const days = await prisma.dayRecord.findMany({
    where: { userId: session.user.id },
    include: { checkedItems: true, extraTasks: true },
    orderBy: { date: 'desc' },
    take: 140
  })

  const templates = await prisma.templateItem.findMany({
    where: { userId: session.user.id, active: true }
  })
  
  const sections = await prisma.section.findMany({
    where: { userId: session.user.id }
  })
  const sectionIds = sections.map(s => s.id)

  const historyMap = new Map()
  days.forEach(record => {
    const completedSections = new Set<string>()
    record.checkedItems.forEach(ci => {
      const t = templates.find(temp => temp.id === ci.templateItemId)
      if (t) completedSections.add(t.sectionId)
    })
    record.extraTasks.forEach(et => {
      if (et.checked) completedSections.add(et.sectionId)
    })
    historyMap.set(record.date, { progress: completedSections.size, isRestDay: record.isRestDay })
  })

  const history = []
  const today = new Date()
  for (let i = 139; i >= 0; i--) {
    const d = subDays(today, i)
    const dateStr = format(d, 'yyyy-MM-dd')
    const rec = historyMap.get(dateStr)
    history.push({
      date: dateStr,
      progress: rec?.progress || 0,
      isRestDay: rec?.isRestDay || false,
      total: sectionIds.length
    })
  }

  return NextResponse.json(history)
}
