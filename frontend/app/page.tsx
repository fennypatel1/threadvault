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

function countByCategory(clothes: ClothingItem[], category: string) {
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
      })
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

  const isDemo = !user

  function handleDelete(id: string) {
    if (isDemo) return
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

      {/* DEMO BANNER */}
      {isDemo && (
        <div className="bg-[var(--foreground)] text-[var(--background)] text-sm py-3 text-center rounded-xl mb-6">
          Viewing demo —{" "}
          <a href="/login" className="underline font-medium">
            Create your closet →
          </a>
        </div>
      )}

      {/* HERO — demo viewers only */}
{isDemo && (
  <div className="text-center py-10 mb-4">
    <h2 className="text-3xl font-medium tracking-tight mb-3">
      Your wardrobe, organized digitally
    </h2>
    <p className="text-[var(--muted)] max-w-md mx-auto mb-6 text-sm">
      ThreadVault lets you catalog your clothes, browse by category, and plan outfits — without digging through your closet.
    </p>
    <div className="flex flex-wrap justify-center gap-4 text-sm text-[var(--muted)] mb-8">
      <span>✦ Upload & organize clothes</span>
      <span>✦ Browse by category</span>
      <span>✦ Search your wardrobe</span>
      <span>✦ Built with a full PRD & user research</span>
    </div>

    <a
      href="/login"
      className="px-6 py-3 rounded-xl bg-[var(--accent)] text-[var(--foreground)] font-medium hover:opacity-90 transition text-sm"
    >
      Sign up to build yours →
    </a>
  </div>
)}

      {/* AUTH */}
      <div className="flex justify-end mb-4">
        {user ? (
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.reload()
            }}
            className="text-sm px-4 py-2 bg-[var(--accent)] text-[var(--foreground)] rounded-xl"
          >
            Sign Out
          </button>
        ) : (
          <a
            href="/login"
            className="text-sm px-4 py-2 bg-[var(--accent)] text-[var(--foreground)] rounded-xl"
          >
            Sign In
          </a>
        )}
      </div>

      {/* EMPTY STATE */}
      {user && filteredClothes.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-lg font-medium mb-2">Your closet is empty</p>
          <p className="text-[var(--muted)] mb-4">
            Add your first piece to start building your wardrobe.
          </p>

          <a
            href="/upload"
            className="px-5 py-3 bg-[var(--accent)] text-[var(--foreground)] rounded-xl"
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
                {isDemo ? "A demo wardrobe" : "Your digital wardrobe"}
              </p>
            </div>

            {user && (
              <a
                href="/upload"
                className="px-5 py-3 rounded-xl text-sm font-medium bg-[var(--accent)] text-[var(--foreground)] hover:opacity-90 transition"
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

              {user && !showCategoryInput && (
                <button
                  onClick={() => setShowCategoryInput(true)}
                  className="px-4 py-2 rounded-full text-sm border border-dashed border-[var(--muted)]/40 text-[var(--muted)] hover:opacity-80 transition"
                >
                  + Add
                </button>
              )}

              {user && showCategoryInput && (
                <div className="flex gap-2 items-center">
                  <input
                    autoFocus
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                    placeholder="Category name"
                    className="px-3 py-1 rounded-xl border border-[var(--muted)]/30 text-sm bg-transparent text-[var(--foreground)]"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-3 py-1 rounded-xl bg-[var(--accent)] text-[var(--foreground)] text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowCategoryInput(false)
                      setNewCategory("")
                    }}
                    className="text-sm text-[var(--muted)] hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] border border-[var(--muted)]/30"
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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