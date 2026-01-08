"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditPage() {
  const { id } = useParams()
  const router = useRouter()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItem() {
      const res = await fetch(`http://127.0.0.1:8000/clothes/${id}`)
      const data = await res.json()
      setName(data.name)
      setCategory(data.category)
      setLoading(false)
    }

    fetchItem()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    if (image) {
      formData.append("image", image)
    }

    await fetch(`http://127.0.0.1:8000/clothes/${id}`, {
      method: "PUT",
      body: formData,
    })

    router.push("/")
  }

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <main className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files?.[0] ?? null)
          }
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Save changes
        </button>
      </form>
    </main>
  )
}
