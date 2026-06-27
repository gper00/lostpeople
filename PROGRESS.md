# Lostpeople — Progress & Feature Audit

_Generated: 2026-06-28_

---

## 1. Halaman Publik (User biasa)

| Fitur | Status | Detail |
|-------|--------|--------|
| Homepage `/` | ✅ | 10 post terbaru (`status:published` + `limit(10)`) |
| Post list `/posts` | ✅ | Semua published post |
| Post detail `/posts/[slug]` | ✅ | Markdown render, author box, tags, share, reading progress |
| Search `/search?q=` | ✅ | Regex case-insensitive cari title/excerpt/tags/category |
| Tags cloud `/tags/` | ✅ | Cloud by count descending |
| Tag filter `/tags/[tag]` | ✅ | Post list filtered per tag |
| Author page `/authors/[username]` | ✅ | Profile + post list |
| About `/about` | ✅ | Deskripsi + kontak + "Tim Kami" card grid |

### Interaksi per Post

| Fitur | Status | Detail |
|-------|--------|--------|
| **Like** | ✅ | Optimistic UI, rollback on fail, localStorage dedup, delta-based toggle |
| **View** | ✅ | $inc atomic, localStorage 1x per browser |
| **Komentar** | ✅ | Guest & registered, admin hide/unhide, owner delete, confirm dialog |
| **Stats live** | ✅ | GET `/api/posts/[id]/stats` sync likes + views + comments |
| Share TW/FB/WA | ✅ | Share button + copy link clipboard |

### UI/UX

| Fitur | Status | Detail |
|-------|--------|--------|
| Dark/light mode | ✅ | Cookie persist, anti-FOUC inline script |
| Font size toggle | ⚠️ | Tombol A di sidebar (handler perlu dicek) |
| Responsive | ✅ | Sidebar desktop, hamburger mobile |
| View transitions | ✅ | astro ClientRouter |
| SEO meta | ✅ | OG + Twitter card + canonical + keywords |

---

## 2. Dashboard (Admin / User)

### Auth

| Fitur | Status | Detail |
|-------|--------|--------|
| Login | ✅ | Better Auth email/password |
| Session middleware | ✅ | Astro middleware + `context.locals` |
| Role guard (page) | ✅ | `requireAdminPage()` |
| Role guard (API) | ✅ | `requireAdminApi()` |

### Dashboard Home `/dashboard`

| Fitur | Status | Detail |
|-------|--------|--------|
| Stat cards | ✅ | Total posts, published, drafts |
| Recent posts | ✅ | Last 5, link edit |
| Quick create | ✅ | "New Post" button |

### Post Management `/dashboard/posts`

| Fitur | Status | Detail |
|-------|--------|--------|
| List | ✅ | Status badges, views/likes, view live / edit / delete |
| Create | ✅ | Form + MarkdownEditor + ImageUpload (Cloudinary) |
| Edit | ✅ | Pre-populated, PUT API, field-by-field |
| Delete | ✅ | Confirm dialog, hard delete (`findByIdAndDelete`) |
| Image upload | ✅ | Server-side signed Cloudinary upload |

### User Management `/dashboard/users` (admin only)

| Fitur | Status | Detail |
|-------|--------|--------|
| List | ✅ | Photo, name, email, role, ban, "you" indicator |
| Create | ✅ | Better Auth `admin.createUser` |
| Edit | ✅ | Role change, ban/unban, reset password, profile, social media |
| Delete | ✅ | Better Auth `admin.removeUser` |
| Password reset | ✅ | `admin.setUserPassword` |

### Account `/dashboard/account`

| Fitur | Status | Detail |
|-------|--------|--------|
| Change password | ✅ | `authClient.changePassword`, revoke other sessions |

---

## 3. API Endpoints

| Method | Path | Auth | Fungsi |
|--------|------|------|--------|
| GET | `/api/posts` | — | List published posts |
| POST | `/api/posts` | ✅ | Create post |
| GET | `/api/posts/[id]` | — | Single post |
| PUT | `/api/posts/[id]` | ✅ owner | Update post |
| DELETE | `/api/posts/[id]` | ✅ owner | Delete post |
| POST | `/api/posts/upload` | ✅ | Upload image to Cloudinary |
| POST | `/api/posts/[id]/view` | — | Increment view (`$inc`) |
| POST | `/api/posts/[id]/like` | — | Toggle like (delta +1/-1, clamp) |
| GET | `/api/posts/[id]/stats` | — | Live likes + views + comments |
| GET | `/api/posts/[id]/comments` | — | List comments (hidden utk non-admin) |
| POST | `/api/posts/[id]/comments` | — | Create comment (guest atau registered) |
| DELETE | `/api/comments/[id]` | ✅ owner/admin | Delete comment |
| PATCH | `/api/comments/[id]` | ✅ admin | Toggle hidden |
| PUT | `/api/users/[id]` | ✅ admin | Update profile + social |
| ALL | `/api/auth/[...all]` | — | Better Auth handler |

---

## 4. Evaluasi View & Like Implementation

### View ✅
```
POST → findByIdAndUpdate(id, { $inc: { viewsCount: 1 } })
```
- **Atomic** — `$inc` ga ada race condition
- **Dedup** — localStorage `viewed:{postId}`, 1 view per browser per post
- **Efisien** — `projection: { viewsCount: 1 }`
- **Kekurangan**: No rate limiting (clear localStorage → bisa inflate)

### Like ✅
```
POST → baca delta (+1/-1) → clamp ke 0 → update likesCount
```
- **Optimistic UI** — update tombol sebelum server respond
- **Rollback** — balikin state kalo request gagal
- **Clamping** — `Math.max(0, current + delta)` anti negatif
- **Delta-based** — bukan toggle, +1 atau -1
- **localStorage** — `liked:{postId}`, survive refresh
- **Kekurangan**: Like per-browser (user ga login = state beda antar device), no rate limiting

---

## 5. Yang Kurang / Bisa Ditingkatkan

| # | Issue | Impact | Saran |
|---|-------|--------|-------|
| 1 | No rate limiting di endpoint publik | Views/likes bisa dimanipulasi | Pake middleware throttle |
| 2 | No pagination (`/api/posts` all) | Lambat kalo ribuan post | `limit()` + `skip()` / cursor |
| 3 | No CSRF protection | Rawan spam | Origin check / token |
| 4 | Search pake `$regex` | Slow di scale | MongoDB text index |
| 5 | Komentar langsung muncul | Rawan spam | Approval queue / flag |
| 6 | Hard delete post | Ga bisa recovery | Soft delete (status: deleted) |
| 7 | No draft preview | Ga bisa preview sebelum publish | Preview route / query param |
| 8 | No comment count di dashboard | Kurang info buat author | Tambah di post list |
| 9 | No email notification | Admin ketinggalan komentar baru | Nodemailer / webhook |
| 10 | Font size toggle | Tombol ada, handler belum jelas | CSS variable scale |
| 11 | Post body `set:html` | Potensi XSS (low, pakai marked) | DOMPurify / sanitize |

---

## 6. Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Astro (SSR + prerender) |
| Database | MongoDB + Mongoose |
| Auth | Better Auth (email/password + admin plugin) |
| Markdown | marked |
| Rich text editor | TipTap (dashboard) + MarkdownEditor |
| Image hosting | Cloudinary (signed server upload) |
| Styling | Tailwind + design tokens |
| Icons | Material Symbols |
| Font | EB Garamond, Pinyon Script |

---

## 7. Session Log — 2026-06-28

### Done

| # | Item | Detail |
|---|------|--------|
| 1 | **Typography + UI redesign** | Global CSS, spacing, font scale, layout refinement |
| 2 | **E2E testing** | Playwright smoke tests |
| 3 | **Security hardening** | Rate limiting, security headers middleware |
| 4 | **.gitignore cleanup** | Excluded `.vercel/output/`, `.omo/`, `backup/`, `ss/`, `PROGRESS.md` |
| 5 | **Auth fix (Express legacy)** | scrypt fallback to `account` collection. Branch `fix/auth-old` → merged to `origin/main` |
| 6 | **Vercel deploy fix** | `.npmrc legacy-peer-deps`, `VERCEL_URL` fallback, `trustedOrigins`, error guard in `[...all].ts` |
| 7 | **Deployment** | `typography-style` → `nyobanulis.vercel.app` (preview), `fix/auth-old` → `origin/main` (production auth fix) |

### Branches

| Branch | Isi | Remote |
|--------|-----|--------|
| `typography-style` | Astro + typography + E2E + all features | `origin/typography-style` |
| `fix/auth-old` | Express lama + login fix scrypt | `origin/fix/auth-old` |
| `main` (local) | Ikut typography-style | — |
| `origin/main` | Express + login fix (deployed) | ✅ (`6ddc811`) |

### Env Vars Needed on Vercel (`nyobanulis`)

| Variable | Keterangan |
|----------|------------|
| `MONGO_URI` | Connection string MongoDB |
| `BETTER_AUTH_SECRET` | Secret untuk JWT signing |
| `BETTER_AUTH_URL` | `https://nyobanulis.vercel.app` |

### Next Session — Plan

- [ ] Deploy Astro ke production / Vercel main branch
- [ ] Lanjut plan & execution fitur Astro
