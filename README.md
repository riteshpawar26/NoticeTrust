# NoticeTrust — Verified & Time-Aware Local Information System
### Seva First Innovation Challenge 2026

NoticeTrust is a full-stack, database-backed web application engineered to eliminate the epidemic of unverified, outdated, conflicting, and tampered institutional notices forwarded through WhatsApp, PDFs, noticeboards, and screenshots.

> **Core Principle:**  
> *"A student should be able to identify the latest authorized notice and understand whether it is current, expired, cancelled, or replaced—without relying on a forwarded screenshot."*

---

## 🌟 Key Innovations

### 1. Notice Trust Passport (`/notices/:noticeId/verify`)
- **Permanent Canonical Notice ID**: (e.g. `NT-2026-EXAM-0101`).
- **Verifiable Dynamic QR Code**: Resolves to the permanent canonical URL, working across revisions without breaking.
- **Cryptographic SHA-256 Fingerprint**: Verifies document integrity client-side using Web Crypto.
- **Independent Senate Review Record**: Explicitly records publisher identity, reviewer signature, approval timestamp, and validity dates.
- **Verification Transparency**: Clearly specifies what has been verified (issuer authorization, Senate signature, cryptographic hash match) vs unverified claims.

### 2. Smart Revision Impact Detector (`/notices/:noticeId/history`)
- **Deterministic Field-by-Field Engine**: Compares historical and revised notices side-by-side.
- **Critical Shift Highlighting**: Automatically detects and flags rescheduled exam dates, venue relocations, and shifted deadlines.
- **Evidence-Based Summary**: Generates concise, authoritative revision notes without hallucination.
- **Immutable Historical Chain**: Older versions remain accessible and are never silently overwritten.

### 3. Cross-Notice Conflict Radar (`/admin/conflicts`)
- **Autonomous Schedule Intelligence**: Scans approved notices across departments and cohorts.
- **Collision Detection**: Detects venue clashes (e.g. Theory Exam and Lab Practical scheduled simultaneously in Auditorium Hall B) and overlapping examination dates for the same student cohort.
- **Senate Moderation Queue**: Alerts administrators with confidence/severity levels (Critical, High, Medium) and supports recorded resolutions.

### 4. Screenshot and PDF Authenticity Checker (`/verify-upload`)
- **Drag-and-Drop Verification**: Accepts circulating PDFs, JPGs, and WhatsApp screenshots.
- **Text & Hash Extraction**: Extracts embedded PDF text streams and computes SHA-256 digests.
- **Multi-Version Classification**:
  - `Exact Match to Current Approved Version`
  - `Match to an Older or Superseded Version` (warns against acting on outdated WhatsApp forwards)
  - `Possible Content Mismatch` (detects altered dates/venues)
  - `Unable to Verify` (discloses OCR limitations if an unregistered image is uploaded)
- **Built-in Evaluator Test Scenarios**: 1-click test buttons to test each scenario immediately.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons.
- **Routing**: React Router 7 with role-aware route guards (`student`, `publisher`, `admin`, `super_admin`).
- **Backend & Database**:
  - PostgreSQL Schema with 16 relational tables and foreign key constraints.
  - Supabase client integration with Row Level Security (RLS) policies.
  - Reactive Local Store Adapter enabling offline demo evaluation.
- **Security & Integrity**: Web Crypto API (`crypto.subtle.digest` SHA-256), separation of duties enforcement.
- **Testing**: Vitest, React Testing Library, jsdom.

---

## 👥 User Roles & Separation of Duties

| Role | Demo Persona | Key Capabilities |
| :--- | :--- | :--- |
| **Student** | Priya Sharma | Personalized feed, deadline tracker, bookmarks, revision alerts, file upload verification, report discrepancies. |
| **Publisher** | Dr. Aris Thorne (Exam Cell) | Compose notice drafts, attach documents with SHA-256 digests, submit revisions. **Cannot self-approve notices.** |
| **Admin / Reviewer** | Prof. Neha Verma (Dean) | Moderation dashboard, approve/reject pending submissions, cancel notices with mandatory reason, resolve Conflict Radar alerts. |
| **Super Admin** | Dr. S. Radhakrishnan (Director) | Manage institutions, configure access controls, view immutable audit logs, 1-click demo database reset. |

> **Evaluator Switcher**: A Quick Role Switcher widget is pinned in the top navigation bar, allowing evaluators to switch between all 4 personas on any screen with a single click.

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v24.18.0`)
- npm `v9+` or `v11+`

### 2. Installation
```bash
# Clone or navigate to the workspace
cd NoticeTrust

# Install dependencies
npm install
```

### 3. Environment Configuration
The project is preconfigured for immediate demonstration. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
VITE_SUPABASE_URL=https://mock-demo.supabase.co
VITE_SUPABASE_ANON_KEY=mock-anon-key-noticetrust-demo-2026
VITE_ENABLE_LOCAL_SIMULATION=true
VITE_APP_BASE_URL=http://localhost:5173
```

### 4. Running the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 5. Running Automated Tests
```bash
npm test
```
All 14 comprehensive unit and workflow tests will execute using Vitest.

### 6. Production Bundle Build
```bash
npm run build
```

---

## 🗄️ PostgreSQL Database Migrations

Production-ready PostgreSQL migrations are located in `supabase/migrations/`:
- [`01_schema.sql`](supabase/migrations/01_schema.sql): 16 tables, constraints, UUID primary keys, and indexes.
- [`02_rls.sql`](supabase/migrations/02_rls.sql): Complete Row Level Security policies enforcing separation of duties.
- [`03_seed.sql`](supabase/migrations/03_seed.sql): Demonstration seed data (institution, 4 roles, revised exam notice, venue conflict, cancelled notice, student reports).

---

## 🧪 Evaluator Demonstration Walkthrough

1. **Homepage (`/`)**: Inspect the mission statement, 4 innovation pillars, and active notice feed.
2. **Notices Feed (`/notices`)**: Search for `Distributed Systems` or filter by `Examination`.
3. **Notice Details (`/notices/NT-2026-EXAM-0101`)**: Observe that Revision 2 rescheduled the exam from Nov 10 to Nov 15 in Auditorium Hall B.
4. **Trust Passport (`/notices/NT-2026-EXAM-0101/verify`)**: View the canonical QR code, SHA-256 fingerprint, and Senate verification record.
5. **Revision Impact Detector (`/notices/NT-2026-EXAM-0101/history`)**: Inspect the deterministic side-by-side diff highlighting the date and venue shift.
6. **Authenticity Checker (`/verify-upload`)**:
   - Click **"1. Outdated Forward (v1 Nov 10)"** -> NoticeTrust classifies it as `older_superseded_version`.
   - Click **"2. Current Active Revision (v2)"** -> Classifies as `exact_match_current`.
   - Click **"3. Tampered Fake Date Copy"** -> Flags `possible_mismatch` due to divergent venue.
7. **Cross-Notice Conflict Radar (`/admin/conflicts`)**: Switch persona to **Admin** using the top switcher, inspect the venue clash between the Exam and Lab Practical, and click **"Resolve Conflict"** to record an administrative decision.
8. **Publisher Operations (`/publisher/notices/new`)**: Switch persona to **Publisher**, compose a new circular draft, and verify that it requires Senate approval before going live.

---

## ⚠️ Known Limitations & Disclosures

- **OCR for Scanned Screenshots**: PDF text extraction and Web Crypto SHA-256 hashing run client-side in the browser. For heavily compressed raster screenshots without embedded text, institutional Tesseract/Google Vision OCR credentials are required; the platform transparently flags these as `Unable to Verify (OCR Required)` rather than fabricating results.
- **External Notifications (SMS/WhatsApp)**: In-app real-time alerts are fully implemented in PostgreSQL/local store; SMS/WhatsApp broadcasting requires configured Twilio/Gupshup gateway credentials.

---

## 📜 Seva First Innovation Challenge 2026
Built with modern web standards, cryptographic integrity, and student-first empathy.
