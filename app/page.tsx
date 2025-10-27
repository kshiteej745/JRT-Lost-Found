import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Lost Something?</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            J.R. Tucker High School Lost & Found System helps you report found items and search for your lost
            belongings. Browse our database of found items or report items you&apos;ve found.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/items">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Browse Found Items
              </Button>
            </Link>
            <Link href="/report">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Report Found Item
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-blue-600">Report Found Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Found something? Upload a photo and description to help reunite items with their owners.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-blue-600">Search & Browse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Search through our database of found items by category, location, or date to find your lost belongings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-blue-600">Claim Your Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Found your item? Submit a claim with details to verify ownership and arrange pickup.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Create an account to report found items or search for your lost belongings.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2025 J.R. Tucker High School Lost & Found System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
