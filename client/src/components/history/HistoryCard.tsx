import type { HistoryEntry } from '../../types';

interface HistoryCardProps {
  entry: HistoryEntry;
  onSelect: () => void;
  onDelete: () => void;
}

export function HistoryCard({ entry, onSelect, onDelete }: HistoryCardProps) {
  const date = new Date(entry.createdAt);
  const formatted = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="glass-card-sm p-4 group hover:border-violet-500/30 transition-all cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">{entry.startupName}</p>
          <p className="text-xs text-violet-400 mt-0.5">{entry.domain}</p>
          <p className="text-xs text-slate-500 mt-1">{formatted} · {time}</p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="text-xs text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 px-2 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
