"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.push("/")
      }
    }
    checkUser()
  }, [router])

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage("Check your email to confirm your account!")
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        router.push("/")
      }
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative">

      {/* ✅ Back button */}
      <a
        href="/"
        className="
          absolute top-6 left-6
          text-sm px-4 py-2 rounded-full
          bg-[var(--foreground)]
          text-[var(--background)]
          border border-[var(--muted)]/30
          hover:opacity-80
          transition
        "
      >
        ← Back
      </a>

      <div
        className="
          w-full max-w-md
          bg-[var(--foreground)]
          text-[var(--background)]
          rounded-3xl
          p-8
          shadow-sm
        "
      >
        <h1 className="text-2xl font-medium mb-1">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          {isSignup
            ? "Start building your digital closet"
            : "Login to access your wardrobe"}
        </p>

        {/* ✅ Success / Error message */}
        {message && (
          <div className="mb-4 rounded-xl bg-[var(--accent)]/20 text-[var(--foreground)] px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-[var(--muted)]">
              Email
            </label>
            <input
              className="
                w-full rounded-xl px-4 py-3
                bg-transparent
                border border-[var(--muted)]/30
                focus:outline-none
                focus:ring-2 focus:ring-[var(--accent)]
              "
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-[var(--muted)]">
              Password
            </label>
            <input
              type="password"
              className="
                w-full rounded-xl px-4 py-3
                bg-transparent
                border border-[var(--muted)]/30
                focus:outline-none
                focus:ring-2 focus:ring-[var(--accent)]
              "
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="
              w-full mt-2 py-3 rounded-xl
              bg-[var(--accent)]
              text-[var(--foreground)]
              font-medium
              hover:opacity-90
              transition
              disabled:opacity-60
            "
          >
            {loading
              ? "Loading..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <p
          className="
            mt-6 text-sm text-center
            text-[var(--muted)]
            cursor-pointer
            hover:underline
          "
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "No account? Sign up"}
        </p>
      </div>
    </main>
  )
}