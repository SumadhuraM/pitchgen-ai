import type { RevenueStream } from '../../types';

interface RevenueStreamsProps {
  streams: RevenueStream[];
}

export function RevenueStreams({ streams }: RevenueStreamsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {streams.map((stream, i) => (
        <div key={i} className="glass-card-sm p-4">
          <h4 className="font-semibold text-sm text-white mb-2">{stream.name}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{stream.description}</p>
        </div>
      ))}
    </div>
  );
}
