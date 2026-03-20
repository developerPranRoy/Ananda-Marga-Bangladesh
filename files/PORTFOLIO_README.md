# Ananda Marga Bangladesh 🙏
### A Full-Stack Community Web Platform

> Portfolio Project — Built with React, Node.js, Supabase & Socket.io

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://anandamarga.vercel.app)
[![Backend](https://img.shields.io/badge/API-Railway-blue)](https://anandamarga-api.railway.app)

---

## Overview

A production-grade, multilingual community platform for Ananda Marga Bangladesh — a spiritual organization active across all 64 districts. The platform supports public content, authenticated members, real-time messaging, group meetings, and a full admin dashboard.

---

## Features

### Public
- Multilingual UI (Bengali / English) with i18next
- About, Founder, Philosophy, Contribution pages
- SEO-optimized blog with slug-based routing
- Contact form with email notification

### Authenticated Members
- Secure registration (2-step) + Supabase Auth
- User profiles with privacy controls (email/mobile hidden by default)
- Blog: write, edit, delete own posts
- Blog engagement: Like (3 types), Share (WhatsApp/FB/link), Save/Bookmark
- Nested comments with replies
- 1-to-1 real-time messaging via Socket.io
- Group meeting scheduling
- Light/Dark mode toggle

### Admin
- Full member list with email + mobile (DB-level privacy enforced)
- Role management (member → acharja → admin)
- Activate/deactivate accounts
- Moderate posts and comments
- Read contact submissions
- Audit log (who did what, when, from where)
- Dashboard statistics

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, DaisyUI |
| State | Zustand + React Query (TanStack) |
| i18n | react-i18next (Bengali + English) |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Security | Row Level Security (RLS), Helmet, CORS, Rate Limiting, Input Validation (Zod + express-validator) |
| Real-time | Socket.io (messaging, typing indicators, online status) |
| Storage | Supabase Storage (avatars, blog covers) |
| Logging | Winston + Audit Log table |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## Security Architecture

- **Row Level Security (RLS)**: All data access enforced at PostgreSQL level. Impossible to bypass via API.
- **Email & Mobile Privacy**: Hidden by default. Only visible to: the owner, admin, or if user explicitly enables sharing.
- **Admin-only data**: Total member count, full member list, audit logs — never exposed publicly.
- **Rate limiting**: 200 req/15min globally, 10 attempts/15min for auth endpoints.
- **File upload security**: MIME type + extension validation, 5MB limit, stored in Supabase Storage.
- **Audit trail**: Every admin action logged with user ID, action type, resource, and IP address.
- **Input validation**: Zod (frontend) + express-validator (backend) on all endpoints.
- **JWT verification**: Every protected route verifies token with Supabase service role.

---

## Project Structure

```
ananda-marga/
├── frontend/                    # React + Vite SPA
│   └── src/
│       ├── components/
│       │   ├── common/          # LanguageSwitcher, Avatar, Modal...
│       │   ├── layout/          # Navbar, Footer, MainLayout
│       │   ├── blog/            # BlogEngagement, CommentSection, Editor
│       │   ├── profile/         # ProfileCard, EditProfile
│       │   └── messaging/       # ChatBox, MessageList, TypingIndicator
│       ├── pages/               # Route components
│       ├── store/               # Zustand stores (auth, ui)
│       ├── services/            # Axios API client
│       ├── i18n/                # Bengali & English translations
│       └── utils/               # supabase client, helpers
│
├── backend/                     # Node.js + Express API
│   └── src/
│       ├── routes/              # posts, profiles, messages, admin...
│       ├── middleware/          # auth, upload, errorHandler, rateLimit
│       ├── config/              # supabase client (admin + anon)
│       ├── db/                  # schema.sql with RLS policies
│       ├── socket.js            # Socket.io event handlers
│       └── utils/               # logger, auditLog, email
│
├── .env.example                 # Environment variable template
└── README.md
```

---

## Setup

```bash
# 1. Clone
git clone https://github.com/yourusername/ananda-marga-bd

# 2. Create Supabase project at supabase.com
#    Run backend/src/db/schema.sql in Supabase SQL Editor

# 3. Set environment variables
cp .env.example frontend/.env
cp .env.example backend/.env
# Fill in your Supabase URL, keys, SMTP settings

# 4. Frontend
cd frontend
npm install
npm run dev

# 5. Backend
cd backend
npm install
npm run dev
```

---

## Database Schema

8 tables with full RLS policies:
`profiles` · `posts` · `reactions` · `saved_posts` · `comments` · `messages` · `meetings` · `contacts` · `audit_logs`

Key privacy function:
```sql
-- get_public_profile() hides email/mobile based on user settings
-- and only shows them to the owner or admin
SELECT * FROM get_public_profile('user-uuid-here');
```

---

## Author

Built as a portfolio project demonstrating full-stack development with real-world requirements: multilingual support, data privacy, role-based access control, real-time features, and scalable architecture.
