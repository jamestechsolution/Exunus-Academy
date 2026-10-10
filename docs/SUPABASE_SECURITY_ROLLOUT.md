# Supabase authentication rollout — Exunus Academy

## Implemented in this branch
- Email/password authentication through Supabase Auth.
- Username/password authentication through the `login-with-username` Edge Function.
- Profile migration with case-insensitive unique usernames and a self-read RLS policy.
- Express API middleware verifies bearer tokens with Supabase Auth and requires an active profile.
- The frontend API service attaches the active Supabase access token.
- Legacy fake-token login and persona-switching endpoints have been removed from the Express server.

## Required configuration
Frontend hosting:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Express server hosting:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (or `SUPABASE_ANON_KEY` for older project configurations)

Username Edge Function secrets:
- `APP_ORIGIN`: exact HTTPS origin of the deployed frontend
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (or `SUPABASE_ANON_KEY`)
- `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`), server-side only

Apply `supabase/migrations/202610100001_profiles_auth.sql`, deploy the Edge Function, and provision each user through a trusted administrator process.

## Important security gap — do not treat as production ready yet
The Express middleware authenticates users and requires an active profile, but the current Express routes still use in-memory seed data. They do not consistently scope every query and mutation to `req.academyAuth.schoolId`, and role-based permissions are not yet enforced for each route. Therefore this change is an authentication gate, not a complete multi-tenant authorization implementation.

Before using real student, finance, attendance, or staff data:
1. Move application records to PostgreSQL/Supabase tables.
2. Add school-level tenant filtering to every query and mutation.
3. Define least-privilege role policies for read/write operations.
4. Apply RLS policies to every sensitive table and test cross-school isolation.
5. Replace the current password recovery UI with Supabase password-reset flows.
6. Add rate limiting and abuse monitoring to username login.
7. Run dependency installation, lint, build, integration, and security tests.

Never place a Supabase secret/service-role key in frontend variables, source code, or a public repository.
