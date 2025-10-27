"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CATEGORIES = ["Electronics", "Clothing", "Accessories", "Books", "Sports Equipment", "Other"]

export function ReportItemForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Other")
  const [locationFound, setLocationFound] = useState("")
  const [dateFound, setDateFound] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let imageUrl: string | null = null

      // Upload image if provided
      if (image) {
        const fileName = `${Date.now()}-${image.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("found-items")
          .upload(fileName, image)

        if (uploadError) throw uploadError
        imageUrl = uploadData.path
      }

      // Insert item into database
      const { error: insertError } = await supabase.from("found_items").insert({
        title,
        description,
        category,
        location_found: locationFound,
        date_found: dateFound,
        image_url: imageUrl,
        reported_by: userId,
        status: "available",
      })

      if (insertError) throw insertError

      router.push("/items?success=true")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Item Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Item Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Blue Backpack"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              placeholder="Describe the item in detail (color, brand, condition, etc.)"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="locationFound">Location Found *</Label>
              <Input
                id="locationFound"
                placeholder="e.g., Library, Cafeteria, Gym"
                required
                value={locationFound}
                onChange={(e) => setLocationFound(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateFound">Date Found *</Label>
              <Input
                id="dateFound"
                type="date"
                required
                value={dateFound}
                onChange={(e) => setDateFound(e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Photo (Optional)</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="border-gray-300" />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-xs h-auto rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Report Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
