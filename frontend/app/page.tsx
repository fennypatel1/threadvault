"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import ClothingCard from "./components/ClothingCard"
import { demoItems } from "@/lib/demoData" // ✅ NEW

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

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  // 🔥 UPDATED FETCH
  async function fetchClothes() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      setUser(user)

      if (!user) {
        setClothes(demoItems)
        setLoading(false)
        return
      }

      const res = await fetch(`${API_URL}/clothes?user_id=${user.id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch clothes")

      const data = await res.json()
      setClothes(data)
    } catch (err) {
      console.error("Fetch clothes error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClothes()
  }, [])

  const isDemo = !user // ✅ NEW

  function handleDelete(id: string) {
    if (isDemo) return // ✅ BLOCK IN DEMO
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
    <main className="max-w-7xl mx-auto px-6 py-12">

      {/* 🔥 DEMO BANNER */}
      {isDemo && (
        <div className="bg-blue-50 text-blue-800 text-sm py-3 text-center rounded-xl mb-6">
          You’re viewing a demo —
          <button
            onClick={() => window.location.href = "/login"}
            className="ml-2 underline font-medium"
          >
            Sign up to create your own closet
          </button>
        </div>
      )}

      {/* Top Right Auth */}
      <div className="flex justify-end mb-4">
        {user ? (
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.reload()
            }}
            className="text-sm px-4 py-2 bg-black text-white rounded"
          >
            Logout
          </button>
        ) : (
          <a
            href="/login"
            className="text-sm px-4 py-2 bg-black text-white rounded"
          >
            Sign In
          </a>
        )}
      </div>

      {/* ✅ EMPTY STATE (only for REAL users) */}
      {user && filteredClothes.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-lg font-medium mb-2">
            Your closet is empty
          </p>
          <p className="text-[var(--muted)] mb-4">
            Add your first piece to start building your wardrobe.
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
          {/* Header */}
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
                className="
                  px-5 py-3 rounded-xl text-sm font-medium
                  bg-[var(--accent)]
                  text-[var(--foreground)]
                  hover:opacity-90
                  transition
                "
              >
                Upload
              </a>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-3 items-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm capitalize transition
                    ${
                      selectedCategory === category
                        ? "bg-[var(--accent)] text-[var(--foreground)]"
                        : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-80"
                    }
                  `}
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
              className="
                w-full sm:w-64
                px-4 py-2 rounded-xl
                bg-[var(--foreground)]
                text-[var(--background)]
                border border-[var(--muted)]/30
              "
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {filteredClothes.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                isDemo={isDemo} // ✅ NEW
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}