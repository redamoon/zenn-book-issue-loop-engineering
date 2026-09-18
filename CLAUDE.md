# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Repository Status

This repository (`zenn-book-issue-loop-engineering`) is a minimal Next.js (App Router) + TypeScript project.

- Install dependencies: `npm install`
- Run tests: `npm test` (Vitest)
- Dev server: `npm run dev`
- Build: `npm run build`

### Architecture

- `app/api/items/route.ts` — `GET /api/items` endpoint, returns all items as a JSON array.
- `lib/items/repository.ts` — in-memory data source for items.
- `lib/items/types.ts` — `Item` and response types shared between the API route and its tests.
- `__tests__/api/items.test.ts` — Vitest tests for the items API route.
