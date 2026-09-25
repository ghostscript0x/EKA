"use client";
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <main className="min-h-[80vh] flex flex-col justify-center max-w-sm mx-auto animate-in fade-in duration-500">
      <h1 className="font-serif text-4xl text-ink tracking-tight mb-2">Welcome Back</h1>
      <p className="text-muted mb-8">Continue your discipline practice.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-ink mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-line rounded px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm text-ink mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-line rounded px-3 py-2 text-ink focus:outline-none focus:ring-1 focus:ring-accent transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-bg py-2 rounded mt-4 hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      
      <p className="text-center text-sm text-muted mt-6">
        Don't have an account? <Link href="/signup" className="text-ink hover:underline">Sign up</Link>
      </p>

      <footer className="mt-12 text-center flex justify-center gap-4 text-xs text-muted">
        <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-ink">Terms of Service</Link>
      </footer>
    </main>
  )
}
