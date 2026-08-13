import type { LucideIcon } from 'lucide-react';

export type PersonaId =
  | 'hacker'
  | 'grandma'
  | 'mechanic'
  | 'speedrunner';

export interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export type Severity = 'critical' | 'warning' | 'info';

export type ReportKind = 'bug' | 'refactor';

export interface BugReport {
  id: string;
  personaId: PersonaId;
  personaName: string;
  kind: ReportKind;
  severity: Severity;
  title: string;
  detail: string;
  code?: string;
  language?: string;
}
