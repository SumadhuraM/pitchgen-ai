# Requirements Document

## Introduction

PitchGen AI is a web application that transforms a raw startup idea into a complete, investor-ready pitch deck and business blueprint using Google Gemini AI. Users provide a brief startup idea and select a business domain; the system then generates all key components of a startup narrative — from name and tagline through market analysis, SWOT, financials, and a structured 10-slide pitch deck — which can be exported as a PDF and revisited through a history dashboard.

## Glossary

- **PitchGen_AI**: The overall application system
- **User**: An individual (entrepreneur, student, founder) who submits a startup idea
- **Gemini_API**: Google Gemini large language model API used for all AI content generation
- **Pitch_Deck**: A structured set of 10 slides summarising the startup's business case for investors
- **Startup_Blueprint**: The full collection of AI-generated artefacts for a single idea submission
- **Business_Domain**: A categorised industry or sector selected by the User (e.g., HealthTech, EdTech, FinTech)
- **SWOT_Analysis**: A structured assessment of Strengths, Weaknesses, Opportunities, and Threats
- **History_Store**: Persistent client-side (localStorage) storage that records previously generated Startup_Blueprints (up to 50 entries)
- **PDF_Exporter**: The component responsible for rendering and downloading a Pitch_Deck as a PDF file
- **Dashboard**: The main UI surface that displays generated content, navigation, and history

---

## Requirements

### Requirement 1: Startup Idea Input and Domain Selection

**User Story:** As an entrepreneur, I want to enter my raw startup idea and choose its business domain, so that the system has enough context to generate accurate and relevant content.

#### Acceptance Criteria

1. THE PitchGen_AI SHALL provide a text input field that accepts a startup idea description between 10 and 2000 characters.
2. THE PitchGen_AI SHALL provide a domain selector offering at least 10 predefined Business_Domain categories (e.g., HealthTech, EdTech, FinTech, E-Commerce, SaaS, AgriTech, CleanTech, Logistics, Gaming, Real Estate).
3. WHEN a User submits an idea containing fewer than 10 non-whitespace characters, THE PitchGen_AI SHALL display a validation error message and prevent submission.
4. WHEN a User submits an idea longer than 2000 characters, THE PitchGen_AI SHALL display a validation error message and prevent submission.
5. WHEN a User attempts to submit without selecting a Business_Domain, THE PitchGen_AI SHALL display a validation error and prevent submission.

---

### Requirement 2: AI-Generated Startup Identity

**User Story:** As a founder, I want the system to generate a startup name, tagline, problem statement, and solution description, so that I have a professional startup identity without needing copywriting skills.

#### Acceptance Criteria

1. WHEN a valid startup idea and Business_Domain are submitted, THE Gemini_API SHALL generate a startup name that is 1–4 words and relevant to the idea and domain.
2. WHEN a valid startup idea and Business_Domain are submitted, THE Gemini_API SHALL generate a tagline of no more than 15 words that captures the startup's core value.
3. WHEN a valid startup idea and Business_Domain are submitted, THE Gemini_API SHALL generate a problem statement of 50–200 words that clearly articulates the pain point being addressed.
4. WHEN a valid startup idea and Business_Domain are submitted, THE Gemini_API SHALL generate a solution description of 50–200 words that explains how the startup resolves the identified problem.
5. IF the Gemini_API returns an error or times out (after 15 seconds) during generation, THEN THE PitchGen_AI SHALL display a descriptive error message identifying the failed section and offer the User a retry action.

---

### Requirement 3: Unique Value Proposition and Target Audience

**User Story:** As a founder, I want the system to articulate my startup's unique value proposition and define my target audience, so that I can communicate differentiation and focus clearly to investors.

#### Acceptance Criteria

1. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL produce a Unique Value Proposition (USP) statement of 30–100 words describing what makes the startup distinctively better than alternatives.
2. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL produce a target audience breakdown that identifies at least two distinct customer segments, each with demographic and behavioural characteristics.
3. IF the generated USP is fewer than 30 words, THEN THE PitchGen_AI SHALL automatically re-request the content from the Gemini_API up to 2 times before displaying a section-specific error to the User.

---

### Requirement 4: Market and Competitor Analysis

**User Story:** As a founder, I want AI-generated market opportunity analysis and competitor landscape data, so that I can substantiate the business case in my pitch.

#### Acceptance Criteria

1. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL produce a market opportunity analysis that includes an estimated Total Addressable Market (TAM) figure, a market growth narrative, and at least two supporting data points or trends.
2. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL identify at least three competitor companies or products and describe each competitor's strengths and weaknesses relative to the startup.
3. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL generate a SWOT_Analysis structured as four labelled sections (Strengths, Weaknesses, Opportunities, Threats), each containing 2–5 bullet points.
4. IF competitor or SWOT data cannot be generated due to a Gemini_API error, THEN THE PitchGen_AI SHALL display a section-specific error and allow the User to retry that section individually without re-generating the entire blueprint.

---

### Requirement 5: Business Model and Revenue Strategy

**User Story:** As a founder, I want the system to propose a business model and revenue strategy, so that I can present a credible monetisation plan to investors.

#### Acceptance Criteria

1. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL produce a business model description of 50–200 words covering the core value exchange, customer acquisition approach, and delivery mechanism.
2. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL generate at least two distinct revenue streams, each with a 20–80 word description of how that stream generates income.
3. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL produce a funding requirement estimate that specifies a dollar amount range (e.g., $250K–$500K) and lists at least three intended use-of-funds categories.

---

### Requirement 6: Marketing Strategy and Investor Pitch

**User Story:** As a founder, I want AI-generated go-to-market strategies and an investor pitch narrative, so that I can clearly communicate growth plans and attract investment.

#### Acceptance Criteria

1. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL produce a marketing strategy that includes at least three distinct go-to-market channels (e.g., social media, partnerships, content marketing) each with a 20–80 word description.
2. WHEN a Startup_Blueprint is being generated, THE Gemini_API SHALL generate an investor pitch narrative of 150–400 words that summarises the business opportunity, traction potential, and funding ask in a confident, investor-facing voice.

---

### Requirement 7: Complete 10-Slide Pitch Deck

**User Story:** As a founder, I want the system to assemble all generated content into a structured 10-slide pitch deck, so that I have an immediately presentable investor deck.

#### Acceptance Criteria

1. WHEN all Startup_Blueprint sections are successfully generated, THE PitchGen_AI SHALL assemble a Pitch_Deck containing exactly 10 slides in this order: (1) Cover/Title, (2) Problem, (3) Solution, (4) Market Opportunity, (5) Business Model, (6) Competitive Landscape, (7) Go-to-Market Strategy, (8) Financial Projections/Revenue Strategy, (9) Team & Vision, (10) Funding Ask.
2. THE PitchGen_AI SHALL populate each slide with the corresponding content generated in Requirements 2–6.
3. WHEN a Pitch_Deck is assembled, THE PitchGen_AI SHALL display all 10 slides in a navigable, paginated UI within the Dashboard, allowing the User to move between slides one at a time.
4. IF any individual slide's source content is missing due to a generation error, THEN THE PitchGen_AI SHALL display a clearly labelled placeholder for that slide and offer a retry action for that slide's content section.

---

### Requirement 8: PDF Export

**User Story:** As a founder, I want to export my pitch deck as a PDF, so that I can share a professional document with investors and stakeholders.

#### Acceptance Criteria

1. WHEN a Pitch_Deck is fully assembled, THE PitchGen_AI SHALL display an "Export as PDF" button.
2. WHEN the User activates the "Export as PDF" button, THE PDF_Exporter SHALL generate a downloadable PDF file that preserves the slide layout, text content, and visual styling of the displayed Pitch_Deck.
3. THE PDF_Exporter SHALL complete PDF generation and initiate the browser download within 15 seconds for a standard 10-slide Pitch_Deck.
4. THE PDF_Exporter SHALL name the downloaded file using the pattern `<startup-name>-pitch-deck.pdf` (lowercase, hyphenated).
5. IF PDF generation fails, THEN THE PitchGen_AI SHALL display an error message and retain the on-screen Pitch_Deck so the User does not lose their content.

---

### Requirement 9: History of Generated Pitch Decks

**User Story:** As a user, I want to view and access previously generated pitch decks, so that I can revisit, compare, and build upon past work.

#### Acceptance Criteria

1. WHEN a Startup_Blueprint is successfully generated, THE PitchGen_AI SHALL save a record to the History_Store containing the startup name, Business_Domain, creation timestamp, and full Startup_Blueprint data.
2. THE PitchGen_AI SHALL display a history list on the Dashboard showing all past Startup_Blueprints, ordered by creation timestamp descending, showing up to 50 entries.
3. WHEN a User selects a past Startup_Blueprint from the history list, THE PitchGen_AI SHALL load and display that blueprint's full content and Pitch_Deck within the Dashboard without making a new Gemini_API call.
4. WHEN a User requests to delete a past Startup_Blueprint, THE PitchGen_AI SHALL display a confirmation prompt; upon confirmation, remove it from the History_Store and update the history list.
5. IF the History_Store is empty, THE PitchGen_AI SHALL display a message encouraging the User to generate their first pitch deck.
6. WHEN the History_Store reaches 50 entries, THE PitchGen_AI SHALL automatically remove the oldest entry before saving the new Startup_Blueprint.

---

### Requirement 10: Dashboard UI and Visual Design

**User Story:** As a user, I want a professional, modern dashboard with dark theme and glassmorphism design, so that the application feels polished and credible while being easy to navigate.

#### Acceptance Criteria

1. THE PitchGen_AI SHALL implement a dark-themed UI using a colour palette of deep neutrals (background: #0a0a0f to #1a1a2e range) and at least one accent colour for primary actions, applied consistently across all views.
2. THE PitchGen_AI SHALL apply glassmorphism styling — semi-transparent panels with `background: rgba(255,255,255,0.05–0.1)`, `backdrop-filter: blur(10px–20px)`, and a 1px subtle border — to all card and panel components.
3. THE PitchGen_AI SHALL provide a responsive layout so that all views render correctly on screen widths from 320px (mobile) to 2560px (large desktop) without horizontal overflow.
4. WHEN navigating between Dashboard sections (input form, generated content, history), THE PitchGen_AI SHALL transition between views without a full page reload, completing the transition within 300ms.
5. WHEN a Startup_Blueprint is being generated, THE PitchGen_AI SHALL display a per-section loading skeleton or spinner so the User receives progressive feedback as each section completes.

---

### Requirement 11: Gemini API Integration

**User Story:** As a system operator, I want all AI content to be generated reliably through the Gemini API, so that the system produces high-quality, contextually relevant output for every submission.

#### Acceptance Criteria

1. THE PitchGen_AI SHALL send all AI generation requests to the Gemini_API using a structured prompt that includes the startup idea text, selected Business_Domain, and an explicit specification of the expected output format (JSON schema or labelled sections).
2. WHEN the Gemini_API responds, THE PitchGen_AI SHALL parse and validate the response against the expected content structure before rendering any content to the User.
3. IF the Gemini_API returns an HTTP 4xx or 5xx error, THEN THE PitchGen_AI SHALL log the error details to the browser console, display a user-facing message identifying the failed section, and allow the User to retry that section.
4. THE PitchGen_AI SHALL store the Gemini_API key exclusively in a server-side environment variable or a `.env` file and SHALL NOT include it in any client-side bundle or expose it in network responses visible to the User.
5. IF the Gemini_API returns an HTTP 429 (rate limit) response, THEN THE PitchGen_AI SHALL wait 3 seconds and automatically retry the request once before surfacing an error to the User.
6. WHEN generating all sections of a Startup_Blueprint, THE PitchGen_AI SHALL issue Gemini_API requests for independent sections in parallel to minimise total generation time.
