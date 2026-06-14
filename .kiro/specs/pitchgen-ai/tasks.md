# Implementation Tasks

## Task 1: Project Scaffolding and Setup
- [ ] Initialize project structure with client (Vite + React + TypeScript) and server (Node.js + Express + TypeScript)
- [ ] Install all dependencies (Tailwind CSS, React Router, jsPDF, html2canvas, @google/generative-ai, cors, dotenv)
- [ ] Configure Vite proxy, Tailwind, and TypeScript configs
- [ ] Set up `.env` file with Gemini API key
- [ ] Create global CSS variables and glassmorphism utility classes

## Task 2: Core Types and Data Models
- [ ] Define all TypeScript interfaces in `client/src/types/index.ts`
- [ ] Define `StartupBlueprint`, `HistoryEntry`, `GenerationState`, and all nested types

## Task 3: State Management (BlueprintContext)
- [ ] Create `BlueprintContext` with `useReducer`
- [ ] Implement all actions: GENERATION_START, SECTION_LOADING, SECTION_SUCCESS, SECTION_ERROR, SET_BLUEPRINT, SET_ACTIVE_SLIDE, TOGGLE_HISTORY, CLEAR_BLUEPRINT
- [ ] Create `useBlueprint` hook

## Task 4: History Store Utility
- [ ] Implement `historyStore.ts` with `saveBlueprint`, `loadHistory`, `deleteEntry`
- [ ] Enforce 50-entry cap with oldest-first eviction
- [ ] Create `useHistory` hook

## Task 5: Backend Express Server
- [ ] Set up Express server with CORS, JSON parsing, dotenv
- [ ] Create `/api/generate` POST route
- [ ] Build `blueprintPrompt.ts` with section-specific JSON-schema prompts
- [ ] Integrate `@google/generative-ai` SDK with `responseMimeType: 'application/json'`
- [ ] Add request validation and error handling (4xx, 5xx, 429 with 3s retry)

## Task 6: Frontend Gemini Service
- [ ] Implement `geminiService.ts` with `fetchWithRetry` logic
- [ ] Group sections and run parallel `Promise.allSettled` generation
- [ ] Dispatch per-section loading/success/error actions
- [ ] Validate USP word count with up-to-2 auto-retries

## Task 7: UI Primitives and Layout
- [ ] Build `GlassCard`, `LoadingSkeleton`, `ErrorBanner`, `ConfirmDialog` components
- [ ] Build `AppShell` (dark background, layout grid) and `Navbar`
- [ ] Set up React Router with `/`, `/generate`, `/history` routes

## Task 8: Input Form
- [ ] Build `IdeaInputForm` with controlled textarea, live character counter, validation
- [ ] Build `DomainSelector` with all 10 domains
- [ ] Wire form submission to `geminiService.generateBlueprint`

## Task 9: Blueprint Sections Dashboard
- [ ] Build `BlueprintSection` wrapper with per-section loading skeleton, error banner, retry button
- [ ] Build `SwotGrid`, `CompetitorTable`, `RevenueStreams` display components
- [ ] Render all generated sections in the `/generate` dashboard view

## Task 10: 10-Slide Pitch Deck Viewer
- [ ] Build all 10 slide components (Cover, Problem, Solution, Market, BusinessModel, Competitors, GTM, Financials, Team, FundingAsk)
- [ ] Build `PitchDeckViewer` with paginated navigation and dot indicators
- [ ] Build `SlideNav` with prev/next controls
- [ ] Handle missing-content placeholders with retry actions

## Task 11: PDF Export
- [ ] Implement `pdfExporter.ts` using `html2canvas` + `jsPDF`
- [ ] Render slides to hidden off-screen div during export
- [ ] Name file `<startup-name>-pitch-deck.pdf`
- [ ] Add "Export as PDF" button to `PitchDeckViewer`
- [ ] Handle export errors with toast notification

## Task 12: History Sidebar
- [ ] Build `HistorySidebar` and `HistoryCard` components
- [ ] Display history ordered by timestamp descending
- [ ] Implement load-from-history (no new API call)
- [ ] Implement delete with `ConfirmDialog`
- [ ] Show empty-state prompt when no history exists

## Task 13: Responsive Design and Polish
- [ ] Verify responsive layout from 320px to 2560px
- [ ] Add CSS transitions (≤300ms) between views
- [ ] Add accent glow effects, hover states, and animation polish
- [ ] Final cross-browser check
