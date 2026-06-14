import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { GenerationState, StartupBlueprint, SectionStatus } from '../types';

// ── Actions ──────────────────────────────────────────────────────────────────

type BlueprintAction =
  | { type: 'GENERATION_START' }
  | { type: 'SECTION_LOADING'; section: string }
  | { type: 'SECTION_SUCCESS'; section: string; data: Partial<StartupBlueprint> }
  | { type: 'SECTION_ERROR'; section: string; error: string }
  | { type: 'SET_BLUEPRINT'; blueprint: StartupBlueprint }
  | { type: 'SET_ACTIVE_SLIDE'; slide: number }
  | { type: 'TOGGLE_HISTORY' }
  | { type: 'CLEAR_BLUEPRINT' };

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState: GenerationState = {
  blueprint: null,
  fullBlueprint: null,
  sectionStatus: {},
  sectionErrors: {},
  activeSlide: 0,
  isHistoryOpen: false,
  isGenerating: false,
};

// ── Reducer ───────────────────────────────────────────────────────────────────

function blueprintReducer(
  state: GenerationState,
  action: BlueprintAction
): GenerationState {
  switch (action.type) {
    case 'GENERATION_START':
      return {
        ...initialState,
        isGenerating: true,
        blueprint: {},
        isHistoryOpen: false,
      };

    case 'SECTION_LOADING':
      return {
        ...state,
        sectionStatus: { ...state.sectionStatus, [action.section]: 'loading' as SectionStatus },
      };

    case 'SECTION_SUCCESS':
      return {
        ...state,
        blueprint: { ...state.blueprint, ...action.data },
        sectionStatus: { ...state.sectionStatus, [action.section]: 'success' as SectionStatus },
        sectionErrors: { ...state.sectionErrors, [action.section]: '' },
      };

    case 'SECTION_ERROR':
      return {
        ...state,
        sectionStatus: { ...state.sectionStatus, [action.section]: 'error' as SectionStatus },
        sectionErrors: { ...state.sectionErrors, [action.section]: action.error },
      };

    case 'SET_BLUEPRINT':
      return {
        ...state,
        blueprint: action.blueprint,
        fullBlueprint: action.blueprint,
        isGenerating: false,
        activeSlide: 0,
      };

    case 'SET_ACTIVE_SLIDE':
      return { ...state, activeSlide: action.slide };

    case 'TOGGLE_HISTORY':
      return { ...state, isHistoryOpen: !state.isHistoryOpen };

    case 'CLEAR_BLUEPRINT':
      return initialState;

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface BlueprintContextValue {
  state: GenerationState;
  dispatch: React.Dispatch<BlueprintAction>;
}

const BlueprintContext = createContext<BlueprintContextValue | null>(null);

export function BlueprintProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(blueprintReducer, initialState);
  return (
    <BlueprintContext.Provider value={{ state, dispatch }}>
      {children}
    </BlueprintContext.Provider>
  );
}

export function useBlueprint() {
  const ctx = useContext(BlueprintContext);
  if (!ctx) throw new Error('useBlueprint must be used inside BlueprintProvider');
  return ctx;
}
