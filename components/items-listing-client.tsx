"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { FoundItem } from "@/lib/types"

const CATEGORIES = ["All", "Electronics", "Clothing", "Accessories", "Books", "Sports Equipment", "Other"]

export function ItemsListingClient({ initialItems }: { initialItems: FoundItem[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location_found.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, initialItems])

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Search Items</label>
            <Input
              placeholder="Search by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={
                    selectedCategory === cat
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No items found matching your search.</p>
            <p className="text-sm text-gray-500">Try adjusting your search terms or category filters.</p>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-gray-600">
        Showing {filteredItems.length} of {initialItems.length} items
      </div>
    </div>
  )
}

function ItemCard({ item }: { item: FoundItem }) {
  const dateFound = new Date(item.date_found).toLocaleDateString()

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition overflow-hidden">
      {item.image_url && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-gray-700 min-w-fit">Location:</span>
            <span className="text-gray-600">{item.location_found}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-gray-700 min-w-fit">Date Found:</span>
            <span className="text-gray-600">{dateFound}</span>
          </div>
        </div>

        <Link href={`/items/${item.id}`} className="block">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details & Claim</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
