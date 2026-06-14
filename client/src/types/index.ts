export type BusinessDomain =
  | 'HealthTech'
  | 'EdTech'
  | 'FinTech'
  | 'E-Commerce'
  | 'SaaS'
  | 'AgriTech'
  | 'CleanTech'
  | 'Logistics'
  | 'Gaming'
  | 'Real Estate';

export const BUSINESS_DOMAINS: BusinessDomain[] = [
  'HealthTech', 'EdTech', 'FinTech', 'E-Commerce', 'SaaS',
  'AgriTech', 'CleanTech', 'Logistics', 'Gaming', 'Real Estate',
];

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

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface RevenueStream {
  name: string;
  description: string;
}

export interface FundingRequirement {
  amountRange: string;
  usesOfFunds: string[];
}

export interface MarketingChannel {
  channel: string;
  description: string;
}

export interface StartupBlueprint {
  id: string;
  createdAt: string;
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

export type SectionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface GenerationState {
  blueprint: Partial<StartupBlueprint> | null;
  fullBlueprint: StartupBlueprint | null;
  sectionStatus: Record<string, SectionStatus>;
  sectionErrors: Record<string, string>;
  activeSlide: number;
  isHistoryOpen: boolean;
  isGenerating: boolean;
}

export interface HistoryEntry {
  id: string;
  startupName: string;
  domain: BusinessDomain;
  createdAt: string;
  blueprint: StartupBlueprint;
}
