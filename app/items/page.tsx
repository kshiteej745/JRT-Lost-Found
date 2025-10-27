import { Navbar } from "@/components/navbar"
import { ItemsListingClient } from "@/components/items-listing-client"
import { createClient } from "@/lib/supabase/server"

export default async function ItemsPage() {
  const supabase = await createClient()

  // Fetch all available items
  const { data: items, error } = await supabase
    .from("found_items")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching items:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Found Items</h1>
          <p className="text-gray-600">Browse all items found at J.R. Tucker High School</p>
        </div>
        <ItemsListingClient initialItems={items || []} />
      </div>
    </div>
  )
}
