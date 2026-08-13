# MA-QA-Bot MVP

> **Status:** This is a presentational MVP. Treat all diagnostic output as sample data until the server-side review workflow, repository permissions, authentication, and audit trail are implemented.

## What it does

MA-QA-Bot MVP is a browser-based prototype for starting a quality review of a GitHub repository. An operator pastes a repository address, selects one or more review personas, and sees a diagnostic-style report. The current interface is a demonstration: it presents local mock findings and its serverless endpoint only validates and echoes a request. It does not yet fetch repositories, run an AI review, or authenticate users.

## How the project is organized

| Location | Purpose |
|---|---|
| `src/App.tsx` | Coordinates the main screen and prototype workflow. |
| `src/components/` | Contains the command centre, persona selector, and output-log interface. |
| `src/mockReports.ts and src/personas.ts` | Hold the sample review content and persona definitions. |
| `src/lib/ and src/useSession.ts` | Contain PocketBase and session-related scaffolding. |
| `netlify/functions/diagnostics.ts` | Provides the future server-side request boundary; it does not perform an AI review today. |
| `vite.config.ts and Tailwind/TypeScript files` | Configure the browser application and its build tooling. |

## Main technologies

React, TypeScript, Vite, Tailwind CSS, Netlify Functions, PocketBase scaffolding, and Lucide icons.

## Get started

Use **Node.js 20–24** and **npm 10 or later**. The committed `package-lock.json` is the supported dependency snapshot.

```bash
npm ci
npm run dev
```

Open the local address printed by Vite. To prepare a production build, use:

```bash
npm run build
npm run preview
```

## Quality checks

The repository exposes separate checks so they can be run locally or in continuous integration.

```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

`npm run check` runs the three commands above in sequence. These checks validate the source and build configuration; they do not prove that third-party services, browser permissions, payment flows, or device-specific behaviour work in production.

## Configuration and data

The prototype can be viewed without service credentials. Any future PocketBase, GitHub, or AI-provider values must remain server-side or in the deployment platform’s secret store; never expose provider keys in browser code.

## Review priorities

1. Restrict the diagnostics endpoint to canonical GitHub owner/repository URLs and add authentication, rate limits, request-size limits, timeouts, and an explicit allowed-origin policy before it can call external services.
2. Replace mock output with a bounded server-side review flow that clearly reports progress, failures, cancellation, and supported repository types.
3. Either remove unused session scaffolding or connect it to a real authentication and authorization boundary.
4. Keep the lockfile committed and update dependencies in small, tested batches rather than making an unreviewed framework upgrade.

## Contributing

Keep changes small and reviewable. Run `npm run check` before opening a pull request, preserve the lockfile when changing dependencies, and avoid committing secrets, customer data, personal exports, or generated build output.

## License

No license file is currently included. Add one before distributing the project as open-source software.
