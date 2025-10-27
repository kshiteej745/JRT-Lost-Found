-- Create found_items table
CREATE TABLE IF NOT EXISTS public.found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location_found TEXT NOT NULL,
  date_found DATE NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'archived')),
  reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create claims table
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.found_items(id) ON DELETE CASCADE,
  claimed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_status TEXT DEFAULT 'pending' CHECK (claim_status IN ('pending', 'approved', 'rejected')),
  description TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'staff', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for found_items
CREATE POLICY "Anyone can view available items" ON public.found_items
  FOR SELECT USING (status = 'available' OR auth.uid() = reported_by);

CREATE POLICY "Users can insert their own items" ON public.found_items
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update their own items" ON public.found_items
  FOR UPDATE USING (auth.uid() = reported_by);

CREATE POLICY "Users can delete their own items" ON public.found_items
  FOR DELETE USING (auth.uid() = reported_by);

-- RLS Policies for claims
CREATE POLICY "Users can view their own claims" ON public.claims
  FOR SELECT USING (auth.uid() = claimed_by OR auth.uid() IN (
    SELECT reported_by FROM public.found_items WHERE id = item_id
  ));

CREATE POLICY "Users can create claims" ON public.claims
  FOR INSERT WITH CHECK (auth.uid() = claimed_by);

CREATE POLICY "Users can update their own claims" ON public.claims
  FOR UPDATE USING (auth.uid() = claimed_by OR auth.uid() IN (
    SELECT reported_by FROM public.found_items WHERE id = item_id
  ));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
