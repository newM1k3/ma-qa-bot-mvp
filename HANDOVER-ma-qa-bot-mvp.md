# MA-QA-Bot MVP — Handover / Click-Through Doc

**Date:** 2026-08-12
**Repo:** `C:\Users\mikew\dev-mjw\ma-qa-bot-mvp`
**Running at:** http://localhost:5174 (`npm run dev`)
**Source doc:** `Downloads\MA-QA-Bot- Master Build Document.md`
**Verdict:** MVP prompt is fully implemented and working. No blocking bugs found. Two follow-up items before this is a real product (not MVP gaps — next-phase work).

---

## 1. Click-through checklist

Go through these in the browser at `localhost:5174` and confirm they match what you expect:

- [ ] **Header** — "MA-QA-Bot / MVP" badge, "System online" indicator, Help + Settings icon buttons (icon buttons are non-functional placeholders — expected for MVP)
- [ ] **Repo URL field** — type a non-GitHub URL → should show red "Enter a full GitHub URL" error. Type `https://github.com/owner/repo` → should turn green "Valid repository URL."
- [ ] **Persona cards** — click each of the 4 (Hacker, Confused Grandma, Mechanic, Speedrunner) → border/glow toggles, checkmark appears, "N selected" counter updates
- [ ] **Run Diagnostics button** — disabled (greyed out) until URL is valid AND ≥1 persona selected
- [ ] **Run it** — button shows spinner "Running diagnostics..." for ~3 seconds, then Output Log populates
- [ ] **Output Log** — bug reports show red/amber/blue severity tags; Mechanic's entries show as blue-bordered "Refactor Ticket" cards with a code block
- [ ] **Re-run** — click Run again with different personas selected, confirm log clears and repopulates (doesn't append to old results)
- [ ] **Auth handoff** — visit `localhost:5174/?token=test123&uid=user1&source=mjw-apps-dash` → page should load silently with no visible error or auth screen (this is establishing a PocketBase session in the background — nothing to see, that's correct)

## 2. What's real vs. what's mocked right now

| Piece | State |
|---|---|
| UI (all 5 required components) | Real, fully wired, no placeholders left visible |
| Repo URL validation | Real (client-side regex) |
| Persona selection state | Real |
| Diagnostics run → Output Log | **Mocked.** `src/mockReports.ts` has a canned bank of reports per persona; `App.tsx` just runs a 3s `setTimeout` and shows them. No repo is actually fetched or analyzed yet. |
| Netlify Function (`netlify/functions/diagnostics.ts`) | Stub. Validates the request (URL format, persona list) and returns a 200 acknowledgment, but does **not** call Claude/OpenAI yet — there's a literal `// TODO: call Anthropic Claude or OpenAI here` in the file. The frontend doesn't even call this function yet; it goes straight to the mock. |
| PocketBase logging of reports | Not implemented. `lib/pocketbase.ts` only handles the auth token handoff — no collection writes for bug reports yet. |
| GitHub repo ingestion (fetching real code) | Not implemented. |

This split is intentional and matches what the MVP prompt asked for — it said to mock the AI calls. Flagging it here so it's clear what "done" means at this stage.

## 3. Two things to fix before this leaves MVP status (not urgent, not blocking a demo)

1. **No `netlify.toml` at the repo root.** Functions directory exists (`netlify/functions/`) but there's no build/redirect config, so a Netlify deploy would likely not pick up the function correctly. Needed before first real deploy.
2. **Not a git repo.** `C:\Users\mikew\dev-mjw\ma-qa-bot-mvp` has no `.git` — this is a raw Bolt.new export. Nothing is committed anywhere. Worth doing `git init` + first commit before more work piles up, so there's a rollback point.

## 4. Suggested next build phase (when you're ready to move past MVP)

Roughly in dependency order:

1. `git init`, initial commit, push to a `newM1k3` GitHub repo
2. Add `netlify.toml` (build command, publish dir, functions dir)
3. Wire the frontend's "Run Diagnostics" button to actually POST to `/.netlify/functions/diagnostics` instead of the local mock
4. Implement the real GitHub ingestion step inside the function (fetch repo tree/raw files via GitHub API)
5. Add the Claude/OpenAI call in the function, injecting a persona-specific system prompt per selected agent
6. Log each returned report to PocketBase instead of (or in addition to) rendering client-side only
7. Decide whether to add the other 4 personas from the master doc's roster (Frustrated Gamemaster, Agentic Crawler, Rural Commuter, Vibe-Check Designer) — they're in the roster but weren't part of the MVP prompt's required 4

## 5. Known non-issues (don't chase these, they're expected at MVP stage)

- Help/Settings header buttons do nothing — placeholders, not required by the prompt
- `.env` points at `https://ma-qa-bot.pockethost.io` — existence/provisioning of that PocketBase instance wasn't verified as part of this pass, only that the app doesn't crash without it
- Only 4 of 8 roster personas are implemented — matches the MVP prompt's explicit list, not a bug
