import { HistorySidebar } from '../components/history/HistorySidebar';

export function HistoryPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Your Pitch Deck History</h2>
      <div className="h-[calc(100vh-160px)]">
        <HistorySidebar />
      </div>
    </div>
  );
}
