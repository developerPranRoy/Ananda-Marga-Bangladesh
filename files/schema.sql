-- ============================================================
-- ANANDA MARGA BANGLADESH — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,           -- stored but PRIVATE
  mobile TEXT,                    -- PRIVATE
  address TEXT,
  acharja TEXT,
  bhukti TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'acharja', 'admin')),
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  show_email BOOLEAN DEFAULT FALSE,   -- user controls visibility
  show_mobile BOOLEAN DEFAULT FALSE,  -- user controls visibility
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- POSTS TABLE
-- ============================================================
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  body TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[],
  cover_image TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,    -- in minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REACTIONS TABLE (Like, Love, Insightful)
-- ============================================================
CREATE TABLE reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'like' CHECK (type IN ('like', 'love', 'insightful')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)   -- one reaction per user per post
);

-- ============================================================
-- SAVED POSTS (Bookmarks)
-- ============================================================
CREATE TABLE saved_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ============================================================
-- COMMENTS TABLE (nested via parent_id)
-- ============================================================
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- for nested replies
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES TABLE (private 1-to-1)
-- ============================================================
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GROUP MEETINGS TABLE
-- ============================================================
CREATE TABLE meetings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  is_online BOOLEAN DEFAULT TRUE,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meeting_members (
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined')),
  PRIMARY KEY (meeting_id, user_id)
);

-- ============================================================
-- CONTACT FORM TABLE
-- ============================================================
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOG TABLE (Admin can see all actions)
-- ============================================================
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,         -- e.g. 'post.create', 'user.delete'
  resource_type TEXT,           -- e.g. 'post', 'comment', 'user'
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_saved_posts_user ON saved_posts(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — THE CORE PRIVACY LAYER
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================

-- Public can see basic profile info (NOT email/mobile)
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (TRUE);

-- Only the owner can see/update their own full profile
CREATE POLICY "profiles_owner_all" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Admin can do everything on profiles
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- POSTS POLICIES
-- ============================================================

-- Anyone can read published posts
CREATE POLICY "posts_public_read" ON posts
  FOR SELECT USING (is_published = TRUE);

-- Author sees all their own posts (draft + published)
CREATE POLICY "posts_author_read_own" ON posts
  FOR SELECT USING (author_id = auth.uid());

-- Only logged-in users can create posts
CREATE POLICY "posts_auth_insert" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

-- Only author can update their own posts
CREATE POLICY "posts_author_update" ON posts
  FOR UPDATE USING (author_id = auth.uid());

-- Only author or admin can delete
CREATE POLICY "posts_author_delete" ON posts
  FOR DELETE USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- REACTIONS POLICIES
-- ============================================================
CREATE POLICY "reactions_public_read" ON reactions FOR SELECT USING (TRUE);
CREATE POLICY "reactions_auth_insert" ON reactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "reactions_owner_delete" ON reactions
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- SAVED POSTS POLICIES
-- ============================================================
CREATE POLICY "saved_posts_owner_all" ON saved_posts
  FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- COMMENTS POLICIES
-- ============================================================
CREATE POLICY "comments_public_read" ON comments
  FOR SELECT USING (is_deleted = FALSE);
CREATE POLICY "comments_auth_insert" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());
CREATE POLICY "comments_owner_update" ON comments
  FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "comments_owner_delete" ON comments
  FOR DELETE USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- MESSAGES POLICIES — strict private
-- ============================================================
CREATE POLICY "messages_own_only" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "messages_auth_insert" ON messages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND sender_id = auth.uid());
CREATE POLICY "messages_owner_delete" ON messages
  FOR DELETE USING (sender_id = auth.uid());

-- ============================================================
-- MEETINGS POLICIES
-- ============================================================
CREATE POLICY "meetings_member_read" ON meetings
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "meetings_auth_insert" ON meetings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND creator_id = auth.uid());
CREATE POLICY "meetings_creator_update" ON meetings
  FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "meeting_members_read" ON meeting_members
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "meeting_members_insert" ON meeting_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "meeting_members_update" ON meeting_members
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- CONTACTS — only admin can read
-- ============================================================
CREATE POLICY "contacts_insert" ON contacts
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "contacts_admin_read" ON contacts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- AUDIT LOGS — only admin can read
-- ============================================================
CREATE POLICY "audit_logs_admin_read" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "audit_logs_system_insert" ON audit_logs
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- FUNCTION: Get profile (hides email/mobile based on settings)
-- ============================================================
CREATE OR REPLACE FUNCTION get_public_profile(profile_id UUID)
RETURNS TABLE (
  id UUID, name TEXT, role TEXT, bio TEXT, avatar_url TEXT, acharja TEXT,
  bhukti TEXT, address TEXT, created_at TIMESTAMPTZ,
  email TEXT, mobile TEXT   -- will be NULL if private
) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    p.id, p.name, p.role, p.bio, p.avatar_url, p.acharja,
    p.bhukti, p.address, p.created_at,
    CASE
      WHEN p.show_email = TRUE OR p.id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      THEN p.email ELSE NULL
    END AS email,
    CASE
      WHEN p.show_mobile = TRUE OR p.id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      THEN p.mobile ELSE NULL
    END AS mobile
  FROM profiles p WHERE p.id = profile_id;
$$;

-- ============================================================
-- FUNCTION: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_posts_updated_at
  BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_comments_updated_at
  BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- FUNCTION: Get total member count (ADMIN ONLY via RLS)
-- ============================================================
CREATE OR REPLACE FUNCTION admin_get_stats()
RETURNS JSON LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_build_object(
    'total_members', (SELECT COUNT(*) FROM profiles WHERE role != 'admin'),
    'total_posts', (SELECT COUNT(*) FROM posts WHERE is_published = TRUE),
    'total_comments', (SELECT COUNT(*) FROM comments WHERE is_deleted = FALSE),
    'total_messages', (SELECT COUNT(*) FROM messages),
    'pending_contacts', (SELECT COUNT(*) FROM contacts WHERE is_read = FALSE)
  )
  WHERE EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;
