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

  useEffect(() => {
    async function fetchClothes() {
      const res = await fetch("http://127.0.0.1:8000/clothes")
      const data = await res.json()
      setClothes(data)
      setLoading(false)
    }

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
      <h1 className="text-4xl font-medium tracking-tight mb-1">
        ThreadVault
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Your digital wardrobe
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm capitalize
                transition
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
