import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: { date: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  
  const record = await prisma.dayRecord.update({
    where: { date_userId: { date: params.date, userId: session.user.id } },
    data
  })

  return NextResponse.json(record)
}
