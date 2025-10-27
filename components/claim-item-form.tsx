"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function ClaimItemForm({ itemId, userId, userEmail }: { itemId: string; userId: string; userEmail: string }) {
  const [description, setDescription] = useState("")
  const [contactEmail, setContactEmail] = useState(userEmail)
  const [contactPhone, setContactPhone] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Create claim
      const { error: claimError } = await supabase.from("claims").insert({
        item_id: itemId,
        claimed_by: userId,
        description,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        claim_status: "pending",
      })

      if (claimError) throw claimError

      router.push("/my-claims?success=true")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Claim Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="description">Why do you believe this is your item? *</Label>
            <textarea
              id="description"
              placeholder="Describe identifying features, where you lost it, when, etc."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="(555) 123-4567"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> The person who reported this item will review your claim. They may contact you to
              verify ownership before releasing the item.
            </p>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Claim"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300 bg-transparent"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
