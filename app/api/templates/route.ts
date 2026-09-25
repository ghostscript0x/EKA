import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sections = await prisma.section.findMany({
    where: { userId: session.user.id },
    orderBy: { order: 'asc' }
  })
  const templates = await prisma.templateItem.findMany({
    where: { userId: session.user.id, active: true },
    orderBy: { order: 'asc' }
  })
  
  return NextResponse.json({ sections, templates })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sectionId, label } = await req.json()
  
  const existing = await prisma.templateItem.findMany({
    where: { sectionId, userId: session.user.id }
  })
  const order = existing.length > 0 ? Math.max(...existing.map(t => t.order)) + 1 : 1

  const task = await prisma.templateItem.create({
    data: {
      sectionId,
      label,
      order,
      userId: session.user.id
    }
  })

  return NextResponse.json(task)
}
