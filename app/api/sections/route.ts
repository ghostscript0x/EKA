import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, emoji } = await req.json()
  
  const existing = await prisma.section.findMany({
    where: { OR: [{ userId: session.user.id }, { userId: null }] }
  })
  const order = existing.length > 0 ? Math.max(...existing.map(s => s.order)) + 1 : 1

  const section = await prisma.section.create({
    data: {
      key: 'custom-' + Date.now(),
      title,
      emoji,
      order,
      userId: session.user.id
    }
  })

  return NextResponse.json(section)
}
