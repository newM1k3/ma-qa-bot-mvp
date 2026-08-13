import { Terminal, Coffee, Wrench, Zap } from 'lucide-react';
import type { Persona } from '@/types';

export const PERSONAS: Persona[] = [
  {
    id: 'hacker',
    name: 'The Hacker',
    tagline: 'Breaks auth & input boundaries',
    description:
      'Probes for injection, auth bypass, and edge cases that let an attacker escalate privileges or leak data.',
    icon: Terminal,
    accent: 'emerald',
  },
  {
    id: 'grandma',
    name: 'The Confused Grandma',
    tagline: 'Finds confusing UX & dead ends',
    description:
      'Clicks everything out of order, ignores hints, and reports every moment the app stops making sense.',
    icon: Coffee,
    accent: 'amber',
  },
  {
    id: 'mechanic',
    name: 'The Mechanic',
    tagline: 'Writes refactor tickets',
    description:
      'Reads the code smell, then ships a concrete refactor ticket with a before/after code block.',
    icon: Wrench,
    accent: 'sky',
  },
  {
    id: 'speedrunner',
    name: 'The Speedrunner',
    tagline: 'Hunts slow paths & N+1s',
    description:
      'Times every flow, flags anything over 200ms, and points at the query or render that bottlenecks it.',
    icon: Zap,
    accent: 'rose',
  },
];

export const PERSONA_MAP: Record<string, Persona> = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p]),
);
