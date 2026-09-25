import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, emoji } = await request.json()
  
  const section = await prisma.section.update({
    where: { id: params.id, userId: session.user.id },
    data: { title, emoji }
  })

  return NextResponse.json(section)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.section.update({
    where: { id: params.id, userId: session.user.id },
    data: { active: false }
  })

  return NextResponse.json({ success: true })
}
