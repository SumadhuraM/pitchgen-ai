import type { StartupBlueprint, BusinessDomain } from '../types';
import { wordCount } from '../utils/validators';
import { saveBlueprint } from '../utils/historyStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dispatch = (action: any) => void;

const API_BASE = '/api';
const REQUEST_TIMEOUT_MS = 30000; // 30s per request — Groq is fast

interface GeneratePayload {
  idea: string;
  domain: BusinessDomain;
  section: string;
}

class ApiError extends Error {
  constructor(public status: number, public section: string, message?: string) {
    super(message ?? `API error ${status} for section "${section}"`);
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchSection(
  payload: GeneratePayload,
  retries = 2
): Promise<Record<string, unknown>> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.status === 429) {
        const body = await res.json() as { error: string; retryAfterMs?: number };
        const waitMs = (body.retryAfterMs ?? 5000) + 500;
        if (attempt < retries) {
          console.log(`[PitchGen] Rate limited on "${payload.section}". Waiting ${Math.ceil(waitMs / 1000)}s…`);
          await sleep(waitMs);
          continue;
        }
        throw new ApiError(429, payload.section, `Rate limit — retry after ${Math.ceil(waitMs / 1000)}s`);
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new ApiError(res.status, payload.section, body.error);
      }

      const data = (await res.json()) as Record<string, unknown>;

      // Validate USP word count — auto-retry if too short
      if (
        payload.section === 'uspAudience' &&
        typeof data.usp === 'string' &&
        wordCount(data.usp) < 30 &&
        attempt < retries
      ) {
        continue;
      }

      return data;
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof ApiError) throw err;
      if (attempt < retries) {
        await sleep(1000);
        continue;
      }
      throw err;
    }
  }
  throw new Error(`Failed to fetch section "${payload.section}"`);
}

function sectionErrorMessage(err: unknown, section: string): string {
  if (err instanceof ApiError) {
    if (err.status === 429) return `Rate limit reached for ${section}. Please retry in a moment.`;
    if (err.status >= 500) return `Server error generating ${section}. Please retry.`;
    if (err.status === 401) return `API authentication failed. Please check your API key.`;
    return `Failed to generate ${section} (error ${err.status}).`;
  }
  if (err instanceof DOMException && err.name === 'AbortError') {
    return `Request timed out for ${section}. Please retry.`;
  }
  if (err instanceof Error) return err.message;
  return `Unexpected error generating ${section}. Please retry.`;
}

// Groups run sequentially; sections within a group run in parallel
// Groq free tier: 30 RPM — safe to run 3-4 in parallel
const SECTION_GROUPS = [
  ['identity'],
  ['uspAudience'],
  ['market', 'competitors', 'swot'],
  ['businessModel', 'revenueStreams', 'fundingRequirement'],
  ['marketingChannels', 'investorPitch'],
];

export async function generateBlueprint(
  idea: string,
  domain: BusinessDomain,
  dispatch: Dispatch
): Promise<void> {
  dispatch({ type: 'GENERATION_START' });

  const blueprintId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  let accumulated: Partial<StartupBlueprint> = { id: blueprintId, createdAt, idea, domain };

  for (const group of SECTION_GROUPS) {
    group.forEach(sec => dispatch({ type: 'SECTION_LOADING', section: sec }));

    const results = await Promise.allSettled(
      group.map(section => fetchSection({ idea, domain, section }))
    );

    results.forEach((result, i) => {
      const section = group[i];
      if (result.status === 'fulfilled') {
        const data = result.value;
        accumulated = { ...accumulated, ...data };
        dispatch({ type: 'SECTION_SUCCESS', section, data });
      } else {
        const msg = sectionErrorMessage(result.reason, section);
        dispatch({ type: 'SECTION_ERROR', section, error: msg });
        console.error(`[PitchGen] Section "${section}" failed:`, result.reason);
      }
    });

    // Small gap between groups to stay well within rate limits
    await sleep(500);
  }

  if (accumulated.startupName && accumulated.tagline) {
    const full = accumulated as StartupBlueprint;
    dispatch({ type: 'SET_BLUEPRINT', blueprint: full });
    saveBlueprint(full);
  }
}

export async function retrySection(
  idea: string,
  domain: BusinessDomain,
  section: string,
  dispatch: Dispatch
): Promise<void> {
  dispatch({ type: 'SECTION_LOADING', section });
  try {
    const data = await fetchSection({ idea, domain, section });
    dispatch({ type: 'SECTION_SUCCESS', section, data });
  } catch (err) {
    const msg = sectionErrorMessage(err, section);
    dispatch({ type: 'SECTION_ERROR', section, error: msg });
  }
}
