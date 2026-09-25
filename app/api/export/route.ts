import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      templateItems: true,
      dayRecords: {
        include: { checkedItems: true, extraTasks: true }
      }
    }
  })

  return NextResponse.json(data)
}
