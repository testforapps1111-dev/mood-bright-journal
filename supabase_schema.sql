-- SUPABASE SQL SCHEMA (ROBUST VERSION)
-- Purpose: Reset and 100% authorize mood tracking tables.

-- 1. Cleanup existing tables (WARNING: Deletes all data)
DROP TABLE IF EXISTS public.mood_entries;
DROP TABLE IF EXISTS public.users;

-- 2. Create the users table
CREATE TABLE public.users (
    id BIGINT PRIMARY KEY, -- External ID from MantraCare API
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the mood_entries table
CREATE TABLE public.mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mood_value INT NOT NULL, -- 1 to 5
    mood_label TEXT NOT NULL,
    day_name TEXT NOT NULL,
    note TEXT, -- Optional text
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- 5. Set up RLS Policies (Explicit for anon role)
-- These policies grant full read/write access to the 'anon' key (the public API key)

DROP POLICY IF EXISTS "Allow public mood operations" ON public.mood_entries;
CREATE POLICY "Allow public mood operations" ON public.mood_entries
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public user initialization" ON public.users;
CREATE POLICY "Allow public user initialization" ON public.users
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Grant basic permissions to the 'anon' and 'authenticated' roles
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.mood_entries TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
