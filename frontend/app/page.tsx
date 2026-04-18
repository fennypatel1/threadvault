"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import ClothingCard from "./components/ClothingCard"
import { demoItems } from "@/lib/demoData"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClothingItem = {
  id: string
  name: string
  category: string
  image_url?: string | null
}

function countByCategory(
  clothes: ClothingItem[],
  category: string
) {
  if (category === "all") return clothes.length
  return clothes.filter(
    (item) => item.category.toLowerCase() === category
  ).length
}

export default function Home() {
  const [clothes, setClothes] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [user, setUser] = useState<any>(null)


  async function fetchUserClothes(userId: string) {
  try {
    const res = await fetch(`${API_URL}/clothes?user_id=${userId}`, {
      cache: "no-store",
    })

    if (!res.ok) throw new Error("Failed")

    const data = await res.json()
    setClothes(data)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
  let mounted = true

  async function loadData() {
    setLoading(true)

    const { data } = await supabase.auth.getSession()
    const sessionUser = data.session?.user ?? null

    if (!mounted) return

    setUser(sessionUser)

    if (!sessionUser) {
      // 🔥 DEMO MODE — HARD RESET
      setClothes([...demoItems])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/clothes?user_id=${sessionUser.id}`, {
        cache: "no-store",
      })

      if (!res.ok) throw new Error("Failed")

      const realData = await res.json()

      if (!mounted) return

      // 🔥 CRITICAL: overwrite, NOT merge
      setClothes(realData)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  loadData()

  const { data: listener } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      const currentUser = session?.user ?? null

      setUser(currentUser)

      if (!currentUser) {
        // 🔥 HARD RESET AGAIN
        setClothes([...demoItems])
        return
      }

      try {
        const res = await fetch(`${API_URL}/clothes?user_id=${currentUser.id}`)
        const realData = await res.json()
        setClothes(realData)
      } catch (err) {
        console.error(err)
      }
    }
  )

  return () => {
    mounted = false
    listener.subscription.unsubscribe()
  }
}, [])

  const isDemo = !user

  // ✅ DEMO-FRIENDLY DELETE
  function handleDelete(id: string) {
    setClothes((prev) => prev.filter((item) => item.id !== id))
  }

  function handleAddCategory() {
    if (!newCategory.trim()) return
    setCustomCategories((prev) => [...prev, newCategory.toLowerCase()])
    setNewCategory("")
    setShowCategoryInput(false)
  }

  const categories = [
    "all",
    ...Array.from(
      new Set([
        ...clothes.map((item) => item.category.toLowerCase()),
        ...customCategories.map((c) => c.toLowerCase()),
      ])
    ),
  ]

  const filteredClothes = clothes
    .filter((item) =>
      selectedCategory === "all"
        ? true
        : item.category.toLowerCase() === selectedCategory
    )
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 bg-[#f5f5f0]">

      {/* DEMO BANNER */}
      {isDemo && (
        <div className="mb-10 flex justify-center">
          <div className="px-5 py-2 rounded-full bg-white/70 backdrop-blur border text-sm flex items-center gap-2 shadow-sm">
            <span className="text-gray-500">Demo</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <button
              onClick={() => (window.location.href = "/login")}
              className="font-medium hover:underline"
            >
              Create your closet →
            </button>
          </div>
        </div>
      )}

      {/* AUTH BUTTONS */}
      <div className="flex justify-end mb-4">
        {user ? (
          <button
            onClick={async () => {
              await supabase.auth.signOut()
            }}
            className="text-sm px-4 py-2 bg-black text-white rounded"
          >
            Logout
          </button>
        ) : (
          <div className="flex gap-3">
            <a
              href="/login"
              className="text-sm px-4 py-2 bg-black text-white rounded"
            >
              Sign In
            </a>

            {/* 🔥 FIXED DEMO BUTTON */}
            <button
            onClick={async () => {
              await supabase.auth.signOut()

              // 🔥 FORCE RESET IMMEDIATELY
              setUser(null)
              setClothes([...demoItems])
            }}
          >
            Try Demo
          </button>
          </div>
        )}
      </div>

      {/* EMPTY STATE (ONLY REAL USERS) */}
      {user && filteredClothes.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-lg font-medium mb-2">
            Your closet is empty
          </p>
          <a
            href="/upload"
            className="px-5 py-3 bg-[var(--accent)] rounded-xl"
          >
            Upload your first item
          </a>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-medium tracking-tight mb-1">
                ThreadVault
              </h1>
              <p className="text-[var(--muted)]">
                Your digital wardrobe
              </p>
            </div>

            {user && (
              <a
                href="/upload"
                className="px-5 py-3 rounded-xl bg-[var(--accent)] text-white"
              >
                Upload
              </a>
            )}
          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-3 items-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm capitalize ${
                    selectedCategory === category
                      ? "bg-black text-white"
                      : "bg-white text-black border"
                  }`}
                >
                  {category} · {countByCategory(clothes, category)}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-xl border"
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredClothes.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                isDemo={isDemo}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}