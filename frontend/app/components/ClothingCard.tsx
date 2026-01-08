type ClothingItem = {
  id: string
  name: string
  category: string
  image_url?: string | null
}

export default function ClothingCard({ item }: { item: ClothingItem }) {
  return (
    <div className="border rounded-lg p-3 shadow-sm">
      {item.image_url && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${item.image_url}`}
          alt={item.name}
          className="w-full h-48 object-cover rounded"
        />
      )}
      <div className="mt-2">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
      </div>
    </div>
  )
}
