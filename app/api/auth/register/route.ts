import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
