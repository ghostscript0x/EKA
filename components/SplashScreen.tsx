"use client";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isShown = sessionStorage.getItem("splash_shown");
    if (isShown) {
      setShow(false);
      return;
    }

    const fadeTimer = setTimeout(() => setFade(true), 1800);
    const removeTimer = setTimeout(() => {
      sessionStorage.setItem("splash_shown", "true");
      setShow(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (mounted && !show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#14140F] flex flex-col items-center justify-center transition-all duration-1000 ${
        fade ? "opacity-0 blur-md scale-110 pointer-events-none" : "opacity-100 blur-0 scale-100"
      }`}
    >
      <h1 className="font-serif text-6xl tracking-[0.2em] text-[#E6C687] animate-in fade-in zoom-in-95 duration-1000 drop-shadow-lg">
        Eka.
      </h1>
      <div className="mt-6 h-[1px] bg-[#E6C687]/50 overflow-hidden w-24 rounded-full">
        <div className="h-full bg-[#E6C687] w-full origin-left animate-in fade-in slide-in-from-left-[100%] duration-1000 delay-300" />
      </div>
    </div>
  );
}
