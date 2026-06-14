import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { HistorySidebar } from '../history/HistorySidebar';
import { useBlueprint } from '../../context/BlueprintContext';

export function AppShell() {
  const { state, dispatch } = useBlueprint();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      <Navbar onToggleHistory={() => dispatch({ type: 'TOGGLE_HISTORY' })} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* History sidebar overlay */}
        {state.isHistoryOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => dispatch({ type: 'TOGGLE_HISTORY' })}
            />
            <div className="fixed right-0 top-0 h-full z-40 w-80 lg:static lg:z-auto animate-slide-up">
              <HistorySidebar onClose={() => dispatch({ type: 'TOGGLE_HISTORY' })} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
