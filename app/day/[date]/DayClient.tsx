"use client"
import { useState } from "react"
import { format, parseISO, addDays, subDays } from "date-fns"
import Link from "next/link"
import { SectionCard } from "@/components/SectionCard"
import { ProgressBar } from "@/components/ProgressBar"
import { StreakBadge } from "@/components/StreakBadge"
import { NoteField } from "@/components/NoteField"
import { PinOff, Coffee } from "lucide-react"
import { Onboarding } from "@/components/Onboarding"

export function DayClient({ date, initialData }: any) {
  const [data, setData] = useState(initialData)

  const handleToggle = async (itemId: string, checked: boolean, isExtra?: boolean) => {
    setData((prev: any) => {
      const next = { ...prev }
      if (isExtra) {
        const task = next.dayRecord.extraTasks.find((t: any) => t.id === itemId)
        if (task) task.checked = checked
      } else {
        if (checked) {
          next.dayRecord.checkedItems.push({ templateItemId: itemId })
        } else {
          next.dayRecord.checkedItems = next.dayRecord.checkedItems.filter((ci: any) => ci.templateItemId !== itemId)
        }
      }
      return next
    })

    try {
      if (isExtra) {
        await fetch(`/api/day/${date}/extra/${itemId}`, {
          method: "POST",
          body: JSON.stringify({ checked })
        })
      } else {
        await fetch(`/api/day/${date}/check`, {
          method: "POST",
          body: JSON.stringify({ templateItemId: itemId, checked })
        })
      }
    } catch (e) { console.error(e) }
  }

  const handleAddExtra = async (sectionId: string) => {
    const label = prompt("Enter extra task:")
    if (!label) return
    
    const tempId = 'temp-' + Date.now()
    setData((prev: any) => {
      const next = { ...prev }
      next.dayRecord.extraTasks.push({ id: tempId, sectionId, label, checked: false })
      return next
    })

    try {
      const res = await fetch(`/api/day/${date}/extra`, {
        method: "POST",
        body: JSON.stringify({ sectionId, label })
      })
      const task = await res.json()
      
      setData((prev: any) => {
        const next = { ...prev }
        const t = next.dayRecord.extraTasks.find((t: any) => t.id === tempId)
        if (t) Object.assign(t, task)
        return next
      })
    } catch (e) { console.error(e) }
  }

  const handleSaveNote = async (note: string) => {
    await fetch(`/api/day/${date}/update`, {
      method: "PATCH",
      body: JSON.stringify({ note })
    })
  }

  const handleSetFocus = async (focus: string | null) => {
    setData((prev: any) => ({ ...prev, dayRecord: { ...prev.dayRecord, focus } }))
    await fetch(`/api/day/${date}/update`, {
      method: "PATCH",
      body: JSON.stringify({ focus })
    })
  }

  const handleToggleRestDay = async () => {
    const isRestDay = !data.dayRecord.isRestDay
    setData((prev: any) => ({ ...prev, dayRecord: { ...prev.dayRecord, isRestDay } }))
    await fetch(`/api/day/${date}/update`, {
      method: "PATCH",
      body: JSON.stringify({ isRestDay })
    })
  }

  let completedSections = 0
  
  data.sections.forEach((section: any) => {
    const hasTemplateChecked = data.dayRecord.checkedItems.some((ci: any) => {
      const t = data.templates.find((temp: any) => temp.id === ci.templateItemId)
      return t?.sectionId === section.id
    })
    const hasExtraChecked = data.dayRecord.extraTasks.some((et: any) => et.sectionId === section.id && et.checked)
    
    if (hasTemplateChecked || hasExtraChecked) {
      completedSections++
    }
  })

  const isPerfect = completedSections === data.sections.length && data.sections.length > 0

  let displayDate = date
  let prevDate = date
  let nextDate = date
  let isToday = false
  try {
    const parsed = parseISO(date)
    displayDate = format(parsed, "EEEE, MMM d")
    prevDate = format(subDays(parsed, 1), "yyyy-MM-dd")
    nextDate = format(addDays(parsed, 1), "yyyy-MM-dd")
    isToday = date === format(new Date(), "yyyy-MM-dd")
  } catch (e) {}

  const isLocked = !isToday

  if (data.sections.length === 0) {
    return (
      <main className="animate-in fade-in duration-500">
        <Onboarding />
      </main>
    )
  }

  return (
    <main className="animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <Link href={`/day/${prevDate}`} className="text-muted hover:text-ink transition-colors text-xl">←</Link>
            <div className="flex flex-col">
              {isLocked && <span className="text-xs text-red-500 font-sans tracking-widest uppercase mb-1">Locked (Past Day)</span>}
              <h1 className={`font-serif text-4xl tracking-tight transition-colors duration-1000 ${isPerfect ? 'text-gold' : 'text-ink'}`}>
                {displayDate}
              </h1>
            </div>
            <Link href={`/day/${nextDate}`} className="text-muted hover:text-ink transition-colors text-xl">→</Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToggleRestDay}
              className={`flex items-center gap-2 text-sm transition-colors border px-2 py-1 rounded ${data.dayRecord.isRestDay ? 'border-rest text-rest bg-rest/10' : 'border-line text-muted hover:text-ink'}`}
              title="Mark as Rest Day (Freezes streak without breaking it)"
            >
              <Coffee className="w-4 h-4" />
              {data.dayRecord.isRestDay ? 'Resting' : 'Rest Day'}
            </button>
            <StreakBadge current={data.streak.current} longest={data.streak.longest} />
          </div>
        </div>
        {!data.dayRecord.isRestDay && (
          <ProgressBar progress={completedSections} total={data.sections.length} isPerfect={isPerfect} />
        )}
      </header>

      {data.dayRecord.focus && !data.dayRecord.isRestDay && (
        <div className="mb-12 p-4 border border-gold/30 bg-gold/5 rounded-md flex justify-between items-center group">
          <div>
            <div className="text-xs text-gold uppercase tracking-widest font-sans mb-1">Focus</div>
            <div className="font-serif text-xl text-ink">{data.dayRecord.focus}</div>
          </div>
          <button 
            onClick={() => handleSetFocus(null)}
            className="text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-ink"
            title="Clear Focus"
          >
            <PinOff className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={`flex flex-col gap-8 transition-opacity duration-700 ${data.dayRecord.isRestDay ? 'opacity-30 pointer-events-none' : 'opacity-100'} ${isLocked ? 'pointer-events-none opacity-80' : ''}`}>
        {data.sections.map((section: any) => {
          const sectionTemplates = data.templates.filter((t: any) => t.sectionId === section.id)
          const sectionExtras = data.dayRecord.extraTasks.filter((et: any) => et.sectionId === section.id)
          
          const items = [
            ...sectionTemplates.map((t: any) => ({
              id: t.id,
              label: t.label,
              checked: data.dayRecord.checkedItems.some((ci: any) => ci.templateItemId === t.id),
              isExtra: false
            })),
            ...sectionExtras.map((et: any) => ({
              id: et.id,
              label: et.label,
              checked: et.checked,
              isExtra: true
            }))
          ]
          
          return (
            <SectionCard 
              key={section.id}
              title={section.title}
              emoji={section.emoji}
              items={items}
              onToggle={handleToggle}
              onAddExtra={() => handleAddExtra(section.id)}
              onSetFocus={handleSetFocus}
              focusedLabel={data.dayRecord.focus}
            />
          )
        })}
      </div>

      <div className={isLocked ? 'pointer-events-none opacity-80' : ''}>
        <NoteField initialNote={data.dayRecord.note || ""} onSave={handleSaveNote} />
      </div>
    </main>
  )
}
