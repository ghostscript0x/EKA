"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <nav className="flex justify-between items-center mb-8 border-b border-line pb-4">
      <div className="flex gap-4 text-sm text-muted font-sans">
        <Link href="/" className="hover:text-ink transition-colors">Today</Link>
        <Link href="/history" className="hover:text-ink transition-colors">History</Link>
        <Link href="/profile" className="hover:text-ink transition-colors">Profile</Link>
        <Link href="/settings" className="hover:text-ink transition-colors">Settings</Link>
      </div>
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="text-muted hover:text-ink transition-colors p-1"
        title="Sign Out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </nav>
  );
}
