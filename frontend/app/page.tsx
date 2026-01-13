"use client"

import { useEffect, useState } from "react"
import ClothingCard from "./components/ClothingCard"

type ClothingItem = {
  id: string
  name: string
  category: string
  image_url?: string | null
}

const CATEGORIES = ["all", "shirt", "pants", "jacket", "shoes"]

export default function Home() {
  const [clothes, setClothes] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  async function fetchClothes() {
  try {
    const res = await fetch("http://127.0.0.1:8000/clothes", {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch clothes")
    }

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

  function handleDelete(id: string) {
    setClothes((prev) => prev.filter((item) => item.id !== id))
  }

  const filteredClothes = clothes
    .filter((item) =>
      selectedCategory === "all"
        ? true
        : item.category.toLowerCase() === selectedCategory
    )
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
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
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
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
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
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
            focus:outline-none
            focus:ring-2 focus:ring-[var(--accent)]
          "
        />
      </div>

      {/* Grid */}
      {filteredClothes.length === 0 ? (
        <p className="text-[var(--muted)]">
          No items match your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredClothes.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  )
}
