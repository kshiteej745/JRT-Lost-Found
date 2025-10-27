import { Navbar } from "@/components/navbar"
import { ItemDetailClient } from "@/components/item-detail-client"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: item, error } = await supabase.from("found_items").select("*").eq("id", params.id).single()

  if (error || !item) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ItemDetailClient item={item} user={user} />
      </div>
    </div>
  )
}
