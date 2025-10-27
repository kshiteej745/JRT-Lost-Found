import { Navbar } from "@/components/navbar"
import { AdminDashboardClient } from "@/components/admin-dashboard-client"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  // Fetch all items
  const { data: items } = await supabase.from("found_items").select("*").order("created_at", { ascending: false })

  // Fetch all claims
  const { data: claims } = await supabase
    .from("claims")
    .select(
      `
      *,
      found_items:item_id (
        id,
        title,
        reported_by
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage found items and review claims</p>
        </div>
        <AdminDashboardClient items={items || []} claims={claims || []} />
      </div>
    </div>
  )
}
