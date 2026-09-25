"use client";
import { useState, useEffect } from "react";

export function Onboarding() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) nav.style.display = 'none';
    return () => {
      if (nav) nav.style.display = 'flex';
    }
  }, []);

  const handleCreateStarter = async () => {
    setLoading(true);
    try {
      // Create first section
      const secRes = await fetch(`/api/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Morning Routine", emoji: "🌅" })
      });
      const section = await secRes.json();

      // Create first task
      await fetch(`/api/templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId: section.id, label: "Wake up before 7 AM" })
      });

      window.location.reload();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in-95 duration-1000">
      <h2 className="font-serif text-4xl text-ink mb-6">Welcome to Eka.</h2>
      
      <div className="max-w-md text-muted space-y-4 mb-12">
        <p>Eka is a blank slate. There are no predefined habits, no bloated trackers, and no confetti.</p>
        <p><strong>The Midnight Burn:</strong> You cannot log tasks for past days. If you miss a day, it burns. Only honest discipline remains.</p>
        <p><strong>The Focus:</strong> You can pin one single task per day as your absolute priority.</p>
      </div>

      <button 
        onClick={handleCreateStarter}
        disabled={loading}
        className="bg-ink text-bg px-6 py-3 rounded-md hover:bg-ink/90 transition-all font-sans text-sm disabled:opacity-50"
      >
        {loading ? "Forging..." : "Forge Your First Discipline"}
      </button>
    </div>
  );
}
