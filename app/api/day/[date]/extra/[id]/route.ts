import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: { date: string, id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { checked } = await request.json()
  
  const task = await prisma.extraTask.update({
    where: { id: params.id, userId: session.user.id },
    data: { checked }
  })

  return NextResponse.json(task)
}
