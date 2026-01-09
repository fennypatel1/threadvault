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
      const res = await fetch(
        `http://127.0.0.1:8000/clothes/${id}`
      )
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
    if (image) formData.append("image", image)

    await fetch(
      `http://127.0.0.1:8000/clothes/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    )

    router.push("/")
    router.refresh()
  }

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div
        className="
          w-full max-w-md
          bg-[var(--foreground)]
          text-[var(--background)]
          rounded-3xl
          p-8
          shadow-sm
        "
      >
        <h1 className="text-2xl font-medium mb-1">
          Edit Item
        </h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Update details or replace the image
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-[var(--muted)]">
              Item name
            </label>
            <input
              className="
                w-full rounded-xl px-4 py-3
                bg-transparent
                border border-[var(--muted)]/30
                focus:outline-none
                focus:ring-2 focus:ring-[var(--accent)]
              "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--muted)]">
              Category
            </label>
            <input
              className="
                w-full rounded-xl px-4 py-3
                bg-transparent
                border border-[var(--muted)]/30
                focus:outline-none
                focus:ring-2 focus:ring-[var(--accent)]
              "
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--muted)]">
              Replace image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] ?? null)
              }
              className="text-sm"
            />
          </div>

          <button
            type="submit"
            className="
              w-full mt-4 py-3 rounded-xl
              bg-[var(--accent)]
              text-[var(--foreground)]
              font-medium
              hover:opacity-90
              transition
            "
          >
            Save changes
          </button>
        </form>
      </div>
    </main>
  )
}
