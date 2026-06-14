import { Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBlueprint } from '../../context/BlueprintContext';

interface NavbarProps {
  onToggleHistory?: () => void;
}

export function Navbar({ onToggleHistory }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useBlueprint();

  function handleNewPitch() {
    dispatch({ type: 'CLEAR_BLUEPRINT' });
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-40 w-full glass-card-sm rounded-none border-x-0 border-t-0 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo — only icon in the app */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white group-hover:text-accent-light transition-colors">
            PitchGen <span className="text-accent-light">AI</span>
          </span>
        </button>

        {/* Actions — text only */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewPitch}
            className="btn-ghost px-4 py-2 text-sm rounded-lg"
          >
            New Pitch
          </button>

          {location.pathname !== '/history' && (
            <button
              onClick={onToggleHistory}
              className="btn-ghost px-4 py-2 text-sm rounded-lg"
            >
              History
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
