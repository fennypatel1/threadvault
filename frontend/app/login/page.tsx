"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type ClothingItem = {
  id: string
  name: string
  category: string
  image_url?: string | null
}

export default function HomePage() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)

  // 🔐 get user
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    getUser()
  }, [])

  // 👕 fetch clothes if logged in
  useEffect(() => {
    async function fetchClothes() {
      if (!user) return

      const res = await fetch(`${API_URL}/clothes?user_id=${user.id}`, {
        cache: "no-store",
      })

      const data = await res.json()
      setItems(data)
    }

    fetchClothes()
  }, [user])

  // 🔥 DEMO LOGIN
  async function handleDemoLogin() {
    await supabase.auth.signInWithPassword({
      email: "demo@threadvault.com",
      password: "demopassword123",
    })

    router.refresh()
  }

  return (
    <main className="min-h-screen px-8 py-10">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-semibold">ThreadVault</h1>
          <p className="text-[var(--muted)] mt-1">
            Your digital wardrobe
          </p>
        </div>

        <div className="flex gap-3">
          {!user && (
            <>
              <button
                onClick={handleDemoLogin}
                className="
                  px-5 py-2 rounded-full
                  bg-[var(--accent)]
                  text-[var(--foreground)]
                  font-medium
                  hover:opacity-90
                  transition
                "
              >
                Try Demo →
              </button>

              <a
                href="/login"
                className="
                  px-5 py-2 rounded-full
                  bg-black text-white
                  hover:opacity-90
                  transition
                "
              >
                Login
              </a>
            </>
          )}

          {user && (
            <a
              href="/upload"
              className="
                px-5 py-2 rounded-full
                bg-[var(--accent)]
                text-[var(--foreground)]
                hover:opacity-90
              "
            >
              Upload
            </a>
          )}
        </div>
      </div>

      {/* FILTER / SEARCH ROW */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-full bg-[var(--accent)] text-sm">
            All · {items.length}
          </div>

          <button className="px-4 py-2 rounded-full border border-dashed text-sm opacity-60">
            + Add
          </button>
        </div>

        <input
          placeholder="Search..."
          className="
            px-5 py-2 rounded-full
            bg-black/80 text-white
            placeholder:text-gray-400
            w-64
          "
        />
      </div>

      {/* 👇 NOT LOGGED IN STATE (CLEAN CARD) */}
      {!user && !loading && (
        <div className="flex justify-center mt-24">
          <div
            className="
              bg-gray-100
              text-gray-700
              rounded-2xl
              px-10 py-8
              shadow-sm
              text-center
              max-w-md
            "
          >
            <h2 className="text-lg font-medium mb-2">
              Start your digital closet
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Sign in to upload, organize, and manage your clothing
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleDemoLogin}
                className="
                  px-5 py-2 rounded-full
                  bg-[var(--accent)]
                  text-[var(--foreground)]
                  text-sm
                  hover:opacity-90
                "
              >
                Try Demo
              </button>

              <a
                href="/login"
                className="
                  px-5 py-2 rounded-full
                  bg-black text-white
                  text-sm
                  hover:opacity-90
                "
              >
                Login
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 👕 CLOSET GRID */}
      {user && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="
                bg-[var(--foreground)]
                text-[var(--background)]
                rounded-2xl
                overflow-hidden
                shadow-sm
              "
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  className="w-full h-60 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm opacity-60">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}