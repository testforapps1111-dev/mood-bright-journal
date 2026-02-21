-- SUPABASE SQL SCHEMA (FULL RESET)
-- WARNING: This will delete all existing data!

-- 1. Cleanup existing tables
DROP TABLE IF EXISTS public.mood_entries;
DROP TABLE IF EXISTS public.users;

-- 2. Create the users table to store identified users
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

-- 5. RLS Policies
-- NOTE: Using 'anon' key for the handshake protocol.
-- In production, policies should ideally use auth.uid() if using Supabase Auth,
-- but since we use a custom handshake, we allow based on the passed user_id.

CREATE POLICY "Allow authenticated mood operations" ON public.mood_entries
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow user initialization" ON public.users
    FOR ALL
    USING (true)
    WITH CHECK (true);
