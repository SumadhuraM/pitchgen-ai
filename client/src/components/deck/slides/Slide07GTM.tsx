import type { StartupBlueprint } from '../../../types';

export function Slide07GTM({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  return (
    <div className="slide-bg w-full h-full flex flex-col p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-rose-600" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-pink-400 uppercase">Go-to-Market</span>
          <h2 className="text-5xl font-bold text-white mt-2">How We Reach Customers</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 flex-1">
          {(blueprint.marketingChannels ?? []).slice(0, 3).map((ch, i) => (
            <div key={i} className="glass-card p-5 border-pink-500/20 flex flex-col">
              <h4 className="font-semibold text-white text-sm mb-3">{ch.channel}</h4>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">{ch.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
