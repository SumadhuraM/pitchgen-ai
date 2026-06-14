import Groq from 'groq-sdk';
import { buildPrompt } from '../prompts/blueprintPrompt';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error('GROQ_API_KEY environment variable is not set');
}

const groq = new Groq({ apiKey });

// llama-3.3-70b is fast, accurate, and well within free tier limits
const MODEL = 'llama-3.3-70b-versatile';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseRetryDelay(message: string): number {
  // Groq returns: "Please try again in 1.234s"
  const match = message.match(/try again in (\d+(?:\.\d+)?)\s*s/i);
  if (match) return Math.ceil(parseFloat(match[1])) * 1000 + 1000;
  return 5000;
}

export async function generateSection(
  idea: string,
  domain: string,
  section: string
): Promise<Record<string, unknown>> {
  const prompt = buildPrompt(idea, domain, section);

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert startup consultant. Always respond with valid JSON only. No markdown, no explanation, no code fences — just the raw JSON object.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      });

      const text = completion.choices[0]?.message?.content?.trim() ?? '';

      // Strip any accidental markdown fences
      const clean = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();

      const parsed = JSON.parse(clean) as Record<string, unknown>;
      console.log(`[Groq] ✅ Section "${section}" generated successfully`);
      return parsed;
    } catch (err: unknown) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);

      // Rate limit — parse Groq's suggested delay and surface immediately
      if (message.includes('429') || message.includes('rate_limit') || message.includes('Rate limit')) {
        const delay = parseRetryDelay(message);
        console.warn(`[Groq] Rate limited on "${section}", attempt ${attempt + 1}. Waiting ${delay / 1000}s…`);
        await sleep(delay);
        continue;
      }

      // JSON parse error — retry
      if (err instanceof SyntaxError) {
        console.warn(`[Groq] JSON parse error on "${section}", attempt ${attempt + 1}. Retrying…`);
        continue;
      }

      // Auth error — fail immediately
      if (message.includes('401') || message.includes('invalid_api_key') || message.includes('Authentication')) {
        throw new Error(`Authentication failed. Please check your GROQ_API_KEY. (${message})`);
      }

      console.error(`[Groq] Error on "${section}", attempt ${attempt + 1}: ${message}`);
      if (attempt < 2) {
        await sleep(1000);
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error(`Failed to generate section "${section}"`);
}
