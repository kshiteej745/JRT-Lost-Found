import { Navbar } from "@/components/navbar"
import { ClaimItemForm } from "@/components/claim-item-form"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"

export default async function ClaimPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: item, error } = await supabase.from("found_items").select("*").eq("id", params.id).single()

  if (error || !item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Claim Item</h1>
          <p className="text-gray-600">Submit a claim for: {item.title}</p>
        </div>
        <ClaimItemForm itemId={item.id} userId={user.id} userEmail={user.email || ""} />
      </div>
    </div>
  )
}
