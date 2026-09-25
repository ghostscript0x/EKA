"use client"
import { useState } from "react"
import { Trash2 } from "lucide-react"

export function SettingsClient({ initialData }: any) {
  const [data, setData] = useState(initialData)

  const handleAdd = async (sectionId: string) => {
    const label = prompt("Enter new recurring task:")
    if (!label) return
    
    const tempId = 'temp-' + Date.now()
    setData((prev: any) => ({
      ...prev,
      templates: [...prev.templates, { id: tempId, sectionId, label, active: true }]
    }))

    try {
      const res = await fetch(`/api/templates`, {
        method: "POST",
        body: JSON.stringify({ sectionId, label })
      })
      const task = await res.json()
      
      setData((prev: any) => ({
        ...prev,
        templates: prev.templates.map((t: any) => t.id === tempId ? task : t)
      }))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this recurring task? It will still show on historical days.")) return

    setData((prev: any) => ({
      ...prev,
      templates: prev.templates.filter((t: any) => t.id !== id)
    }))

    try {
      await fetch(`/api/templates/${id}`, { method: "DELETE" })
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddSection = async () => {
    const title = prompt("Section title:")
    if (!title) return
    const emoji = prompt("Section emoji (e.g. 🏋️):", "✨") || "✨"
    
    const tempId = 'sec-' + Date.now()
    setData((prev: any) => ({
      ...prev,
      sections: [...prev.sections, { id: tempId, title, emoji, key: tempId, order: prev.sections.length + 1 }]
    }))

    try {
      const res = await fetch(`/api/sections`, {
        method: "POST",
        body: JSON.stringify({ title, emoji })
      })
      const section = await res.json()
      
      setData((prev: any) => ({
        ...prev,
        sections: prev.sections.map((s: any) => s.id === tempId ? section : s)
      }))
    } catch (e) {
      console.error(e)
    }
  }

  const handleExport = () => {
    window.open('/api/export', '_blank')
  }

  return (
    <main className="animate-in fade-in duration-500 pb-24">
      <header className="mb-12 flex justify-between items-end">
        <h1 className="font-serif text-4xl text-ink tracking-tight">Settings</h1>
        <button 
          onClick={handleExport}
          className="text-sm text-muted hover:text-ink transition-colors border border-line px-3 py-1 rounded hover:bg-line/20"
        >
          Export Data
        </button>
      </header>

      <div className="flex flex-col gap-12">
        {data.sections.map((section: any) => {
          const sectionTemplates = data.templates.filter((t: any) => t.sectionId === section.id && t.active !== false)
          
          return (
            <section key={section.id}>
              <h2 className="font-serif text-2xl text-ink mb-4 flex items-center gap-2">
                <span className="text-muted text-sm">{section.emoji}</span>
                {section.title}
              </h2>
              
              <ul className="flex flex-col gap-2 mb-4">
                {sectionTemplates.map((t: any) => (
                  <li key={t.id} className="flex justify-between items-center group py-2 border-b border-line last:border-b-0">
                    <span className="text-ink">{t.label}</span>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="text-muted opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1"
                      aria-label="Delete template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleAdd(section.id)}
                className="text-sm text-muted hover:text-ink transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-1 -ml-1"
              >
                + add task
              </button>
            </section>
          )
        })}

        <button
          onClick={handleAddSection}
          className="self-start text-sm text-ink bg-line/20 hover:bg-line/40 transition-colors border border-line px-4 py-2 rounded flex items-center gap-2 mt-4"
        >
          + Create New Section
        </button>
      </div>
    </main>
  )
}
