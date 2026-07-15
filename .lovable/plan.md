## Goal

Make the Submit form require a logo upload, save submissions to a backend, email you at **likhaipadhai415@gmail.com** on every new submission, and give you an **Approve / Decline** admin panel. Approved sites automatically appear on OneWebs; declined ones don't.

## What I'll build

### 1. Backend (Lovable Cloud)
Enable Lovable Cloud (managed database + storage + auth + email).

**Database table `submissions`:**
- name, url, category, description, pricing, logo_url, submitter_email, relation
- status: `pending` | `approved` | `declined`
- created_at, reviewed_at

**Storage bucket `submission-logos`** (public) — stores uploaded logo images.

**RLS policies:**
- Anyone can INSERT a submission
- Only admin (you) can SELECT/UPDATE
- Public can SELECT rows where `status = 'approved'` (so they show on the site)

### 2. Submit page (`/submit`)
- Add **required logo upload** field (image, ≤2MB, png/jpg/webp/svg)
- Client-side preview before submit
- On submit: upload logo to storage → insert row → trigger email
- Show success screen (as today)

### 3. Email notification
Uses Lovable's built-in email system. On every new submission, an email is sent to **likhaipadhai415@gmail.com** with:
- Website name, URL, category, description, pricing, submitter email
- Logo preview
- A link to the admin page to approve/decline

*Note: sending requires a verified sender domain. If you don't have one, I'll set up the email domain flow — until it's verified, submissions are still saved and visible in the admin panel; email delivery starts once DNS is verified.*

### 4. Admin page (`/admin`)
- Protected route — only your account can access (role check via `user_roles` table)
- Lists all `pending` submissions with logo, details, and **Approve** / **Decline** buttons
- Tabs: Pending / Approved / Declined
- On approve → status becomes `approved`, site appears live on OneWebs
- On decline → status becomes `declined`, site stays hidden

### 5. Merging approved submissions into the directory
The site's category grids currently read from the static `onewebs-data.ts` list. I'll add a hook that fetches approved submissions from the DB and merges them into the displayed list — so approved sites show up on Home, Categories, Trending, New, and search, without touching the static seed data.

### 6. Admin bootstrap
After Cloud is enabled, you'll sign up once with **likhaipadhai415@gmail.com**, and I'll grant your user the `admin` role so `/admin` unlocks for you.

## Out of scope (unless you ask)
- Editing/deleting already-approved sites from the admin UI
- Email to submitter on approve/decline (can add later)
- Bulk actions / CSV export

Reply **go** and I'll enable Cloud and build it.
