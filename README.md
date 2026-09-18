# zenn-book-issue-loop-engineering

Zenn本「[Issue-Driven Loop Engineering](https://zenn.dev/redamoon/books/issue-driven-loop-engineering)」のサンプルリポジトリ。AIエージェント（Claude Code）に
Issue単位で実装を委ねるためのワークフロー（`.agents/` 配下のSKILL群）と、それを検証するための
最小限のNext.jsアプリケーションを同居させている。

## このリポジトリの構成

- **アプリケーション本体**: `GET /api/items` とキーワード検索付きの一覧画面を持つだけの、
  本の題材用に最小化したNext.js (App Router) + TypeScriptプロジェクト。
- **Issue Loopワークフロー**: `.agents/skills/` 配下に、親IssueをAI Readyにする判定・
  Sub-issueへの分割・ブランチ/worktree運用・敵対的検証・コードレビューをSKILLとして定義。
  本の各章がこのSKILL群と対応する。

## セットアップ

```bash
npm install
npm run dev    # http://localhost:3000
npm test       # Vitest
npm run build
```

## アプリケーションのアーキテクチャ

- `app/api/items/route.ts` — `GET /api/items` エンドポイント。`keyword` クエリで絞り込み。
- `app/items/page.tsx` / `app/items/_components/` — 一覧画面とキーワード検索ボックス。
- `lib/items/repository.ts` — インメモリのアイテムデータソース。
- `lib/items/types.ts` — APIとフロントエンドが共有する `Item` 型・レスポンス型。
- `__tests__/` — API・画面のVitestテスト。

## Issue Loop Engineeringワークフロー

`.agents/skills/` にある各SKILLは、Sub-issueを実装エージェントに渡す前後の手順を定義する。

| SKILL | 役割 |
|---|---|
| `ai-ready-check` | 親IssueがAI Readyか（完了条件の明文化・自動検証の有無・触ってよい範囲）を判定する |
| `child-issue-template` | Sub-issue本文のテンプレート（範囲/やらないこと/触ってよいファイル/完了条件/depends on） |
| `branch-worktree` | Issue番号からブランチ名を決め、worktreeを作ってから実装に入る手順 |
| `adversarial-checker` | 実装前にSub-issueの指示文を、独立したセッションで敵対的に検証する |
| `code-review` | このリポジトリ固有の契約（型の整合性、fetch失敗と0件の混同など）をレビューする |

`.agents/skills/child-issue-template/pitfalls.md` には、実際にSub-issue1〜3
（`GET /api/items` → 一覧画面 → キーワード検索）を切った際に見つかった手戻りの記録があり、
次にSub-issueを書くときの材料として蓄積している。

## ブランチ運用

このリポジトリはZenn本のサンプル用であり、mainへの直接コミットを許容している。
