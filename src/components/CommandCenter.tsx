import { useState } from 'react';
import { GitBranch, Loader2, Play, ShieldCheck } from 'lucide-react';
import { PersonaSelector } from '@/components/PersonaSelector';
import type { PersonaId } from '@/types';

interface Props {
  repoUrl: string;
  onRepoUrlChange: (value: string) => void;
  selected: PersonaId[];
  onTogglePersona: (id: PersonaId) => void;
  onRun: () => void;
  running: boolean;
}

export function CommandCenter({
  repoUrl,
  onRepoUrlChange,
  selected,
  onTogglePersona,
  onRun,
  running,
}: Props) {
  const [touched, setTouched] = useState(false);
  const urlValid = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(repoUrl);
  const showError = touched && repoUrl.length > 0 && !urlValid;
  const canRun = urlValid && selected.length > 0 && !running;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Command Center
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Point the bots at a repo and pick who runs the audit.
            </p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Session active
          </span>
        </div>

        <div>
          <label
            htmlFor="repo-url"
            className="mb-1.5 block text-xs font-medium text-slate-400"
          >
            GitHub Repository URL
          </label>
          <div
            className={[
              'flex items-center gap-2 rounded-xl border bg-slate-950/60 px-3 transition-colors',
              showError
                ? 'border-rose-500/60'
                : urlValid
                  ? 'border-emerald-500/40'
                  : 'border-slate-700 focus-within:border-slate-500',
            ].join(' ')}
          >
            <GitBranch className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              id="repo-url"
              type="url"
              value={repoUrl}
              onChange={(e) => onRepoUrlChange(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="https://github.com/owner/repo"
              className="w-full bg-transparent py-3 text-sm text-slate-100 placeholder-slate-600 outline-none"
            />
          </div>
          <div className="mt-1.5 h-4 text-xs">
            {showError ? (
              <span className="text-rose-400">
                Enter a full GitHub URL (https://github.com/owner/repo).
              </span>
            ) : urlValid ? (
              <span className="text-emerald-400/80">Valid repository URL.</span>
            ) : null}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Testing Agents
            </span>
            <span className="text-xs text-slate-500">
              {selected.length} selected
            </span>
          </div>
          <PersonaSelector
            selected={selected}
            onToggle={onTogglePersona}
            disabled={running}
          />
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={!canRun}
          className={[
            'group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold transition-all',
            canRun
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_30px_-8px_rgba(52,211,153,0.6)]'
              : 'cursor-not-allowed bg-slate-800 text-slate-500',
          ].join(' ')}
        >
          {running ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running diagnostics...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Diagnostics
            </>
          )}
        </button>
      </div>
    </section>
  );
}
