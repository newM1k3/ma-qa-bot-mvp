import { Check } from 'lucide-react';
import { PERSONAS } from '@/personas';
import type { PersonaId } from '@/types';

interface Props {
  selected: PersonaId[];
  onToggle: (id: PersonaId) => void;
  disabled?: boolean;
}

const ACCENT: Record<
  string,
  { ring: string; border: string; glow: string; chip: string; iconWrap: string }
> = {
  emerald: {
    ring: 'ring-emerald-400/60',
    border: 'border-emerald-400/70',
    glow: 'shadow-[0_0_24px_-6px_rgba(52,211,153,0.45)]',
    chip: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    iconWrap: 'bg-emerald-400/10 text-emerald-300',
  },
  amber: {
    ring: 'ring-amber-400/60',
    border: 'border-amber-400/70',
    glow: 'shadow-[0_0_24px_-6px_rgba(251,191,36,0.45)]',
    chip: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    iconWrap: 'bg-amber-400/10 text-amber-300',
  },
  sky: {
    ring: 'ring-sky-400/60',
    border: 'border-sky-400/70',
    glow: 'shadow-[0_0_24px_-6px_rgba(56,189,248,0.45)]',
    chip: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    iconWrap: 'bg-sky-400/10 text-sky-300',
  },
  rose: {
    ring: 'ring-rose-400/60',
    border: 'border-rose-400/70',
    glow: 'shadow-[0_0_24px_-6px_rgba(251,113,133,0.45)]',
    chip: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
    iconWrap: 'bg-rose-400/10 text-rose-300',
  },
};

export function PersonaSelector({ selected, onToggle, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {PERSONAS.map((persona) => {
        const Icon = persona.icon;
        const isOn = selected.includes(persona.id);
        const accent = ACCENT[persona.accent];
        return (
          <button
            key={persona.id}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(persona.id)}
            aria-pressed={isOn}
            className={[
              'group relative flex h-full flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isOn
                ? `${accent.border} ${accent.glow} bg-slate-800/70 ring-1 ${accent.ring}`
                : 'border-slate-700/60 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/50',
            ].join(' ')}
          >
            <div className="flex items-start justify-between">
              <div
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                  isOn ? accent.iconWrap : 'bg-slate-800 text-slate-400',
                ].join(' ')}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={[
                  'flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-all',
                  isOn
                    ? `${accent.chip} opacity-100`
                    : 'border-slate-700 text-transparent opacity-0 group-hover:opacity-40',
                ].join(' ')}
              >
                <Check className="h-3 w-3" />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-100">
                {persona.name}
              </span>
              <span className="text-xs text-slate-400">{persona.tagline}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              {persona.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
