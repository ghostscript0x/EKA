import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { SettingsClient } from "./SettingsClient"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const host = headers().get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const res = await fetch(`${protocol}://${host}/api/templates`, {
    headers: { cookie: headers().get("cookie") || "" }
  })

  if (!res.ok) return <div className="text-red-500">Failed to load templates</div>
  const initialData = await res.json()

  return <SettingsClient initialData={initialData} />
}
