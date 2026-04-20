"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EditPage() {
  const { id } = useParams()
  const router = useRouter()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItem() {
      const res = await fetch(`${API_URL}/clothes/${id}`)
      const data = await res.json()
      setName(data.name)
      setCategory(data.category)
      setCurrentImageUrl(data.image_url ?? null)
      setLoading(false)
    }
    fetchItem()
  }, [id])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("You must be logged in to edit items")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    formData.append("user_id", user.id)
    if (image) formData.append("image", image)

    await fetch(`${API_URL}/clothes/${id}`, {
      method: "PUT",
      body: formData,
    })

    router.push("/")
    router.refresh()
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[var(--foreground)] text-[var(--background)] rounded-3xl p-8 shadow-sm">
        <h1 className="text-2xl font-medium mb-1">Edit Item</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Update details or replace the image
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-[var(--muted)]">Item name</label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-transparent border border-[var(--muted)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--muted)]">Category</label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-transparent border border-[var(--muted)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-[var(--muted)]">Image</label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--muted)]/40 bg-[var(--foreground)]/5 px-4 py-6 text-sm font-medium text-[var(--muted)] hover:bg-[var(--foreground)]/10 transition"
            >
              <span className="text-lg">📷</span>
              <span>{image ? "Change photo" : "Replace photo"}</span>
            </label>

            {(preview || currentImageUrl) && (
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-[var(--muted)]/30">
                <img
                  src={preview ?? currentImageUrl ?? ""}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl bg-[var(--accent)] text-[var(--foreground)] font-medium hover:opacity-90 transition"
          >
            Save changes
          </button>
        </form>
      </div>
    </main>
  )
}