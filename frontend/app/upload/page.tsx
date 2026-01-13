"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    if (image) formData.append("image", image)

    await fetch("http://127.0.0.1:8000/clothes", {
  method: "POST",
  body: formData,
})

setSuccess(true) // 👈 ADD

setTimeout(() => {
  router.push("/")
  router.refresh()
}, 800)

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
          Add to ThreadVault
        </h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Upload a new piece to your closet
        </p>
        {success && (
        <div className="mb-4 rounded-xl bg-[var(--accent)]/20 text-[var(--foreground)] px-4 py-3 text-sm">
          Added to your closet ✨
        </div>
      )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
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

          {/* Category */}
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

          {/* Image */}
          <div>
            <label className="block text-sm mb-1 text-[var(--muted)]">
              Image
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-4 py-3 rounded-xl
              bg-[var(--accent)]
              text-[var(--foreground)]
              font-medium
              hover:opacity-90
              transition
            "
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </main>
  )
}
