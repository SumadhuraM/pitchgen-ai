import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DomainSelector } from './DomainSelector';
import { useBlueprint } from '../../context/BlueprintContext';
import { generateBlueprint } from '../../services/geminiService';
import { validateIdea } from '../../utils/validators';
import type { BusinessDomain } from '../../types';

export function IdeaInputForm() {
  const [idea, setIdea] = useState('');
  const [domain, setDomain] = useState<BusinessDomain | ''>('');
  const [ideaError, setIdeaError] = useState('');
  const [domainError, setDomainError] = useState('');
  const { state, dispatch } = useBlueprint();
  const navigate = useNavigate();

  const MAX_CHARS = 2000;
  const charCount = idea.length;
  const isNearLimit = charCount > 1800;
  const isOverLimit = charCount > MAX_CHARS;

  function validate(): boolean {
    const iErr = validateIdea(idea);
    setIdeaError(iErr ?? '');
    const dErr = !domain ? 'Please select a business domain.' : '';
    setDomainError(dErr);
    return !iErr && !dErr;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    navigate('/generate');
    await generateBlueprint(idea, domain as BusinessDomain, dispatch);
  }

  const examples = [
    'An AI-powered mental health app that provides personalised therapy sessions using CBT techniques',
    'A marketplace connecting local farmers with urban restaurants for fresh, same-day produce delivery',
    'A gamified language learning platform that uses social competitions to keep learners engaged',
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Hero header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-sm text-sm text-violet-300 mb-6">
            Powered by Groq AI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Turn Your Idea Into a{' '}
            <span className="text-glow" style={{ color: 'var(--accent-glow)' }}>
              Pitch Deck
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Describe your startup idea and we'll generate a complete investor-ready pitch deck in seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          {/* Idea textarea */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Startup Idea <span className="text-red-400">*</span>
            </label>
            <textarea
              value={idea}
              onChange={e => { setIdea(e.target.value); setIdeaError(''); }}
              placeholder="Describe your startup idea in detail… What problem does it solve? Who is the target customer?"
              rows={5}
              maxLength={MAX_CHARS}
              className={`glass-input w-full px-4 py-3 text-sm resize-none ${ideaError ? 'border-red-500/50' : ''}`}
            />
            <div className="flex items-start justify-between mt-1.5 gap-2">
              {ideaError
                ? <p className="text-xs text-red-400">{ideaError}</p>
                : <span />
              }
              <span className={`text-xs flex-shrink-0 ${
                isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-slate-500'
              }`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Domain selector */}
          <DomainSelector
            value={domain}
            onChange={d => { setDomain(d); setDomainError(''); }}
            error={domainError}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={state.isGenerating || isOverLimit}
            className="btn-accent w-full py-4 text-base flex items-center justify-center gap-2"
          >
            {state.isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating your pitch deck…
              </>
            ) : (
              'Generate Pitch Deck'
            )}
          </button>
        </form>

        {/* Example prompts */}
        <div className="mt-8">
          <p className="text-xs text-slate-500 text-center mb-4">Try an example:</p>
          <div className="space-y-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setIdea(ex)}
                className="w-full text-left glass-card-sm p-3 text-xs text-slate-400 hover:text-slate-200 hover:border-violet-500/30 transition-all line-clamp-2"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
