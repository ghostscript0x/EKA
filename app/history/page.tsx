import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const host = headers().get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const res = await fetch(`${protocol}://${host}/api/history`, {
    headers: { cookie: headers().get("cookie") || "" }
  })

  if (!res.ok) return <div className="text-red-500">Failed to load history</div>
  const history = await res.json()

  return (
    <main className="animate-in fade-in duration-500">
      <h1 className="font-serif text-4xl text-ink tracking-tight mb-8">History</h1>
      
      {history.length === 0 ? (
        <p className="text-muted">No history recorded yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {history.map((day: any) => {
            const percentage = day.total > 0 ? day.progress / day.total : 0
            let bgClass = "bg-line"
            if (day.isRestDay) {
              bgClass = "bg-rest"
            } else {
              if (percentage > 0) bgClass = "bg-accent-soft"
              if (percentage === 1) bgClass = "bg-accent"
            }

            return (
              <Link 
                key={day.date} 
                href={`/day/${day.date}`} 
                title={`${day.date}: ${day.progress}/${day.total} sections completed`}
              >
                <div className={`w-6 h-6 rounded-sm ${bgClass} hover:ring-2 hover:ring-offset-2 hover:ring-offset-bg ring-ink transition-all`} />
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
