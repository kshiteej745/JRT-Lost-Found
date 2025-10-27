import { Navbar } from "@/components/navbar"
import { ReportItemForm } from "@/components/report-item-form"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ReportPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Report Found Item</h1>
          <p className="text-gray-600">
            Help reunite lost items with their owners by providing details about what you found.
          </p>
        </div>
        <ReportItemForm userId={user.id} />
      </div>
    </div>
  )
}
