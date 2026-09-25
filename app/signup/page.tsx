"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col justify-center max-w-sm mx-auto animate-in fade-in duration-500">
      <h1 className="font-serif text-4xl text-ink tracking-tight mb-2">Join Eka</h1>
      <p className="text-muted mb-8">Begin your discipline practice.</p>

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
        
        <label className="flex items-start gap-3 mt-2 cursor-pointer group">
          <input type="checkbox" required className="mt-1" />
          <span className="text-sm text-muted group-hover:text-ink transition-colors">
            I agree to the <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </span>
        </label>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-bg py-2 rounded mt-4 hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
      
      <p className="text-center text-sm text-muted mt-6">
        Already have an account? <Link href="/login" className="text-ink hover:underline">Log in</Link>
      </p>

      <footer className="mt-12 text-center flex justify-center gap-4 text-xs text-muted">
        <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-ink">Terms of Service</Link>
      </footer>
    </main>
  );
}
