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

      if (error) setMessage(error.message)
      else setMessage("Check your email to confirm your account!")
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) setMessage(error.message)
      else router.push("/")
    }

    setLoading(false)
  }

  // 🔥 DEMO LOGIN
  async function handleDemoLogin() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: "demo@threadvault.com",
      password: "demopassword123",
    })

    if (error) {
      setMessage("Demo login failed")
    } else {
      router.push("/")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
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

        {/* Message */}
        {message && (
          <div className="mb-4 rounded-xl bg-[var(--accent)]/20 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {/* 🔥 DEMO BUTTON */}
        <button
          onClick={handleDemoLogin}
          className="
            w-full mb-4 py-3 rounded-xl
            bg-[var(--accent)]
            text-[var(--foreground)]
            font-medium
            hover:opacity-90
            transition
          "
        >
          Try Demo →
        </button>

        <div className="text-center text-xs text-[var(--muted)] mb-4">
          or sign in with your account
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {/* Email */}
          <input
            className="w-full rounded-xl px-4 py-3 border border-[var(--muted)]/30"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            className="w-full rounded-xl px-4 py-3 border border-[var(--muted)]/30"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit */}
          <button
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-black text-white
              hover:opacity-90
              transition
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
          className="mt-6 text-sm text-center cursor-pointer hover:underline"
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