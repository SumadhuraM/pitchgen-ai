interface SlideNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const SLIDE_LABELS = [
  'Cover', 'Problem', 'Solution', 'Market', 'Business Model',
  'Competitors', 'Go-to-Market', 'Financials', 'Team & Vision', 'Funding Ask',
];

export function SlideNav({ current, total, onPrev, onNext }: SlideNavProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="btn-ghost px-4 py-2 text-sm rounded-lg disabled:opacity-30"
        >
          Prev
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? 'w-6 h-2 bg-violet-500'
                  : 'w-2 h-2 bg-slate-600'
              }`}
              title={SLIDE_LABELS[i]}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={current === total - 1}
          className="btn-ghost px-4 py-2 text-sm rounded-lg disabled:opacity-30"
        >
          Next
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Slide {current + 1} of {total} — <span className="text-slate-400">{SLIDE_LABELS[current]}</span>
      </p>
    </div>
  );
}
