# Helle Partnersider

Co-brandede landingssider for partnere (udlejere/administratorer) med admin-editor.

- **Frontend:** Vite + React + Tailwind, hostet på GitHub Pages (bygges automatisk ved push til `main`, se `.github/workflows/deploy.yml`)
- **Backend:** Supabase (tabeller `landing_pages`, `page_content`, `admin_audit_log` + storage-bucket `logos`)
- **Skema:** `supabase/schema.sql` (samlet skema til en ny Supabase)
- **Forbindelse:** `.env` indeholder Supabase-URL og den offentlige anon/publishable-nøgle (må gerne ligge i repoet)

## Sider
- `/` – oversigt
- `/p/<slug>` – partnerens landingsside
- `/admin` – admin (kræver login som info@helleforsikring.dk)

## Lokalt
```
npm install
npm run dev
```
