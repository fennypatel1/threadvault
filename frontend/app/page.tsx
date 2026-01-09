"use client"

import { useEffect, useState } from "react"
import ClothingCard from "./components/ClothingCard"

type ClothingItem = {
  id: string
  name: string
  category: string
  image_url?: string | null
}

export default function Home() {
  const [clothes, setClothes] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-medium tracking-tight mb-1">
  ThreadVault
</h1>
<p className="text-[var(--muted)] mb-10">
  Your digital wardrobe
</p>



      <a
        href="/upload"
        className="inline-block mb-6 text-blue-600 underline"
      >
        + Upload new item
      </a>

      {clothes.length === 0 ? (
        <p className="text-gray-500">No clothes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">


          {clothes.map((item) => (
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
