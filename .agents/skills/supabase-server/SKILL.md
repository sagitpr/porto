---
name: supabase-server
description: Expert instructions, security boundaries, and architectural patterns for using @supabase/server and server-side Supabase integrations.
---

# Supabase Server Skill (@supabase/server)

This skill provides operational patterns, architectural boundaries, and security rules for building backend APIs and Edge Functions using `@supabase/server` and `@supabase/supabase-js`.

## Core Responsibilities & Environment Configuration

Ensure environment variables are loaded securely from `.env` on backend runtimes (Node.js, Deno, Bun, Edge Functions):

```env
SUPABASE_URL=https://ysjilfxueahnsisqwbaa.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_d3nUBc3fqG3xFo33colrnA_tcZ_Bjzi
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_JWKS_URL=https://ysjilfxueahnsisqwbaa.supabase.co/auth/v1/.well-known/jwks.json
```

## Security Boundaries: Client vs. Server Keys

1. **Client / Browser Side (`index.html`, `js/supabase-client.js`)**:
   - MUST ONLY use `SUPABASE_ANON_KEY` or `SUPABASE_PUBLISHABLE_KEY`.
   - NEVER expose `SUPABASE_SECRET_KEY` / `service_role` in frontend code, git commits, or client-side bundles.
   - Row-Level Security (RLS) is evaluated against the authenticated user or `anon` role.

2. **Server-Side APIs / Edge Functions**:
   - Use `@supabase/server` or `@supabase/supabase-js`.
   - For public or user-scoped operations: utilize user JWT tokens or publishable key with RLS enforcement.
   - For administrative background tasks (data maintenance, automated synching): access with `SUPABASE_SECRET_KEY` securely on the server only.
   - Always verify incoming JWTs against `SUPABASE_JWKS_URL` or Supabase Auth.

## Basic Server-Side Usage Pattern

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SECRET_KEY;

export const adminClient = createClient(supabaseUrl, supabaseSecret, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

## Verification Checklist

1. Keep `.env` strictly listed in `.gitignore`.
2. Provide `.env.example` with redacted placeholder secrets.
3. Validate database queries and storage bucket permissions (`portfolio-images`) after any schema migration.
