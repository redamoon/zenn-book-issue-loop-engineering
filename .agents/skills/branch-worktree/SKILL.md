---
name: branch-worktree
description: Sub-issueの実装に入る前に使う。mainを最新化し、Issue番号からブランチ名を決め、worktreeを作ってから実装に入る
---

Sub-issueのリンクを受け取ったら、実装コードを書き始める前に、この手順でブランチと
worktreeを用意する。

## 手順

1. **未コミットの変更を確認する**: `git status` を実行し、作業中の変更が残っていれば
   コミットするか `git stash -u` で退避する。
2. **mainを最新化する**:
   ```bash
   git fetch origin
   git switch main
   git pull --ff-only origin main
   ```
3. **ブランチ名をIssue番号から決める**: `<type>/<issue番号>-<slug>` の形にする。
   `type` は `feat`/`fix`/`chore` などIssueの性質に合わせる。`slug` はSub-issueの
   内容を表す短い英語（例: `feat/4-keyword-search`）。
4. **worktreeを作成する**:
   ```bash
   git worktree add ../<リポジトリ名>-worktrees/<ブランチ名> -b <ブランチ名> main
   ```
   依存のあるSub-issue（`depends on` が指す前のSub-issue）に続けて着手する場合は、
   `main` の代わりに依存元のブランチをベースにする。
5. **worktreeのディレクトリへ移動してから実装を始める**: 元のディレクトリの
   ブランチは切り替えない。Sub-issueごとに別ディレクトリで並行して作業できる状態を保つ。
6. **マージ後の後片付け**:
   ```bash
   git worktree remove ../<リポジトリ名>-worktrees/<ブランチ名>
   git branch -d <ブランチ名>
   ```

## なぜworktreeを使うか

worktreeは、1つのリポジトリから複数の作業ディレクトリを同時に用意できるGitの機能。
ブランチを切り替えずに、Sub-issueごとに別のディレクトリで並行して作業できる。
依存のないSub-issueを複数の実装エージェントに並列で任せるときに、同じチェックアウトで
ファイルをぶつけ合わない。

https://git-scm.com/docs/git-worktree

## このリポジトリでの注意

`feat/items-list-api` / `feat/items-list-page` / `feat/items-keyword-search` など、
このSKILLを導入する前に作られた既存ブランチはIssue番号を含んでいない。今後切る
ブランチから、Issue番号を含む命名とworktreeでの並行作業に揃える。
