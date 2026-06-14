# Technical Design Document

## Overview

PitchGen AI is a single-page React application (Vite + TypeScript) with a Node.js/Express backend that proxies Gemini API calls. The frontend handles all UI, state, and PDF export; the backend holds the API key and constructs prompts. Data persists entirely in browser `localStorage` — no database required.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend framework | React 18 + TypeScript + Vite | Fast HMR, strict typing, broad ecosystem |
| Styling | Tailwind CSS + custom CSS variables | Utility-first; glassmorphism via custom classes |
| State management | React Context + `useReducer` | No external lib needed for this scale |
| Backend | Node.js + Express | Lightweight proxy; keeps API key server-side |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) | Fast, cost-effective, JSON mode support |
| PDF export | `html2canvas` + `jsPDF` | Client-side; captures styled slides accurately |
| Persistence | `localStorage` (browser) | Zero infra; 50-entry cap enforced in code |
| Routing | React Router v6 | SPA navigation without page reload |

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                  Browser (SPA)                  │
│                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Input   │  │  Dashboard   │  │  History  │ │
│  │  Form    │  │  (Blueprint  │  │  Sidebar  │ │
│  │          │  │  + Deck)     │  │           │ │
│  └────┬─────┘  └──────┬───────┘  └─────┬─────┘ │
│       │               │                │       │
│       └───────────────┼────────────────┘       │
│                       │                        │
│              BlueprintContext                  │
│              (useReducer store)                │
│                       │                        │
│              GeminiService (fetch)             │
└───────────────────────┼────────────────────────┘
                        │ HTTP POST /api/generate
                        ▼
              ┌─────────────────┐
              │  Express Server │
              │  (proxy + keys) │
              └────────┬────────┘
                       │ @google/generative-ai SDK
                       ▼
              ┌─────────────────┐
              │   Gemini API    │
              │  (1.5 Flash)    │
              └─────────────────┘
```

---

## Directory Structure

```
pitchgen-ai/
├── client/                        # React SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                # Reusable primitives
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── LoadingSkeleton.tsx
│   │   │   │   ├── ErrorBanner.tsx
│   │   │   │   └── ConfirmDialog.tsx
│   │   │   ├── form/
│   │   │   │   ├── IdeaInputForm.tsx
│   │   │   │   └── DomainSelector.tsx
│   │   │   ├── blueprint/
│   │   │   │   ├── BlueprintSection.tsx
│   │   │   │   ├── SwotGrid.tsx
│   │   │   │   ├── CompetitorTable.tsx
│   │   │   │   └── RevenueStreams.tsx
│   │   │   ├── deck/
│   │   │   │   ├── PitchDeckViewer.tsx
│   │   │   │   ├── SlideNav.tsx
│   │   │   │   └── slides/
│   │   │   │       ├── Slide01Cover.tsx
│   │   │   │       ├── Slide02Problem.tsx
│   │   │   │       ├── Slide03Solution.tsx
│   │   │   │       ├── Slide04Market.tsx
│   │   │   │       ├── Slide05BusinessModel.tsx
│   │   │   │       ├── Slide06Competitors.tsx
│   │   │   │       ├── Slide07GTM.tsx
│   │   │   │       ├── Slide08Financials.tsx
│   │   │   │       ├── Slide09Team.tsx
│   │   │   │       └── Slide10FundingAsk.tsx
│   │   │   ├── history/
│   │   │   │   ├── HistorySidebar.tsx
│   │   │   │   └── HistoryCard.tsx
│   │   │   └── layout/
│   │   │       ├── AppShell.tsx
│   │   │       └── Navbar.tsx
│   │   ├── context/
│   │   │   └── BlueprintContext.tsx
│   │   ├── hooks/
│   │   │   ├── useBlueprint.ts
│   │   │   └── useHistory.ts
│   │   ├── services/
│   │   │   ├── geminiService.ts
│   │   │   └── pdfExporter.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── historyStore.ts
│   │   │   └── validators.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── server/                        # Express proxy
│   ├── src/
│   │   ├── routes/
│   │   │   └── generate.ts
│   │   ├── services/
│   │   │   └── gemini.ts
│   │   ├── prompts/
│   │   │   └── blueprintPrompt.ts
│   │   └── index.ts
│   ├── .env                       # GEMINI_API_KEY lives here
│   └── tsconfig.json
│
└── package.json                   # Root workspace scripts
```

---

## Data Models

### Core Types (`client/src/types/index.ts`)

```typescript
export type BusinessDomain =
  | 'HealthTech' | 'EdTech' | 'FinTech' | 'E-Commerce'
  | 'SaaS' | 'AgriTech' | 'CleanTech' | 'Logistics'
  | 'Gaming' | 'Real Estate';

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
}

export interface RevenueStream {
  name: string;
  description: string;
}

export interface MarketingChannel {
  channel: string;
  description: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface StartupBlueprint {
  id: string;                        // crypto.randomUUID()
  createdAt: string;                 // ISO 8601 timestamp
  idea: string;
  domain: BusinessDomain;
  // Identity
  startupName: string;
  tagline: string;
  problemStatement: string;
  solution: string;
  // Value & Audience
  usp: string;
  targetAudience: TargetSegment[];
  // Market
  marketOpportunity: MarketOpportunity;
  competitors: Competitor[];
  swot: SwotAnalysis;
  // Business
  businessModel: string;
  revenueStreams: RevenueStream[];
  fundingRequirement: FundingRequirement;
  // Go-to-Market
  marketingChannels: MarketingChannel[];
  investorPitch: string;
}

export interface TargetSegment {
  segment: string;
  demographics: string;
  behaviours: string;
}

export interface MarketOpportunity {
  tam: string;
  growthNarrative: string;
  dataPoints: string[];
}

export interface FundingRequirement {
  amountRange: string;
  usesOfFunds: string[];
}

// Section-level generation status
export type SectionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface GenerationState {
  blueprint: StartupBlueprint | null;
  sectionStatus: Record<string, SectionStatus>;
  sectionErrors: Record<string, string>;
  activeSlide: number;
  isHistoryOpen: boolean;
}

export interface HistoryEntry {
  id: string;
  startupName: string;
  domain: BusinessDomain;
  createdAt: string;
  blueprint: StartupBlueprint;
}
```

---

## Component Architecture

### BlueprintContext (`context/BlueprintContext.tsx`)

Central state manager using `useReducer`. Actions:

```typescript
type BlueprintAction =
  | { type: 'GENERATION_START' }
  | { type: 'SECTION_LOADING'; section: string }
  | { type: 'SECTION_SUCCESS'; section: string; data: Partial<StartupBlueprint> }
  | { type: 'SECTION_ERROR'; section: string; error: string }
  | { type: 'SET_BLUEPRINT'; blueprint: StartupBlueprint }
  | { type: 'SET_ACTIVE_SLIDE'; slide: number }
  | { type: 'TOGGLE_HISTORY' }
  | { type: 'CLEAR_BLUEPRINT' };
```

### IdeaInputForm

- Controlled textarea with live character count (10–2000)
- `DomainSelector`: styled `<select>` with 10 domains
- Validates on submit; dispatches `GENERATION_START`
- Triggers `geminiService.generateBlueprint(idea, domain)`

### PitchDeckViewer

- Renders 10 slide components based on `activeSlide` index
- `SlideNav`: prev/next buttons + dot indicators
- "Export as PDF" button calls `pdfExporter.exportDeck()`
- Each slide component receives the full `blueprint` as props and extracts its section

### HistorySidebar

- Reads from `useHistory` hook (wraps `historyStore`)
- Renders list of `HistoryCard` components (name, domain, date)
- Click → `dispatch({ type: 'SET_BLUEPRINT', blueprint: entry.blueprint })`
- Delete → shows `ConfirmDialog` → removes from store

---

## Gemini API Integration

### Server Route (`server/src/routes/generate.ts`)

```
POST /api/generate
Body: { idea: string; domain: string; section: string }
Response: { data: Record<string, unknown> }
```

The server constructs a structured prompt and calls the Gemini SDK with `responseMimeType: 'application/json'`.

### Prompt Strategy (`server/src/prompts/blueprintPrompt.ts`)

Each generation call requests a specific JSON schema. Example for the identity section:

```
You are a startup consultant. Given the following startup idea and domain,
generate the startup identity as valid JSON matching this schema:
{
  "startupName": "string (1-4 words)",
  "tagline": "string (max 15 words)",
  "problemStatement": "string (50-200 words)",
  "solution": "string (50-200 words)"
}

Domain: {domain}
Idea: {idea}

Return ONLY the JSON object. No explanation.
```

### Parallel Generation (`client/src/services/geminiService.ts`)

Independent sections are fetched in parallel using `Promise.allSettled`:

```typescript
const SECTION_GROUPS = [
  ['identity'],                          // name, tagline, problem, solution
  ['usp', 'targetAudience'],             // parallel
  ['marketOpportunity', 'competitors', 'swot'],  // parallel
  ['businessModel', 'revenueStreams', 'fundingRequirement'],  // parallel
  ['marketingChannels', 'investorPitch'],  // parallel
];
```

Groups run sequentially; sections within a group run in parallel. Each section dispatches its own `SECTION_LOADING` → `SECTION_SUCCESS` / `SECTION_ERROR`.

### Retry Logic

```typescript
async function fetchWithRetry(
  section: string,
  payload: GeneratePayload,
  maxRetries = 2
): Promise<SectionData> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch('/api/generate', { ... });
      if (res.status === 429) {
        await sleep(3000);
        continue;
      }
      if (!res.ok) throw new ApiError(res.status, section);
      const data = await res.json();
      if (section === 'usp' && wordCount(data.usp) < 30 && attempt < maxRetries) continue;
      return data;
    } catch (err) {
      if (attempt === maxRetries) throw err;
    }
  }
}
```

---

## PDF Export (`client/src/services/pdfExporter.ts`)

```typescript
export async function exportDeck(blueprint: StartupBlueprint): Promise<void> {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1280, 720] });
  for (let i = 0; i < 10; i++) {
    // Temporarily render each slide to a hidden off-screen div
    // Capture with html2canvas
    const canvas = await html2canvas(slideElement, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720);
  }
  const fileName = `${slugify(blueprint.startupName)}-pitch-deck.pdf`;
  pdf.save(fileName);
}
```

---

## History Store (`client/src/utils/historyStore.ts`)

```typescript
const STORAGE_KEY = 'pitchgen_history';
const MAX_ENTRIES = 50;

export function saveBlueprint(blueprint: StartupBlueprint): void {
  const history = loadHistory();
  const entry: HistoryEntry = {
    id: blueprint.id,
    startupName: blueprint.startupName,
    domain: blueprint.domain,
    createdAt: blueprint.createdAt,
    blueprint,
  };
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function deleteEntry(id: string): void {
  const updated = loadHistory().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
```

---

## UI / Visual Design System

### CSS Variables (`styles/globals.css`)

```css
:root {
  --bg-base:        #0a0a0f;
  --bg-surface:     #1a1a2e;
  --bg-elevated:    #16213e;
  --accent-primary: #7c3aed;   /* violet */
  --accent-glow:    #a78bfa;
  --text-primary:   #f1f5f9;
  --text-secondary: #94a3b8;
  --border-glass:   rgba(255, 255, 255, 0.08);
  --blur-glass:     blur(16px);
}
```

### Glassmorphism Utility Class

```css
.glass-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: var(--blur-glass);
  -webkit-backdrop-filter: var(--blur-glass);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
}
```

### Responsive Breakpoints (Tailwind)

| Breakpoint | Width | Layout |
|---|---|---|
| `sm` | 320px+ | Single column, sidebar hidden |
| `md` | 768px+ | Two columns, history in drawer |
| `lg` | 1024px+ | Three columns, sidebar pinned |
| `2xl` | 1536px+ | Max-width container centred |

---

## Routing

```
/                → IdeaInputForm (landing)
/generate        → Dashboard with blueprint + deck (post-submission)
/history         → Full history view (mobile; sidebar on desktop)
```

React Router v6 `<BrowserRouter>` with `<Outlet>` inside `AppShell`.

---

## Environment Configuration

**`server/.env`** (never committed):
```
GEMINI_API_KEY=your_key_here
PORT=3001
```

**`client/.env`** (only non-secret):
```
VITE_API_BASE_URL=http://localhost:3001
```

Vite proxy in `vite.config.ts` forwards `/api/*` to `localhost:3001` in development. In production, the Express server serves the built client static files.

---

## Error Handling Strategy

| Scenario | Behaviour |
|---|---|
| Validation error (form) | Inline red error text under field; submit blocked |
| Gemini API 4xx/5xx | Section marked `error`; `ErrorBanner` with retry button shown in that section |
| Gemini API 429 | Auto-retry after 3s (once); then surface error if still failing |
| USP < 30 words | Auto-retry up to 2× silently; then surface error |
| PDF export failure | Toast error; deck remains visible |
| localStorage full | Catch `QuotaExceededError`; display warning; do not save |

---

## Key Implementation Notes

1. **API key security**: The Gemini key is only read server-side via `process.env.GEMINI_API_KEY`. The Express route validates request body before forwarding to Gemini.
2. **Progressive rendering**: Each section updates the UI independently as `Promise.allSettled` resolves, so the user sees content appear section by section.
3. **Slide rendering for PDF**: Slides are rendered in a hidden `div#pdf-render-target` (positioned off-screen via `position: absolute; left: -9999px`) during export, then removed after.
4. **History cap**: The `saveBlueprint` utility enforces the 50-entry limit with `slice(0, MAX_ENTRIES)` on every write.
5. **No auth required**: The app is fully anonymous; all data lives in the user's own browser storage.
