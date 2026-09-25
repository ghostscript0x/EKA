import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { Medal, Flame, CheckCircle, ShieldAlert, Coffee } from "lucide-react"
import { calculateStreak } from "@/lib/streak"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      dayRecords: { include: { checkedItems: true, extraTasks: true }, orderBy: { date: 'desc' } }
    }
  })

  if (!user) redirect('/login')

  const sections = await prisma.section.findMany({
    where: { userId: session.user.id }
  })
  const templates = await prisma.templateItem.findMany({
    where: { userId: session.user.id }
  })

  const { longest } = await calculateStreak(session.user.id)

  const totalDays = user.dayRecords.length
  let perfectDays = 0
  let usedRestDay = false

  user.dayRecords.forEach(record => {
    if (record.isRestDay) usedRestDay = true
    
    if (!record.isRestDay) {
      const completedSections = new Set<string>()
      record.checkedItems.forEach(ci => {
        const t = templates.find(temp => temp.id === ci.templateItemId)
        if (t) completedSections.add(t.sectionId)
      })
      record.extraTasks.forEach(et => {
        if (et.checked) completedSections.add(et.sectionId)
      })
      if (completedSections.size === sections.length && sections.length > 0) perfectDays++
    }
  })

  const badges = [
    { 
      id: 'first', 
      title: 'First Step', 
      desc: 'Logged your first day', 
      icon: <CheckCircle className="w-6 h-6" />, 
      earned: totalDays > 0 
    },
    { 
      id: 'flawless', 
      title: 'Flawless', 
      desc: 'Achieved a 100% perfect day', 
      icon: <Medal className="w-6 h-6" />, 
      earned: perfectDays > 0 
    },
    { 
      id: 'iron', 
      title: 'Iron Will', 
      desc: 'Hit a 7-day streak', 
      icon: <Flame className="w-6 h-6" />, 
      earned: longest >= 7 
    },
    { 
      id: 'monk', 
      title: 'Monk', 
      desc: 'Hit a 30-day streak', 
      icon: <ShieldAlert className="w-6 h-6" />, 
      earned: longest >= 30 
    },
    { 
      id: 'mercy', 
      title: 'Mercy', 
      desc: 'Took an intentional rest day', 
      icon: <Coffee className="w-6 h-6" />, 
      earned: usedRestDay 
    },
  ]

  return (
    <main className="animate-in fade-in duration-500 pb-24">
      <header className="mb-12">
        <h1 className="font-serif text-4xl text-ink tracking-tight mb-2">Profile</h1>
        <p className="text-muted">{user.email}</p>
      </header>

      <section className="mb-12 grid grid-cols-2 gap-4">
        <div className="p-4 border border-line rounded-md">
          <div className="text-xs text-muted uppercase tracking-widest font-sans mb-1">Total Days</div>
          <div className="font-serif text-3xl text-ink">{totalDays}</div>
        </div>
        <div className="p-4 border border-line rounded-md">
          <div className="text-xs text-muted uppercase tracking-widest font-sans mb-1">Perfect Days</div>
          <div className="font-serif text-3xl text-gold">{perfectDays}</div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink mb-6">Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map(badge => (
            <div 
              key={badge.id} 
              className={`p-4 border rounded-md flex items-center gap-4 transition-colors duration-500 ${badge.earned ? 'border-gold/30 bg-gold/5' : 'border-line/50 opacity-40 grayscale'}`}
            >
              <div className={`p-2 rounded-full ${badge.earned ? 'bg-gold/20 text-gold' : 'bg-line text-muted'}`}>
                {badge.icon}
              </div>
              <div>
                <h3 className={`font-serif text-lg ${badge.earned ? 'text-ink' : 'text-muted'}`}>{badge.title}</h3>
                <p className="text-xs text-muted">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
