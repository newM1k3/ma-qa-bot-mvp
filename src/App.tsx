import { useMemo, useState } from 'react';
import { Activity, Bot, CircleHelp, Github, Radio, Settings2 } from 'lucide-react';
import { CommandCenter } from '@/components/CommandCenter';
import { OutputLog } from '@/components/OutputLog';
import { PERSONAS } from '@/personas';
import { generateReports } from '@/mockReports';
import { useSession } from '@/useSession';
import type { BugReport, PersonaId } from '@/types';

const DEFAULT_REPO = 'https://github.com/mjw-apps/checkout-service';

function App() {
  const { ready } = useSession();
  const [repoUrl, setRepoUrl] = useState(DEFAULT_REPO);
  const [selected, setSelected] = useState<PersonaId[]>([
    'hacker',
    'grandma',
    'mechanic',
  ]);
  const [reports, setReports] = useState<BugReport[]>([]);
  const [running, setRunning] = useState(false);

  const personaNames = useMemo(
    () => Object.fromEntries(PERSONAS.map((persona) => [persona.id, persona.name])) as Record<PersonaId, string>,
    [],
  );

  function togglePersona(id: PersonaId): void {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function runDiagnostics(): void {
    if (running || selected.length === 0 || !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(repoUrl)) return;
    setRunning(true);
    setReports([]);
    window.setTimeout(() => {
      setReports(generateReports(selected, personaNames));
      setRunning(false);
    }, 3000);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#080b10] text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:linear-gradient(rgba(71,85,105,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <header className="relative border-b border-slate-800/80 bg-[#080b10]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-100">MA-QA-Bot</span>
                <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[9px] text-slate-500">MVP</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Autonomous QA command center</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-[11px] text-slate-500 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              {ready ? 'System online' : 'Initializing'}
            </span>
            <button type="button" aria-label="Help" className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200">
              <CircleHelp className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Settings" className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200">
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              <Activity className="h-3.5 w-3.5" />
              Mission control
            </div>
            <h1 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Find what humans miss.</h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-400">Deploy a team of opinionated AI agents against your codebase and turn their findings into a clear action list.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 sm:self-auto">
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-slate-400">MOCK ENGINE / v0.1.0</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <CommandCenter repoUrl={repoUrl} onRepoUrlChange={setRepoUrl} selected={selected} onTogglePersona={togglePersona} onRun={runDiagnostics} running={running} />
          <OutputLog reports={reports} running={running} repoUrl={repoUrl} />
        </div>

        <footer className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-slate-800/80 pt-5 text-[11px] text-slate-600 sm:flex-row sm:items-center">
          <span>MA-QA-Bot is an experimental testing surface. Always verify findings before shipping.</span>
          <span className="flex items-center gap-1.5"><Github className="h-3.5 w-3.5" /> Built for the MJW App Platform</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
