import { useState } from 'react';
import { HistoryCard } from './HistoryCard';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useBlueprint } from '../../context/BlueprintContext';
import { loadHistory, deleteEntry } from '../../utils/historyStore';
import { useNavigate } from 'react-router-dom';
import type { HistoryEntry } from '../../types';

interface HistorySidebarProps {
  onClose?: () => void;
}

export function HistorySidebar({ onClose }: HistorySidebarProps) {
  const { dispatch } = useBlueprint();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function handleSelect(entry: HistoryEntry) {
    dispatch({ type: 'SET_BLUEPRINT', blueprint: entry.blueprint });
    navigate('/generate');
    onClose?.();
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteEntry(deleteTarget);
    setHistory(loadHistory());
    setDeleteTarget(null);
  }

  return (
    <div className="h-full flex flex-col glass-card rounded-none border-t-0 border-b-0 border-r-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-white">History</h3>
          <span className="text-xs text-slate-500">({history.length})</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-ghost px-3 py-1.5 text-xs rounded-lg">
            Close
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-sm text-slate-500 font-medium">No pitch decks yet</p>
            <p className="text-xs text-slate-600 mt-1">
              Generate your first pitch deck to see it here.
            </p>
          </div>
        ) : (
          history.map(entry => (
            <HistoryCard
              key={entry.id}
              entry={entry}
              onSelect={() => handleSelect(entry)}
              onDelete={() => setDeleteTarget(entry.id)}
            />
          ))
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Pitch Deck"
          message="This pitch deck will be permanently removed from your history. This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
