"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal } from "lucide-react"
import { supabase } from "@/lib/supabase"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClothingItem = {
  id: string
  name: string
  category: string
  image_url?: string | null
}

export default function ClothingCard({
  item,
  onDelete,
  isDemo,
}: {
  item: ClothingItem
  onDelete: (id: string) => void
  isDemo?: boolean
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleDeleteClick() {
    if (isDemo) return

    const confirmed = confirm(`Delete "${item.name}"?`)
    if (!confirmed) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await fetch(`${API_URL}/clothes/${item.id}?user_id=${user.id}`, {
      method: "DELETE",
    })

    onDelete(item.id)
  }

  return (
    <div className="relative bg-[var(--foreground)] text-[var(--background)] rounded-2xl overflow-hidden hover:shadow-lg transition">

      {!isDemo && (
        <div ref={menuRef} className="absolute top-3 right-3 z-10">
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded-full bg-white/80 backdrop-blur"
          >
            <MoreHorizontal size={18} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow border text-sm">
              
              {/* ✅ FIXED EDIT LINK */}
              <a
                href={`/edit/${item.id}`}
                className="block px-3 py-2 hover:bg-gray-100 text-black"
              >
                Edit
              </a>

              <button
                onClick={handleDeleteClick}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-60 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="font-medium text-lg">{item.name}</h3>
        <p className="text-sm text-[var(--muted)] capitalize">{item.category}</p>
      </div>
    </div>
  )
}