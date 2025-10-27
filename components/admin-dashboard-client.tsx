"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import type { FoundItem, Claim } from "@/lib/types"

interface ClaimWithItem extends Claim {
  found_items: {
    id: string
    title: string
    reported_by: string
  }
}

export function AdminDashboardClient({
  items: initialItems,
  claims: initialClaims,
}: {
  items: FoundItem[]
  claims: ClaimWithItem[]
}) {
  const [items, setItems] = useState(initialItems)
  const [claims, setClaims] = useState(initialClaims)
  const [isLoading, setIsLoading] = useState(false)

  const handleArchiveItem = async (itemId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("found_items").update({ status: "archived" }).eq("id", itemId)

      if (error) throw error

      setItems(items.map((item) => (item.id === itemId ? { ...item, status: "archived" } : item)))
    } catch (error) {
      console.error("Error archiving item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveClaim = async (claimId: string, itemId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Update claim status
      const { error: claimError } = await supabase.from("claims").update({ claim_status: "approved" }).eq("id", claimId)

      if (claimError) throw claimError

      // Update item status to claimed
      const { error: itemError } = await supabase.from("found_items").update({ status: "claimed" }).eq("id", itemId)

      if (itemError) throw itemError

      setClaims(claims.map((claim) => (claim.id === claimId ? { ...claim, claim_status: "approved" } : claim)))
      setItems(items.map((item) => (item.id === itemId ? { ...item, status: "claimed" } : item)))
    } catch (error) {
      console.error("Error approving claim:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectClaim = async (claimId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("claims").update({ claim_status: "rejected" }).eq("id", claimId)

      if (error) throw error

      setClaims(claims.map((claim) => (claim.id === claimId ? { ...claim, claim_status: "rejected" } : claim)))
    } catch (error) {
      console.error("Error rejecting claim:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const availableItems = items.filter((item) => item.status === "available")
  const claimedItems = items.filter((item) => item.status === "claimed")
  const pendingClaims = claims.filter((claim) => claim.claim_status === "pending")

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
        <TabsTrigger value="claims">Claims</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Available Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{availableItems.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Claimed Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{claimedItems.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingClaims.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingClaims.slice(0, 5).map((claim) => (
                <div key={claim.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{claim.found_items.title}</p>
                    <p className="text-sm text-gray-600">New claim pending review</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Items Tab */}
      <TabsContent value="items" className="space-y-4">
        {items.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No items found.</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                      <Badge
                        className={
                          item.status === "available"
                            ? "bg-blue-100 text-blue-800"
                            : item.status === "claimed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Category</p>
                        <p className="font-medium text-gray-900">{item.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{item.location_found}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Date Found</p>
                        <p className="font-medium text-gray-900">{new Date(item.date_found).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  {item.status === "available" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchiveItem(item.id)}
                      disabled={isLoading}
                      className="border-gray-300"
                    >
                      Archive
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      {/* Claims Tab */}
      <TabsContent value="claims" className="space-y-4">
        {claims.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No claims found.</p>
            </CardContent>
          </Card>
        ) : (
          claims.map((claim) => (
            <Card key={claim.id} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{claim.found_items.title}</h3>
                        <Badge
                          className={
                            claim.claim_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : claim.claim_status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {claim.claim_status.charAt(0).toUpperCase() + claim.claim_status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{claim.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Contact Email</p>
                          <p className="font-medium text-gray-900">{claim.contact_email}</p>
                        </div>
                        {claim.contact_phone && (
                          <div>
                            <p className="text-gray-600">Contact Phone</p>
                            <p className="font-medium text-gray-900">{claim.contact_phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {claim.claim_status === "pending" && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveClaim(claim.id, claim.item_id)}
                        disabled={isLoading}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-300 bg-transparent"
                        onClick={() => handleRejectClaim(claim.id)}
                        disabled={isLoading}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}
