-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  goal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  raised DECIMAL(10, 2) NOT NULL DEFAULT 0,
  pix_key TEXT NOT NULL,
  beneficiary_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'reported')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supporters/Donations table
CREATE TABLE public.supporters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table (for flagging suspicious campaigns)
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table (views, shares, clicks)
CREATE TABLE public.campaign_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'share', 'pix_click', 'copy_key')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_campaigns_creator ON public.campaigns(creator_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_supporters_campaign ON public.supporters(campaign_id);
CREATE INDEX idx_reports_campaign ON public.reports(campaign_id);
CREATE INDEX idx_analytics_campaign ON public.campaign_analytics(campaign_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "Campaigns are viewable by everyone" 
  ON public.campaigns FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create campaigns" 
  ON public.campaigns FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own campaigns" 
  ON public.campaigns FOR UPDATE 
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own campaigns" 
  ON public.campaigns FOR DELETE 
  USING (auth.uid() = creator_id);

-- Supporters policies
CREATE POLICY "Supporters are viewable by everyone" 
  ON public.supporters FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can add support (anonymous donations)" 
  ON public.supporters FOR INSERT 
  WITH CHECK (true);

-- Reports policies
CREATE POLICY "Reports are viewable by admins only" 
  ON public.reports FOR SELECT 
  USING (false); -- Only admins via service role

CREATE POLICY "Authenticated users can create reports" 
  ON public.reports FOR INSERT 
  WITH CHECK (auth.uid() = reporter_id);

-- Analytics policies
CREATE POLICY "Analytics are viewable by campaign owner" 
  ON public.campaign_analytics FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = campaign_analytics.campaign_id 
      AND campaigns.creator_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics" 
  ON public.campaign_analytics FOR INSERT 
  WITH CHECK (true);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at 
  BEFORE UPDATE ON public.campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update campaign raised amount
CREATE OR REPLACE FUNCTION update_campaign_raised()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.campaigns
  SET raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.supporters
    WHERE campaign_id = NEW.campaign_id
  )
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_raised_on_support 
  AFTER INSERT ON public.supporters 
  FOR EACH ROW EXECUTE FUNCTION update_campaign_raised();

-- Storage buckets (run in Supabase Storage section)
-- Campaign images: 'campaign-images'
-- Profile avatars: 'avatars'

-- Storage policies (apply in Supabase Storage)
-- Allow public read access to campaign-images and avatars
-- Allow authenticated users to upload to their own folders
