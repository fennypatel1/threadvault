"use client"

type ClothingItem = {
  id: string
  name: string
  category: string
  image_url?: string | null
}

export default function ClothingCard({
  item,
  onDelete,
}: {
  item: ClothingItem
  onDelete: (id: string) => void
}) {
  async function handleDelete() {
    const confirmed = confirm(
      `Delete "${item.name}"? This cannot be undone.`
    )

    if (!confirmed) return

    await fetch(`http://127.0.0.1:8000/clothes/${item.id}`, {
      method: "DELETE",
    })

    onDelete(item.id)
  }

  return (
    <div
      className="
        relative
        bg-[var(--foreground)]
        text-[var(--background)]
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
      "
    >
      {item.image_url && (
        <img
          src={`http://127.0.0.1:8000${item.image_url}`}
          alt={item.name}
          className="
            w-full
            h-60
            object-cover
            transition-transform
            duration-500
            hover:scale-[1.02]
          "
        />
      )}

      {/* Edit button */}
      <a
        href={`/edit/${item.id}`}
        className="
          absolute top-3 left-3
          text-xs px-3 py-1 rounded-full
          bg-[var(--foreground)]/80
          text-[var(--background)]
          backdrop-blur
          hover:bg-[var(--foreground)]
          transition
        "
      >
        Edit
      </a>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="
          absolute top-3 right-3
          text-xs px-3 py-1 rounded-full
          bg-[var(--background)]/70
          text-[var(--foreground)]
          backdrop-blur
          hover:bg-[var(--background)]
          transition
        "
      >
        Delete
      </button>

      <div className="p-4">
        <h3 className="font-medium text-lg leading-tight">
          {item.name}
        </h3>
        <p className="text-sm text-[var(--muted)] capitalize">
          {item.category}
        </p>
      </div>
    </div>
  )
}
