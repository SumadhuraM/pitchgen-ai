import { BUSINESS_DOMAINS, type BusinessDomain } from '../../types';

interface DomainSelectorProps {
  value: BusinessDomain | '';
  onChange: (domain: BusinessDomain) => void;
  error?: string;
}

export function DomainSelector({ value, onChange, error }: DomainSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Business Domain <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as BusinessDomain)}
          className={`glass-input w-full px-4 py-3 appearance-none text-sm ${
            !value ? 'text-slate-400' : 'text-white'
          } ${error ? 'border-red-500/50' : ''}`}
        >
          <option value="" disabled>Select a domain…</option>
          {BUSINESS_DOMAINS.map(domain => (
            <option key={domain} value={domain} className="bg-[#1a1a2e] text-white">
              {domain}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
