import { Navbar } from "@/components/navbar"
import { MyClaimsClient } from "@/components/my-claims-client"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function MyClaimsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's claims with item details
  const { data: claims, error } = await supabase
    .from("claims")
    .select(
      `
      *,
      found_items:item_id (
        id,
        title,
        category,
        image_url,
        location_found,
        date_found
      )
    `,
    )
    .eq("claimed_by", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching claims:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">My Claims</h1>
          <p className="text-gray-600">Track the status of your item claims</p>
        </div>
        <MyClaimsClient claims={claims || []} />
      </div>
    </div>
  )
}
