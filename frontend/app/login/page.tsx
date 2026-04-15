"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignup, setIsSignup] = useState(false)

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) alert(error.message)
      else alert("Check your email to confirm!")
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) alert(error.message)
      else router.push("/")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleAuth} className="space-y-4 w-80">
        <h1 className="text-xl font-semibold">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white w-full py-2">
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          className="text-sm cursor-pointer text-blue-500"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "No account? Sign up"}
        </p>
      </form>
    </main>
  )
}