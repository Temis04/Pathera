# Supabase Setup Guide

This guide will help you set up Supabase for the Pathera application.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in Supabase

## Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials from Project Settings > API:
   - `VITE_SUPABASE_URL`: Your project URL
   - `VITE_SUPABASE_ANON_KEY`: Your anon/public key

## Database Schema

Run the following SQL in your Supabase SQL Editor to create the required tables:

### 1. Profiles Table
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cv_reviews_completed INTEGER DEFAULT 0,
  interviews_completed INTEGER DEFAULT 0,
  personal_statements_reviewed INTEGER DEFAULT 0,
  -- Subscription fields
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'premium'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. CV Reviews Table
```sql
-- Create cv_reviews table
CREATE TABLE cv_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cv_text TEXT,
  cv_file_url TEXT, -- URL to uploaded CV file in storage
  feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cv_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own cv reviews"
  ON cv_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cv reviews"
  ON cv_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND check_cv_upload_limit(auth.uid())
  );

-- Create index for performance
CREATE INDEX cv_reviews_user_id_idx ON cv_reviews(user_id);
CREATE INDEX cv_reviews_created_at_idx ON cv_reviews(created_at DESC);

-- Function to check CV upload limit
CREATE OR REPLACE FUNCTION check_cv_upload_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_tier TEXT;
  v_cv_count INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO v_subscription_tier
  FROM profiles
  WHERE id = p_user_id;
  
  -- If premium, unlimited uploads
  IF v_subscription_tier = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- For free tier, check if they have less than 1 CV
  SELECT COUNT(*) INTO v_cv_count
  FROM cv_reviews
  WHERE user_id = p_user_id;
  
  RETURN v_cv_count < 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Interview Sessions Table
```sql
-- Create interview_sessions table
CREATE TABLE interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  interview_type TEXT,
  questions JSONB,
  responses JSONB,
  feedback JSONB,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own interview sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX interview_sessions_user_id_idx ON interview_sessions(user_id);
CREATE INDEX interview_sessions_created_at_idx ON interview_sessions(created_at DESC);
```

### 4. Personal Statements Table
```sql
-- Create personal_statements table
CREATE TABLE personal_statements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  statement_text TEXT NOT NULL,
  feedback JSONB,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE personal_statements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own personal statements"
  ON personal_statements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal statements"
  ON personal_statements FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND check_statement_upload_limit(auth.uid())
  );

-- Create index for performance
CREATE INDEX personal_statements_user_id_idx ON personal_statements(user_id);
CREATE INDEX personal_statements_created_at_idx ON personal_statements(created_at DESC);

-- Function to check personal statement upload limit
CREATE OR REPLACE FUNCTION check_statement_upload_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_tier TEXT;
  v_statement_count INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO v_subscription_tier
  FROM profiles
  WHERE id = p_user_id;
  
  -- If premium, unlimited uploads
  IF v_subscription_tier = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- For free tier, check if they have less than 1 statement
  SELECT COUNT(*) INTO v_statement_count
  FROM personal_statements
  WHERE user_id = p_user_id;
  
  RETURN v_statement_count < 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5. Work Opportunities Table
```sql
-- Create work_opportunities table
CREATE TABLE work_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  location TEXT,
  industry TEXT,
  type TEXT, -- 'internship', 'part-time', 'full-time'
  requirements JSONB,
  application_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE work_opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies (public read for all authenticated users)
CREATE POLICY "Authenticated users can view opportunities"
  ON work_opportunities FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX work_opportunities_location_idx ON work_opportunities(location);
CREATE INDEX work_opportunities_industry_idx ON work_opportunities(industry);
CREATE INDEX work_opportunities_type_idx ON work_opportunities(type);
CREATE INDEX work_opportunities_created_at_idx ON work_opportunities(created_at DESC);
```

### 6. Work Applications Table
```sql
-- Create work_applications table
CREATE TABLE work_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES work_opportunities(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewing', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- Enable Row Level Security
ALTER TABLE work_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own applications"
  ON work_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON work_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON work_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX work_applications_user_id_idx ON work_applications(user_id);
CREATE INDEX work_applications_opportunity_id_idx ON work_applications(opportunity_id);
CREATE INDEX work_applications_status_idx ON work_applications(status);
```

### 7. Subscriptions Table (For Stripe Integration)
```sql
-- Create subscriptions table for detailed subscription history
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'unpaid', 'incomplete'
  tier TEXT NOT NULL, -- 'premium'
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX subscriptions_status_idx ON subscriptions(status);
```

## Storage Buckets (Recommended for file uploads)

Setting up storage buckets allows users to upload files instead of just pasting text, providing better formatting preservation and a more professional experience.

### Bucket 1: CV Uploads

1. Go to Storage in Supabase Dashboard
2. Create a new bucket named `cv-uploads`
3. Set the bucket to **private**
4. Set allowed MIME types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
5. Set max file size: `5MB`
6. Add RLS policies:

```sql
-- Function to check storage upload limit
CREATE OR REPLACE FUNCTION check_storage_upload_limit(p_user_id UUID, p_bucket TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_tier TEXT;
  v_file_count INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO v_subscription_tier
  FROM profiles
  WHERE id = p_user_id;
  
  -- If premium, unlimited uploads
  IF v_subscription_tier = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- For free tier, check file count in bucket
  SELECT COUNT(*) INTO v_file_count
  FROM storage.objects
  WHERE bucket_id = p_bucket
  AND (storage.foldername(name))[1] = p_user_id::text;
  
  -- Free tier: 1 CV upload limit
  IF p_bucket = 'cv-uploads' THEN
    RETURN v_file_count < 1;
  END IF;
  
  -- Free tier: 1 personal statement limit
  IF p_bucket = 'personal-statements' THEN
    RETURN v_file_count < 1;
  END IF;
  
  -- Profile pictures always allowed
  IF p_bucket = 'profile-pictures' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow users to upload their own CVs (with limits)
CREATE POLICY "Users can upload own CVs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cv-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name) = 'pdf' OR storage.extension(name) = 'doc' OR storage.extension(name) = 'docx')
  AND check_storage_upload_limit(auth.uid(), 'cv-uploads')
);

-- Allow users to view their own CVs
CREATE POLICY "Users can view own CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own CVs
CREATE POLICY "Users can update own CVs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own CVs
CREATE POLICY "Users can delete own CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Bucket 2: Profile Pictures

1. Create a new bucket named `profile-pictures`
2. Set the bucket to **public** (for easy profile picture display)
3. Set allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
4. Set max file size: `2MB`
5. Add RLS policies:

```sql
-- Allow users to upload their own profile pictures
CREATE POLICY "Users can upload own profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name) = 'jpg' OR storage.extension(name) = 'jpeg' OR storage.extension(name) = 'png' OR storage.extension(name) = 'webp')
);

-- Allow anyone to view profile pictures (public bucket)
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profile-pictures');

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own profile pictures
CREATE POLICY "Users can delete own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Bucket 3: Personal Statement Files

1. Create a new bucket named `personal-statements`
2. Set the bucket to **private**
3. Set allowed MIME types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`
4. Set max file size: `3MB`
5. Add RLS policies:

```sql
-- Allow users to upload their own personal statements (with limits)
CREATE POLICY "Users can upload own personal statements"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'personal-statements' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND check_storage_upload_limit(auth.uid(), 'personal-statements')
);

-- Allow users to view their own personal statements
CREATE POLICY "Users can view own personal statements"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'personal-statements' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own personal statements
CREATE POLICY "Users can update own personal statements"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'personal-statements' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own personal statements
CREATE POLICY "Users can delete own personal statements"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'personal-statements' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Bucket 4: Supporting Documents (Optional)

1. Create a new bucket named `supporting-documents`
2. Set the bucket to **private**
3. Set allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`
4. Set max file size: `10MB`
5. Add RLS policies:

```sql
-- Allow users to upload their own supporting documents
CREATE POLICY "Users can upload own supporting documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'supporting-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own supporting documents
CREATE POLICY "Users can view own supporting documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'supporting-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own supporting documents
CREATE POLICY "Users can delete own supporting documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'supporting-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Testing the Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Try signing up and logging in

## Next Steps

- Uncomment the TODO sections in the service files:
  - `src/services/authService.js`
  - `src/services/databaseService.js`
  - `src/context/AuthContext.jsx`

- Remove the temporary localStorage implementation once Supabase is working

## Subscription Tiers & Limits

### Free Tier
- ✅ 1 CV upload and review
- ✅ 1 Personal statement review
- ✅ Unlimited AI interviews (can add limits later)
- ✅ 1 Profile picture
- ❌ No supporting documents

### Premium Tier
- ✅ Unlimited CV uploads and reviews
- ✅ Unlimited personal statement reviews
- ✅ Unlimited AI interviews
- ✅ Unlimited profile picture updates
- ✅ Unlimited supporting documents
- ✅ Priority support
- ✅ Advanced analytics

## Stripe Integration Notes

When setting up Stripe:

1. **Webhook Events to Handle:**
   - `customer.subscription.created` - New subscription
   - `customer.subscription.updated` - Subscription changes
   - `customer.subscription.deleted` - Cancellation
   - `invoice.payment_succeeded` - Successful payment
   - `invoice.payment_failed` - Failed payment

2. **Update Profile on Subscription Change:**
   ```sql
   -- Example: Update user to premium
   UPDATE profiles
   SET 
     subscription_tier = 'premium',
     subscription_status = 'active',
     subscription_start_date = NOW(),
     subscription_end_date = NOW() + INTERVAL '1 month',
     stripe_customer_id = 'cus_xxx',
     stripe_subscription_id = 'sub_xxx'
   WHERE id = 'user_uuid';
   ```

3. **Check Subscription Status:**
   ```sql
   -- Function to check if user has active premium
   CREATE OR REPLACE FUNCTION is_premium_user(p_user_id UUID)
   RETURNS BOOLEAN AS $$
   DECLARE
     v_is_premium BOOLEAN;
   BEGIN
     SELECT 
       subscription_tier = 'premium' 
       AND subscription_status = 'active'
       AND (subscription_end_date IS NULL OR subscription_end_date > NOW())
     INTO v_is_premium
     FROM profiles
     WHERE id = p_user_id;
     
     RETURN COALESCE(v_is_premium, FALSE);
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
