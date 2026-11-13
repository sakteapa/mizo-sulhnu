# ZOFATE DNA CHAIN & SULHNU STUDIO

Production-ready, offline-capable **Progressive Web App (PWA)** combining a literary Mizo book writing & publishing studio (*"ZOFATE SULHNU: Tobul, Lalte, Thawnthu leh Chanchin Ril"*) with a bi-directional Genealogical DNA Chain, Health/Blood Group Intelligence Registry, Role-Based Access Control (RBAC), and an AI Integrity Watchdog powered by Gemini.

---

## Key Features

- **Progressive Web App (PWA) & Offline Support**:
  - Pre-caches core assets, chapters, and local `localStorage` DNA Chain records via `vite-plugin-pwa` Service Worker so users can read books, draft edits, trace lineages, and run blood/health analysis offline.
  - Native **Install App (`beforeinstallprompt`)** button & iOS Safari installation guide.
- **Mobile-First & Cross-Device Responsive**:
  - Collapsible bottom navigation bar on mobile (`360px+`) and collapsible mobile chapter drawer; persistent sidebar and 3-zone top bar on desktop/tablet.
- **Role-Based Access Control (RBAC)**:
  - **Admin (`Enkawltu Ber`)**: Full database & publishing access, AI Alert Inbox, Approve / Edit & Approve / Reject / Rollback controls, and Reader medical masking lock.
  - **Contributor (`Mimal`)**: Stage chapter revisions, add DNA profiles, and upload documents/images; every entry is audited by the AI Integrity Watchdog before touching core records.
  - **Reader (`Chhiartu`)**: Read-only access to published chapters and the DNA Chain Explorer with private medical/blood records masked by default.
- **AI Integrity Watchdog & Admin Escalation**:
  - Audits inputs across historical consistency, biological/chronological logic (parent-child ages & ABO blood inheritance), and spam/vandalism detection.
- **Master Book Studio & Bi-Directional DNA Chain**:
  - 10-chapter Master Outline + custom Single-Story Deep-Dive books (up to 30 chapters) with versioned revisions (`Rev 1`, `Rev 2`, ...), Forward/Reverse lineage tracing, BFS Relationship Pathfinder, interactive Top-Down / Bottom-Up graph visualizer, Blood Group & Hereditary Health Analyzer, Multimodal OCR ingestion, JSON backup/restore, `.txt`/`.md` downloads, and A5 print/PDF formatting.

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and add your server-side Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

3. **Run the development server (Express + Vite)**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

4. **Production build**:
   ```bash
   npm run build
   npm start
   ```

---

## GitHub Push & Zero-Config Vercel Deployment

All Gemini API calls run strictly on the server (`/api/*`) so your API key is **never exposed to the browser**.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Zofate DNA Chain & Sulhnu Studio PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/zofate-dna-sulhnu-studio.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
2. Vercel automatically detects `vercel.json` (`npm run build` -> `dist/` + `/api/index.ts` serverless backend).
3. Under **Project Settings → Environment Variables**, add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key
4. Click **Deploy**. Your PWA and `/api/*` Gemini endpoints will be live on HTTPS, ready to install on Android, iOS, macOS, and Windows.
