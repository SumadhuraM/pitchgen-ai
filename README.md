# PitchGen AI

A Generative AI-powered startup pitch deck generator that transforms a simple business idea into a complete, investor-ready pitch deck in seconds.

Built with React, Node.js, and the Groq API (Llama 3.3 70B).

---

## Features

- **AI-Generated Startup Identity** — startup name, tagline, problem statement, and solution
- **Market Analysis** — TAM estimation, growth narrative, and key data points
- **Competitor Analysis** — identifies 3 competitors with strengths and weaknesses
- **SWOT Analysis** — structured four-quadrant analysis
- **Business Model & Revenue Streams** — monetisation strategy with multiple revenue channels
- **Go-to-Market Strategy** — marketing channel recommendations
- **Funding Requirements** — investment amount range and use-of-funds breakdown
- **Investor Pitch Narrative** — compelling 150–400 word investor-facing pitch
- **10-Slide Pitch Deck** — fully assembled, navigable deck with all generated content
- **PDF Export** — download your pitch deck as a styled PDF
- **History** — all generated pitch decks saved locally in the browser
- **Dark Glassmorphism UI** — modern dark theme with frosted-glass card components
- **Responsive Design** — works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Custom CSS Variables |
| State Management | React Context + useReducer |
| Routing | React Router v6 |
| Backend | Node.js, Express, TypeScript |
| AI Model | Groq API — Llama 3.3 70B Versatile |
| PDF Export | html2canvas + jsPDF |
| Storage | Browser localStorage (no database) |

---

## Project Structure

```
pitchgen-ai/
├── client/                  # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/      # UI, form, blueprint, deck, history, layout
│   │   ├── context/         # BlueprintContext (useReducer state)
│   │   ├── pages/           # GeneratePage, HistoryPage
│   │   ├── services/        # geminiService.ts, pdfExporter.ts
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # historyStore, validators
│   │   └── styles/          # globals.css (CSS variables + glassmorphism)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── server/                  # Express backend (API proxy)
│   ├── src/
│   │   ├── routes/          # generate.ts (POST /api/generate)
│   │   ├── services/        # gemini.ts (Groq SDK integration)
│   │   └── prompts/         # blueprintPrompt.ts (section prompts)
│   ├── .env                 # API key (not committed)
│   └── package.json
│
├── .gitignore
├── package.json             # Root workspace scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A free Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/pitchgen-ai.git
cd pitchgen-ai
```

### 2. Install dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` directory:

```bash
# server/.env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

Get your free Groq API key at [https://console.groq.com/keys](https://console.groq.com/keys).

### 4. Start the development servers

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

### 5. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## How It Works

1. Enter your startup idea (10–2000 characters) and select a business domain
2. Click **Generate Pitch Deck**
3. The backend sends structured prompts to the Groq API for each section
4. Content appears progressively as each section is generated
5. Navigate the 10-slide pitch deck using Prev/Next controls
6. Click **Export as PDF** to download your pitch deck
7. All generated decks are saved in your browser history

### The 10 Slides

| Slide | Content |
|---|---|
| 1 | Cover — Startup name and tagline |
| 2 | Problem — The pain point being solved |
| 3 | Solution — How the startup solves it + USP |
| 4 | Market Opportunity — TAM and growth data |
| 5 | Business Model — Operations and revenue streams |
| 6 | Competitive Landscape — 3 competitors analysed |
| 7 | Go-to-Market — Marketing channel strategy |
| 8 | Financials — Revenue streams and funding required |
| 9 | Team & Vision — Target audience and company vision |
| 10 | Funding Ask — Investment amount and use of funds |

---

## API Architecture

The frontend never calls the Groq API directly. All requests go through the Express backend which holds the API key securely.

```
Browser → POST /api/generate → Express Server → Groq API → Response
```

Each section is a separate API call. Independent sections run in parallel (groups of 3–4) to keep generation fast while staying within rate limits.

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GROQ_API_KEY` | `server/.env` | Your Groq API key |
| `PORT` | `server/.env` | Server port (default: 3001) |

The `.env` file is listed in `.gitignore` and will never be committed.

---

## Scripts

From the root or individual directories:

| Command | Description |
|---|---|
| `cd client && npm run dev` | Start the React dev server |
| `cd server && npm run dev` | Start the Express dev server |
| `cd client && npm run build` | Build the frontend for production |
| `cd server && npm run build` | Compile the backend TypeScript |

---

## License

MIT
