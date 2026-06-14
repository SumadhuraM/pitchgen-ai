export function buildPrompt(idea: string, domain: string, section: string): string {
  const base = `You are an expert startup consultant and pitch deck writer. 
Domain: ${domain}
Startup Idea: ${idea}

`;

  const schemas: Record<string, string> = {
    identity: `${base}Generate the startup identity as valid JSON matching this exact schema:
{
  "startupName": "string (1-4 words, catchy and relevant)",
  "tagline": "string (max 15 words, captures core value)",
  "problemStatement": "string (50-200 words, clearly articulates the pain point)",
  "solution": "string (50-200 words, explains how the startup resolves the problem)"
}
Return ONLY the JSON object. No markdown, no explanation.`,

    uspAudience: `${base}Generate the USP and target audience as valid JSON matching this exact schema:
{
  "usp": "string (30-100 words, what makes this startup distinctively better than alternatives)",
  "targetAudience": [
    {
      "segment": "string (segment name)",
      "demographics": "string (age, location, income, profession details)",
      "behaviours": "string (behavioural patterns, needs, and motivations)"
    }
  ]
}
Include at least 2 target audience segments. Return ONLY the JSON object.`,

    market: `${base}Generate the market opportunity analysis as valid JSON matching this exact schema:
{
  "marketOpportunity": {
    "tam": "string (e.g. '$45 Billion')",
    "growthNarrative": "string (2-3 sentences about market growth)",
    "dataPoints": ["string", "string"]
  }
}
Include at least 2 data points or market trends. Return ONLY the JSON object.`,

    competitors: `${base}Generate competitor analysis as valid JSON matching this exact schema:
{
  "competitors": [
    {
      "name": "string (real company or product name)",
      "strengths": ["string", "string"],
      "weaknesses": ["string", "string"]
    }
  ]
}
Include exactly 3 competitors. Each with 2-3 strengths and 2-3 weaknesses relative to this startup. Return ONLY the JSON object.`,

    swot: `${base}Generate a SWOT analysis as valid JSON matching this exact schema:
{
  "swot": {
    "strengths": ["string", "string", "string"],
    "weaknesses": ["string", "string", "string"],
    "opportunities": ["string", "string", "string"],
    "threats": ["string", "string", "string"]
  }
}
Each category must have 2-5 bullet points. Return ONLY the JSON object.`,

    businessModel: `${base}Generate the business model as valid JSON matching this exact schema:
{
  "businessModel": "string (50-200 words covering value exchange, customer acquisition, and delivery mechanism)"
}
Return ONLY the JSON object.`,

    revenueStreams: `${base}Generate revenue streams as valid JSON matching this exact schema:
{
  "revenueStreams": [
    {
      "name": "string (revenue stream name)",
      "description": "string (20-80 words explaining how this stream generates income)"
    }
  ]
}
Include at least 2 distinct revenue streams. Return ONLY the JSON object.`,

    fundingRequirement: `${base}Generate the funding requirement as valid JSON matching this exact schema:
{
  "fundingRequirement": {
    "amountRange": "string (e.g. '$500K - $1M')",
    "usesOfFunds": ["string", "string", "string"]
  }
}
Include at least 3 use-of-funds categories. Return ONLY the JSON object.`,

    marketingChannels: `${base}Generate the go-to-market strategy as valid JSON matching this exact schema:
{
  "marketingChannels": [
    {
      "channel": "string (channel name, e.g. 'Content Marketing')",
      "description": "string (20-80 words describing the strategy for this channel)"
    }
  ]
}
Include at least 3 distinct marketing channels. Return ONLY the JSON object.`,

    investorPitch: `${base}Generate an investor pitch narrative as valid JSON matching this exact schema:
{
  "investorPitch": "string (150-400 words, confident investor-facing voice summarising the business opportunity, traction potential, and funding ask)"
}
Return ONLY the JSON object.`,
  };

  return schemas[section] ?? `${base}Generate relevant startup content for section: ${section}. Return as JSON.`;
}
