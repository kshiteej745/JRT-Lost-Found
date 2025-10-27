export interface FoundItem {
  id: string
  title: string
  description: string
  category: string
  location_found: string
  date_found: string
  image_url: string | null
  status: "available" | "claimed" | "archived"
  reported_by: string
  created_at: string
  updated_at: string
}

export interface Claim {
  id: string
  item_id: string
  claimed_by: string
  claim_status: "pending" | "approved" | "rejected"
  description: string | null
  contact_email: string
  contact_phone: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string
  role: "student" | "staff" | "admin"
  created_at: string
  updated_at: string
}
