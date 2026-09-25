import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DayClient } from "./DayClient"
import { headers } from "next/headers"

export default async function DayPage({ params }: { params: { date: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const host = headers().get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  
  const res = await fetch(`${protocol}://${host}/api/day/${params.date}`, {
    headers: {
      cookie: headers().get("cookie") || ""
    }
  })

  if (!res.ok) {
    return <div className="text-red-500">Failed to load day data.</div>
  }

  const initialData = await res.json()

  return <DayClient date={params.date} initialData={initialData} />
}
