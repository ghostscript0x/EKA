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

  const { sectionId, label } = await request.json()
  
  const dayRecord = await prisma.dayRecord.findUnique({
    where: { date_userId: { date: params.date, userId: session.user.id } }
  })

  if (!dayRecord) return NextResponse.json({ error: 'Day record not found' }, { status: 404 })

  const task = await prisma.extraTask.create({
    data: {
      dayRecordId: dayRecord.id,
      sectionId,
      label,
      userId: session.user.id
    }
  })

  return NextResponse.json(task)
}
