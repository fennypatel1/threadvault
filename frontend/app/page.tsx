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

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2">My Closet</h1>

      <a
        href="/upload"
        className="inline-block mb-6 text-blue-600 underline"
      >
        + Upload new item
      </a>

      {clothes.length === 0 ? (
        <p className="text-gray-500">No clothes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {clothes.map((item) => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  )
}
