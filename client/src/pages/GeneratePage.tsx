import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlueprint } from '../context/BlueprintContext';
import { BlueprintSection } from '../components/blueprint/BlueprintSection';
import { SwotGrid } from '../components/blueprint/SwotGrid';
import { CompetitorTable } from '../components/blueprint/CompetitorTable';
import { RevenueStreams } from '../components/blueprint/RevenueStreams';
import { PitchDeckViewer } from '../components/deck/PitchDeckViewer';
import { retrySection } from '../services/geminiService';
import type { StartupBlueprint } from '../types';

const ALL_SECTIONS = [
  'identity','uspAudience','market','competitors','swot',
  'businessModel','revenueStreams','fundingRequirement',
  'marketingChannels','investorPitch',
];

function GenerationProgress({ sectionStatus }: { sectionStatus: Record<string, string> }) {
  const done = ALL_SECTIONS.filter(s => sectionStatus[s] === 'success' || sectionStatus[s] === 'error').length;
  const loading = ALL_SECTIONS.find(s => sectionStatus[s] === 'loading');
  const pct = Math.round((done / ALL_SECTIONS.length) * 100);

  if (done === ALL_SECTIONS.length) return null;

  return (
    <div className="glass-card p-4 mb-6 border-violet-500/20 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
          <span className="text-sm text-slate-300 font-medium">
            Generating your pitch deck…
          </span>
          {loading && (
            <span className="text-xs text-slate-500">
              (currently: {loading})
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-violet-400">{done}/{ALL_SECTIONS.length}</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5">
        <div
          className="bg-gradient-to-r from-violet-500 to-purple-400 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        ⚡ Generating all sections — should complete in under 30 seconds.
      </p>
    </div>
  );
}

export function GeneratePage() {
  const { state, dispatch } = useBlueprint();
  const navigate = useNavigate();
  const bp = state.blueprint as Partial<StartupBlueprint> | null;

  // If no generation in progress and no blueprint, redirect home
  useEffect(() => {
    if (!state.isGenerating && !bp) {
      navigate('/');
    }
  }, [state.isGenerating, bp, navigate]);

  if (!bp) return null;

  const s = state.sectionStatus;
  const e = state.sectionErrors;
  const idea = bp.idea ?? '';
  const domain = bp.domain;

  function retry(section: string) {
    if (!domain) return;
    retrySection(idea, domain, section, dispatch);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Generation progress */}
      {state.isGenerating && (
        <GenerationProgress sectionStatus={state.sectionStatus} />
      )}
      {/* Startup Identity Banner */}
      {(s.identity === 'success' || bp.startupName) && (
        <div className="glass-card p-6 mb-8 text-center border-violet-500/20 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-glow">
            {bp.startupName}
          </h1>
          <p className="text-lg text-slate-400 italic mb-4">"{bp.tagline}"</p>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium glass-card-sm text-violet-300">
            {bp.domain}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <BlueprintSection
            title="Problem Statement"
            status={s.identity ?? 'idle'}
            error={e.identity}
            onRetry={() => retry('identity')}
          >
            <p className="text-sm text-slate-300 leading-relaxed">{bp.problemStatement}</p>
          </BlueprintSection>

          <BlueprintSection
            title="Our Solution"
            status={s.identity ?? 'idle'}
            error={e.identity}
          >
            <p className="text-sm text-slate-300 leading-relaxed">{bp.solution}</p>
          </BlueprintSection>

          <BlueprintSection
            title="Unique Value Proposition"
            status={s.uspAudience ?? 'idle'}
            error={e.uspAudience}
            onRetry={() => retry('uspAudience')}
          >
            <p className="text-sm text-slate-300 leading-relaxed italic">"{bp.usp}"</p>
          </BlueprintSection>

          <BlueprintSection
            title="Target Audience"
            status={s.uspAudience ?? 'idle'}
            error={e.uspAudience}
            skeletonLines={5}
          >
            <div className="space-y-3">
              {(bp.targetAudience ?? []).map((seg, i) => (
                <div key={i} className="glass-card-sm p-4">
                  <p className="font-semibold text-sm text-violet-300 mb-2">{seg.segment}</p>
                  <p className="text-xs text-slate-400 mb-1">{seg.demographics}</p>
                  <p className="text-xs text-slate-500">{seg.behaviours}</p>
                </div>
              ))}
            </div>
          </BlueprintSection>

          <BlueprintSection
            title="Business Model"
            status={s.businessModel ?? 'idle'}
            error={e.businessModel}
            onRetry={() => retry('businessModel')}
          >
            <p className="text-sm text-slate-300 leading-relaxed">{bp.businessModel}</p>
          </BlueprintSection>

          <BlueprintSection
            title="Revenue Streams"
            status={s.revenueStreams ?? 'idle'}
            error={e.revenueStreams}
            onRetry={() => retry('revenueStreams')}
            skeletonLines={4}
          >
            <RevenueStreams streams={bp.revenueStreams ?? []} />
          </BlueprintSection>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <BlueprintSection
            title="Market Opportunity"
            status={s.market ?? 'idle'}
            error={e.market}
            onRetry={() => retry('market')}
            skeletonLines={5}
          >
            <div className="space-y-4">
              <div className="glass-card-sm p-4 text-center border-blue-500/20">
                <p className="text-xs text-blue-400 font-medium mb-1">Total Addressable Market</p>
                <p className="text-2xl font-bold text-white">{bp.marketOpportunity?.tam}</p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{bp.marketOpportunity?.growthNarrative}</p>
              <div className="space-y-2">
                {(bp.marketOpportunity?.dataPoints ?? []).map((dp, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-blue-400 flex-shrink-0">▸</span> {dp}
                  </div>
                ))}
              </div>
            </div>
          </BlueprintSection>

          <BlueprintSection
            title="Competitor Analysis"
            status={s.competitors ?? 'idle'}
            error={e.competitors}
            onRetry={() => retry('competitors')}
            skeletonLines={8}
          >
            <CompetitorTable competitors={bp.competitors ?? []} />
          </BlueprintSection>

          <BlueprintSection
            title="SWOT Analysis"
            status={s.swot ?? 'idle'}
            error={e.swot}
            onRetry={() => retry('swot')}
            skeletonLines={6}
          >
            {bp.swot && <SwotGrid swot={bp.swot} />}
          </BlueprintSection>

          <BlueprintSection
            title="Marketing Strategy"
            status={s.marketingChannels ?? 'idle'}
            error={e.marketingChannels}
            onRetry={() => retry('marketingChannels')}
            skeletonLines={5}
          >
            <div className="space-y-3">
              {(bp.marketingChannels ?? []).map((ch, i) => (
                <div key={i} className="glass-card-sm p-4">
                  <p className="font-semibold text-sm text-pink-300 mb-1">{ch.channel}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{ch.description}</p>
                </div>
              ))}
            </div>
          </BlueprintSection>

          <BlueprintSection
            title="Funding Requirements"
            status={s.fundingRequirement ?? 'idle'}
            error={e.fundingRequirement}
            onRetry={() => retry('fundingRequirement')}
          >
            <div>
              <p className="text-2xl font-bold text-white mb-3">{bp.fundingRequirement?.amountRange}</p>
              <p className="text-xs text-slate-400 mb-2">Use of Funds:</p>
              <ul className="space-y-1.5">
                {(bp.fundingRequirement?.usesOfFunds ?? []).map((use, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          </BlueprintSection>

          <BlueprintSection
            title="Investor Pitch"
            status={s.investorPitch ?? 'idle'}
            error={e.investorPitch}
            onRetry={() => retry('investorPitch')}
            skeletonLines={6}
          >
            <p className="text-sm text-slate-300 leading-relaxed">{bp.investorPitch}</p>
          </BlueprintSection>
        </div>
      </div>

      {/* Pitch Deck Viewer */}
      {bp.startupName && (
        <div className="mt-8">
          <PitchDeckViewer blueprint={bp} />
        </div>
      )}
    </div>
  );
}
