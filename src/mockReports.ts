import type { BugReport, PersonaId } from '@/types';

const REPORT_BANK: Record<PersonaId, Omit<BugReport, 'id' | 'personaId' | 'personaName'>[]> = {
  hacker: [
    {
      kind: 'bug',
      severity: 'critical',
      title: 'Auth token leaked into URL fragment',
      detail:
        'The session token is written to window.location.hash and survives navigation. Any third-party script on the page can read it via location.hash and exfiltrate it. Move the token to an httpOnly cookie and strip it from the URL after the silent handshake.',
    },
    {
      kind: 'bug',
      severity: 'critical',
      title: 'No input length cap on repo URL field',
      detail:
        'The repository URL input has no maxLength and is passed unescaped into a template string before the fetch. A 50KB paste crashes the parser and can be used to probe error messages. Cap at 2000 chars and validate against a URL pattern before submission.',
    },
    {
      kind: 'bug',
      severity: 'warning',
      title: 'CORS allows credentials with wildcard origin',
      detail:
        'The diagnostics endpoint responds with Access-Control-Allow-Origin: * while also setting Allow-Credentials: true. Browsers block the combination, but any misconfigured proxy in front of it will happily forward credentials to every origin. Pin the origin to the dashboard host.',
    },
  ],
  grandma: [
    {
      kind: 'bug',
      severity: 'warning',
      title: 'Empty repo URL shows no message',
      detail:
        'I clicked Run Diagnostics without typing anything. The button spun for three seconds and then nothing happened. Tell me the box is empty before I wait.',
    },
    {
      kind: 'bug',
      severity: 'warning',
      title: 'Persona cards toggle with no clear state',
      detail:
        'I tapped a card and the border changed, but I could not tell which ones were on. A checkmark or a filled background would help me know what is selected.',
    },
    {
      kind: 'bug',
      severity: 'info',
      title: 'Log disappears when I scroll up',
      detail:
        'New reports push the log down and I lose my place while reading. Keep my scroll position, or stop auto-scrolling once I have scrolled up to read.',
    },
  ],
  mechanic: [
    {
      kind: 'refactor',
      severity: 'warning',
      title: 'Refactor: extract report rendering into a switch',
      detail:
        'BugReport and RefactorTicket share a render path but differ in shape. Splitting them via a discriminated union on kind removes three nullable checks and makes the output log a single switch.',
      code: `type Entry =
  | { kind: 'bug'; severity: Severity; title: string; detail: string }
  | { kind: 'refactor'; severity: Severity; title: string; code: string };

function LogEntry({ entry }: { entry: Entry }) {
  switch (entry.kind) {
    case 'bug':
      return <BugRow {...entry} />;
    case 'refactor':
      return <RefactorRow {...entry} />;
  }
}`,
      language: 'typescript',
    },
    {
      kind: 'refactor',
      severity: 'info',
      title: 'Refactor: hoist persona list out of the component',
      detail:
        'PERSONAS is a constant array recreated in render scope. Hoist it to a module so the identity is stable for memoized children and the selector does not re-render on every keystroke.',
      code: `// before
function Selector() {
  const personas = [
    { id: 'hacker', name: 'The Hacker', ... },
    ...
  ];
  return personas.map(...);
}

// after
const PERSONAS = [ ... ];
function Selector() {
  return PERSONAS.map(...);
}`,
      language: 'typescript',
    },
    {
      kind: 'refactor',
      severity: 'warning',
      title: 'Refactor: replace setTimeout chain with AbortController',
      detail:
        'The 3-second mock delay uses nested setTimeouts and cannot be cancelled. If the user navigates away or re-runs, stale reports still land. Wire an AbortController and check signal.aborted before committing state.',
      code: `const controller = new AbortController();
await new Promise<void>((resolve) => {
  const t = setTimeout(resolve, 3000);
  controller.signal.addEventListener('abort', () => {
    clearTimeout(t);
    resolve();
  });
});
if (controller.signal.aborted) return;`,
      language: 'typescript',
    },
  ],
  speedrunner: [
    {
      kind: 'bug',
      severity: 'critical',
      title: 'Output log re-renders all entries on each new report',
      detail:
        'Every new report triggers a map over the entire log array with no key stability, so React reconciles every row. At 50+ entries this crosses 16ms per append. Memoize each row and key by report id.',
    },
    {
      kind: 'bug',
      severity: 'warning',
      title: 'Persona icons re-instantiated on every render',
      detail:
        'The icon component is pulled from the persona object inside map, creating a new reference each render. Destructure the icon once at module scope or wrap the card in React.memo.',
    },
    {
      kind: 'bug',
      severity: 'warning',
      title: 'Diagnostic delay blocks the main thread',
      detail:
        'The mock delay is fine, but the real AI call is awaited inline in the click handler with no streaming. Long responses freeze the button. Stream the response and append chunks as they arrive so the first byte paints immediately.',
    },
  ],
};

let counter = 0;
function nextId(): string {
  counter += 1;
  return `rpt_${counter}`;
}

export function generateReports(
  personaIds: PersonaId[],
  personaNames: Record<PersonaId, string>,
): BugReport[] {
  const reports: BugReport[] = [];
  for (const id of personaIds) {
    const bank = REPORT_BANK[id] ?? [];
    for (const base of bank) {
      reports.push({
        ...base,
        id: nextId(),
        personaId: id,
        personaName: personaNames[id],
      });
    }
  }
  return reports;
}
