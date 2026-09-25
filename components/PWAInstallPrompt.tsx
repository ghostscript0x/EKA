"use client"
import { useEffect, useState } from "react"
import { Download } from "lucide-react"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferredPrompt || isDismissed) return null

  const handleInstall = async () => {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-ink text-bg p-4 rounded shadow-lg flex items-center justify-between z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <Download className="w-5 h-5 text-gold" />
        <span className="text-sm font-sans">Install Eka App</span>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setIsDismissed(true)} className="text-xs text-muted hover:text-bg transition-colors">Skip</button>
        <button onClick={handleInstall} className="text-xs font-bold text-bg bg-gold px-2 py-1 rounded">Install</button>
      </div>
    </div>
  )
}
