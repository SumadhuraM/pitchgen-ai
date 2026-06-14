import type { HistoryEntry, StartupBlueprint } from '../types';

const STORAGE_KEY = 'pitchgen_history';
const MAX_ENTRIES = 50;

export function saveBlueprint(blueprint: StartupBlueprint): void {
  try {
    const history = loadHistory();
    const entry: HistoryEntry = {
      id: blueprint.id,
      startupName: blueprint.startupName,
      domain: blueprint.domain,
      createdAt: blueprint.createdAt,
      blueprint,
    };
    // Remove duplicate if exists, then prepend new entry
    const filtered = history.filter(e => e.id !== blueprint.id);
    const updated = [entry, ...filtered].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      console.warn('[PitchGen] localStorage quota exceeded. Could not save blueprint.');
    } else {
      console.error('[PitchGen] Failed to save blueprint to history:', err);
    }
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function deleteEntry(id: string): void {
  try {
    const updated = loadHistory().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('[PitchGen] Failed to delete history entry:', err);
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
