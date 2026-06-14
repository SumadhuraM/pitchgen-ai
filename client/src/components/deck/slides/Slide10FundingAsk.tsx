import type { StartupBlueprint } from '../../../types';

export function Slide10FundingAsk({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  const funding = blueprint.fundingRequirement;
  return (
    <div className="slide-bg w-full h-full flex flex-col items-center justify-center p-16 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-3xl w-full">
        <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-4">Funding Ask</p>
        <h2 className="text-5xl font-bold text-white mb-4">Join Our Journey</h2>
        <div className="text-6xl font-bold mb-6" style={{ color: 'var(--accent-glow)' }}>
          {funding?.amountRange ?? 'TBD'}
        </div>
        <p className="text-lg text-slate-300 mb-8">{blueprint.investorPitch ?? 'Investor pitch will appear here.'}</p>
        {(funding?.usesOfFunds ?? []).length > 0 && (
          <div className="glass-card p-6 text-left">
            <p className="text-xs text-violet-400 font-medium uppercase tracking-wide mb-4 text-center">Use of Funds</p>
            <div className="grid grid-cols-3 gap-3">
              {(funding?.usesOfFunds ?? []).map((use, i) => (
                <div key={i} className="glass-card-sm p-3 text-center">
                  <p className="text-sm text-slate-300">{use}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
