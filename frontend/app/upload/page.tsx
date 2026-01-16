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
  const [preview, setPreview] = useState<string | null>(null)

function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return

  setImage(file)
  setPreview(URL.createObjectURL(file))
}


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
<div className="space-y-3">
  <label className="block text-sm text-[var(--muted)]">
    Image
  </label>

  {/* Hidden file input */}
  <input
    id="image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />

  {/* Custom upload button */}
  <label
    htmlFor="image-upload"
    className="
      cursor-pointer
      flex items-center justify-center gap-2
      rounded-xl border border-dashed
      border-[var(--muted)]/40
      bg-[var(--foreground)]/5
      px-4 py-6
      text-sm font-medium
      text-[var(--muted)]
      hover:bg-[var(--foreground)]/10
      transition
    "
  >
    <span className="text-lg">📷</span>
    <span>{image ? "Change photo" : "Upload clothing photo"}</span>
  </label>

  {/* Preview */}
  {preview && (
    <div className="relative w-full h-56 rounded-xl overflow-hidden border border-[var(--muted)]/30">
      <img
        src={preview}
        alt="Preview"
        className="object-cover w-full h-full"
      />
    </div>
  )}
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
    transition
    hover:opacity-90
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
>
  {loading ? "Uploading…" : "Upload"}
</button>

        </form>
      </div>
    </main>
  )
}
