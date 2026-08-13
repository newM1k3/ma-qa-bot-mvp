import { useEffect, useRef } from 'react';
import { AlertTriangle, Bug, Info, Terminal, Wrench } from 'lucide-react';
import type { BugReport, Severity } from '@/types';

interface Props {
  reports: BugReport[];
  running: boolean;
  repoUrl: string;
}

const SEVERITY: Record<
  Severity,
  { label: string; color: string; icon: typeof Bug }
> = {
  critical: {
    label: 'Critical',
    color: 'text-rose-300',
    icon: Bug,
  },
  warning: {
    label: 'Warning',
    color: 'text-amber-300',
    icon: AlertTriangle,
  },
  info: {
    label: 'Info',
    color: 'text-sky-300',
    icon: Info,
  },
};

function BugRow({ report }: { report: BugReport }) {
  const sev = SEVERITY[report.severity];
  const SevIcon = sev.icon;
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-start gap-3">
        <span
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-800',
            sev.color,
          ].join(' ')}
        >
          <SevIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-semibold uppercase ${sev.color}`}>
              {sev.label}
            </span>
            <span className="text-[11px] text-slate-600">/</span>
            <span className="text-[11px] text-slate-500">{report.personaName}</span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-slate-100">
            {report.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            {report.detail}
          </p>
        </div>
      </div>
    </article>
  );
}

function RefactorRow({ report }: { report: BugReport }) {
  const sev = SEVERITY[report.severity];
  return (
    <article className="rounded-lg border border-sky-500/30 bg-sky-950/20 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-300">
          <Wrench className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase text-sky-300">
              Refactor Ticket
            </span>
            <span className="text-[11px] text-slate-600">/</span>
            <span className="text-[11px] text-slate-500">{report.personaName}</span>
            <span className={`text-[11px] ${sev.color}`}>/ {sev.label}</span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-slate-100">
            {report.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            {report.detail}
          </p>
          {report.code ? (
            <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-[11px] leading-relaxed text-slate-300">
              <code>{report.code}</code>
            </pre>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function OutputLog({ reports, running, repoUrl }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [reports, running]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Output Log
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {reports.length > 0
              ? `${reports.length} report${reports.length === 1 ? '' : 's'}`
              : 'No diagnostics run yet.'}
          </p>
        </div>
        <Terminal className="h-4 w-4 text-slate-600" />
      </div>

      <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
        {reports.length === 0 && !running ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Terminal className="h-8 w-8 text-slate-700" />
            <p className="text-sm text-slate-500">
              Run diagnostics to see reports stream in here.
            </p>
          </div>
        ) : null}

        {running ? (
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400">
              Auditing{' '}
              <span className="font-mono text-slate-300">{repoUrl}</span>...
            </span>
          </div>
        ) : null}

        {reports.map((report) =>
          report.kind === 'refactor' ? (
            <RefactorRow key={report.id} report={report} />
          ) : (
            <BugRow key={report.id} report={report} />
          ),
        )}
        <div ref={endRef} />
      </div>
    </section>
  );
}
