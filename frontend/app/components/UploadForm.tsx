"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"


export default function UploadForm() {
    const router = useRouter()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    if (image) {
      formData.append("image", image)
    }

    await fetch("http://127.0.0.1:8000/clothes", {
      method: "POST",
      body: formData,
    })

    router.push("/")
router.refresh()

  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md"
    >
      <input
        className="border p-2 w-full rounded"
        placeholder="Clothing name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full rounded"
        placeholder="Category"
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
        required
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  )
}
