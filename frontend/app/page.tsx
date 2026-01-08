import ClothingCard from "./components/ClothingCard"

async function getClothes() {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clothes`,
    { cache: "no-store" }
  )

  return res.json()
}


export default async function Home() {
  const clothes = await getClothes()

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Closet</h1>

      {clothes.length === 0 ? (
        <p className="text-gray-500">No clothes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {clothes.map((item: any) => {
            //console.log(item)
            return <ClothingCard key={item.id} item={item} />
})}

        </div>
      )}
    </main>
  )
}
