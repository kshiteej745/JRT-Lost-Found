"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { FoundItem } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

export function ItemDetailClient({ item, user }: { item: FoundItem; user: User | null }) {
  const dateFound = new Date(item.date_found).toLocaleDateString()

  return (
    <div className="space-y-6">
      <Link href="/items" className="text-blue-600 hover:underline text-sm">
        ← Back to Items
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Image Section */}
        <div className="md:col-span-1">
          {item.image_url ? (
            <img
              src={item.image_url || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-auto rounded-lg border border-gray-300 shadow-md"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-3xl">{item.title}</CardTitle>
                <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {item.category}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Location Found</h4>
                  <p className="text-gray-600">{item.location_found}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Date Found</h4>
                  <p className="text-gray-600">{dateFound}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <Link href={`/items/${item.id}/claim`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Claim This Item</Button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Login to Claim</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
