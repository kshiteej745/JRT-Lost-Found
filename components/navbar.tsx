"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-xl font-bold">J.R. Tucker High School</div>
            <div className="text-sm text-blue-200">Lost & Found</div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link href="/items" className="hover:text-blue-200 transition">
                  Browse Items
                </Link>
                <Link href="/report" className="hover:text-blue-200 transition">
                  Report Found Item
                </Link>
                <Link href="/my-claims" className="hover:text-blue-200 transition">
                  My Claims
                </Link>
                <Link href="/admin" className="hover:text-blue-200 transition">
                  Admin
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-blue-200">{user.email}</span>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="text-blue-900 bg-transparent">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="text-blue-900 bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-white text-blue-900 hover:bg-blue-50">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {user ? (
              <Button onClick={handleLogout} variant="outline" size="sm" className="text-blue-900 bg-transparent">
                Logout
              </Button>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" className="text-blue-900 bg-transparent">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
