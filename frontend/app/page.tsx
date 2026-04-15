"use client"


import { supabase } from "@/lib/supabase"

const API_URL = process.env.NEXT_PUBLIC_API_URL;


import { useEffect, useState } from "react"
import ClothingCard from "./components/ClothingCard"

type ClothingItem = {
  id: string
  name: string
  category: string
  image_url?: string | null
}

//const CATEGORIES = ["all", "shirt", "pants", "jacket", "shoes"]

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


  async function fetchClothes() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return
    
    const res = await fetch(`${API_URL}/clothes?user_id=${user.id}`, {
  cache: "no-store",
});

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

  function handleAddCategory() {
  if (!newCategory.trim()) return

  setCustomCategories((prev) => [
    ...prev,
    newCategory.toLowerCase(),
  ])
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

    {/* + Add category button */}
    {!showCategoryInput && (
      <button
        onClick={() => setShowCategoryInput(true)}
        className="
          px-4 py-2 rounded-full text-sm
          border border-dashed
          border-[var(--muted)]/40
          text-[var(--muted)]
          hover:bg-[var(--foreground)]/10
          transition
        "
      >
        + Add
      </button>
    )}
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

{/* Add category input (appears below pills) */}
{showCategoryInput && (
  <div className="flex gap-2 mb-10">
    <input
      type="text"
      placeholder="New category"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      className="
        px-3 py-2 rounded-lg text-sm
        bg-[var(--foreground)]
        text-[var(--background)]
        border border-[var(--muted)]/30
        focus:outline-none
        focus:ring-2 focus:ring-[var(--accent)]
      "
    />
    <button
      onClick={handleAddCategory}
      disabled={!newCategory.trim()}
      className="
        px-4 py-2 rounded-lg text-sm
        bg-[var(--accent)]
        text-[var(--foreground)]
        disabled:opacity-50
      "
    >
      Add
    </button>
  </div>
)}


      {/* Grid */}
      {filteredClothes.length === 0 ? (
  <div className="py-24 text-center">
    <p className="text-lg font-medium mb-2">
  Your closet is empty
</p>
<p className="text-[var(--muted)] mb-4">
  Add your first piece to start building your wardrobe.
</p>
<a
  href="/upload"
  className="
    inline-block px-5 py-3 rounded-xl text-sm font-medium
    bg-[var(--accent)]
    text-[var(--foreground)]
    hover:opacity-90
  "
>
  Upload your first item
</a>

    <p className="text-[var(--muted)]">
      Try adjusting filters or add your first piece.
    </p>
  </div>
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
