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
    <div className="border rounded-lg p-3 shadow-sm relative">
      {item.image_url && (
        <img
          src={`http://127.0.0.1:8000${item.image_url}`}
          alt={item.name}
          className="w-full h-48 object-cover rounded"
        />
      )}

      <div className="mt-2">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
      </div>

      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-xs bg-red-600 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  )
}
