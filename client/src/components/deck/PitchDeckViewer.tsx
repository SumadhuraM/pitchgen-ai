import { useState } from 'react';
import { SlideNav } from './SlideNav';
import { Slide01Cover } from './slides/Slide01Cover';
import { Slide02Problem } from './slides/Slide02Problem';
import { Slide03Solution } from './slides/Slide03Solution';
import { Slide04Market } from './slides/Slide04Market';
import { Slide05BusinessModel } from './slides/Slide05BusinessModel';
import { Slide06Competitors } from './slides/Slide06Competitors';
import { Slide07GTM } from './slides/Slide07GTM';
import { Slide08Financials } from './slides/Slide08Financials';
import { Slide09Team } from './slides/Slide09Team';
import { Slide10FundingAsk } from './slides/Slide10FundingAsk';
import { exportDeck } from '../../services/pdfExporter';
import type { StartupBlueprint } from '../../types';
import { useBlueprint } from '../../context/BlueprintContext';

interface PitchDeckViewerProps {
  blueprint: Partial<StartupBlueprint>;
}

const SLIDES = [
  Slide01Cover, Slide02Problem, Slide03Solution, Slide04Market,
  Slide05BusinessModel, Slide06Competitors, Slide07GTM,
  Slide08Financials, Slide09Team, Slide10FundingAsk,
];

export function PitchDeckViewer({ blueprint }: PitchDeckViewerProps) {
  const { state, dispatch } = useBlueprint();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const current = state.activeSlide;
  const SlideComponent = SLIDES[current];

  function goTo(slide: number) {
    dispatch({ type: 'SET_ACTIVE_SLIDE', slide });
  }

  async function handleExport() {
    if (!blueprint.startupName) return;
    setExporting(true);
    setExportError('');
    try {
      await exportDeck(blueprint as StartupBlueprint);
    } catch (err) {
      console.error('[PitchGen] PDF export failed:', err);
      setExportError('PDF export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h3 className="font-semibold text-white text-sm">Pitch Deck Preview</h3>
        <div className="flex items-center gap-3">
          {exportError && <span className="text-xs text-red-400">{exportError}</span>}
          <button
            onClick={handleExport}
            disabled={exporting || !blueprint.startupName}
            className="btn-accent px-4 py-2 text-sm"
          >
            {exporting ? 'Exporting…' : 'Export as PDF'}
          </button>
        </div>
      </div>

      {/* Slide display */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0">
          <SlideComponent blueprint={blueprint} />
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-white/5">
        <SlideNav
          current={current}
          total={10}
          onPrev={() => goTo(Math.max(0, current - 1))}
          onNext={() => goTo(Math.min(9, current + 1))}
        />
      </div>

      {/* Off-screen PDF render target */}
      <div id="pdf-slides-container">
        {SLIDES.map((Slide, i) => (
          <div key={i} className="pdf-slide" style={{ width: 1280, height: 720 }}>
            <Slide blueprint={blueprint} />
          </div>
        ))}
      </div>
    </div>
  );
}
