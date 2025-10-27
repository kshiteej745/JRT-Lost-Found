"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Claim } from "@/lib/types"

interface ClaimWithItem extends Claim {
  found_items: {
    id: string
    title: string
    category: string
    image_url: string | null
    location_found: string
    date_found: string
  }
}

export function MyClaimsClient({ claims }: { claims: ClaimWithItem[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (claims.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600 mb-4">You haven&apos;t submitted any claims yet.</p>
          <p className="text-sm text-gray-500">
            Browse found items and submit a claim if you find something that belongs to you.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <Card key={claim.id} className="border-0 shadow-md hover:shadow-lg transition">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              {claim.found_items.image_url && (
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={claim.found_items.image_url || "/placeholder.svg"}
                    alt={claim.found_items.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{claim.found_items.title}</h3>
                    <p className="text-sm text-gray-600">{claim.found_items.category}</p>
                  </div>
                  <Badge className={getStatusColor(claim.claim_status)}>
                    {claim.claim_status.charAt(0).toUpperCase() + claim.claim_status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-600">Location Found</p>
                    <p className="font-medium text-gray-900">{claim.found_items.location_found}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Claim Submitted</p>
                    <p className="font-medium text-gray-900">{new Date(claim.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {claim.description && (
                  <div className="text-sm">
                    <p className="text-gray-600">Your Description</p>
                    <p className="text-gray-900 line-clamp-2">{claim.description}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
