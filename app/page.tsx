import { redirect } from 'next/navigation'
import { getTodayStr } from '@/lib/date'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  redirect(`/day/${getTodayStr()}`)
}
