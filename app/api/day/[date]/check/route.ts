import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: { date: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { templateItemId, checked } = await request.json()
  
  const dayRecord = await prisma.dayRecord.findUnique({
    where: { date_userId: { date: params.date, userId: session.user.id } }
  })

  if (!dayRecord) return NextResponse.json({ error: 'Day record not found' }, { status: 404 })

  if (checked) {
    await prisma.checkedItem.upsert({
      where: { dayRecordId_templateItemId: { dayRecordId: dayRecord.id, templateItemId } },
      update: {},
      create: { dayRecordId: dayRecord.id, templateItemId }
    })
  } else {
    await prisma.checkedItem.deleteMany({
      where: { dayRecordId: dayRecord.id, templateItemId }
    })
  }

  return NextResponse.json({ success: true })
}
