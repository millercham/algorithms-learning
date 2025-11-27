<!--
Sync Impact Report / 同期影響レポート:
Version change: 1.0.0 → 1.0.1 (英語ベースの文書を日本語に翻訳するパッチ更新)
Principles:
  - 原則の内容は変更せず、日本語表現に統一
Templates:
  - .specify/templates/plan-template.md（全体を日本語化）
  - .specify/templates/spec-template.md（全体を日本語化）
  - .specify/templates/tasks-template.md（全体を日本語化）
  - .specify/templates/agent-file-template.md（全体を日本語化）
  - .specify/templates/checklist-template.md（全体を日本語化）
Follow-up TODOs: なし
-->

# プロジェクト憲法

**プロジェクト名:** Astro アルゴリズム可視化サイト

**憲法バージョン (Constitution Version):** 1.0.1

**制定日 (Ratification Date):** 2024-12-19

**最終改訂日 (Last Amended Date):** 2025-11-27

---

## 前文

この憲法は「Astro アルゴリズム可視化サイト」プロジェクトにおける
開発の基本原則とガバナンスルールを定めるものである。
すべての開発上の意思決定は、本憲法の原則に **必ず (MUST)** 従わなければならない。
憲法の改訂は、必ずバージョン管理と影響範囲の明示的な評価を伴う。

---

## コア原則

### 原則1: アルゴリズム優先 (Algorithm-First Design)

**必須 (MUST):**  
すべてのページで **アルゴリズムを主役** とすること。  
数学的な説明はあくまで補足として扱い、`<details>` による折り畳みセクション内に配置する。

**理由 (Rationale):**  
本プロジェクトの対象は、数式よりも「動き」からアルゴリズムを理解する学習者である。  
数学的厳密さよりも、視覚的な理解が優先される。

**運用ルール (Enforcement):**  
すべてのアルゴリズムページは、次の統一構造に **必ず (MUST)** 従うこと。  
Introduction → Visualization → Algorithm Flow → Code → Math (折り畳み) → Playground へのリンク

---

### 原則2: TypeScript のみのコードベース (TypeScript-Only Codebase)

**必須 (MUST):**  
コード例および実装は **すべて TypeScript** で記述すること。  
他言語による実装やコード例を、ドキュメントや画面上に掲載してはならない。

**理由 (Rationale):**  
TypeScript は Astro と相性が良く、型安全性を保ちつつ学習コストも低い。  
複数言語の併記は認知負荷を上げ、プロジェクトの「シンプルさ」という目標に反する。

**運用ルール (Enforcement):**  
コードセクションには TypeScript の実装のみを掲載し、  
行数は 10〜20 行程度、コメントは最小限に抑える。

---

### 原則3: 依存関係の最小化 (Minimal Dependencies)

**必須 (MUST):**  
外部ライブラリの導入は、機能実現に本当に必要な最小限に留めること。  
React の利用は、インタラクティブな TSX コンポーネントが本当に必要な箇所に、
小さく限定して用いる場合にのみ許可される。

**理由 (Rationale):**  
Astro の強みは、JavaScript のフットプリントが小さいことにある。  
過度な React 利用は Astro の性能メリットを打ち消し、バンドルサイズを不必要に増大させる。

**運用ルール (Enforcement):**
- デフォルトは Astro コンポーネント（`.astro`）を使用する  
- インタラクティブな可視化（例: Playground）のみ TSX コンポーネントを使用する  
- グローバルな状態管理ライブラリは禁止  
- 状態はコンポーネント内のローカル状態に限定する

---

### 原則4: 視覚的学習へのフォーカス (Visual Learning Focus)

**必須 (MUST):**  
すべてのアルゴリズムには、Motion One を用いたインタラクティブな可視化を用意する。  
配列要素のハイライトや、「探索中 / 確定」状態の色分けなど、
アルゴリズムの進行が視覚的に明確に追えるようにする。

**理由 (Rationale):**  
対象ユーザーは、静的なコードや疑似コードだけでは理解が難しく、
視覚的な動きによって理解が促進されるタイプであるため。

**運用ルール (Enforcement):**  
Visualization セクションでは Motion One の Web Animations API を用い、  
アニメーションはステップ制御可能とし、Algorithm Flow の各ステップと同期させる。

---

### 原則5: ページ構造の統一 (Unified Page Structure)

**必須 (MUST):**  
すべてのアルゴリズムページ（`algorithms/*.astro`）は、  
同一の構成とコンポーネント利用パターンに従わなければならない。

**理由 (Rationale):**  
ページ構造の一貫性は、学習者の認知負荷を減らし、保守性も高める。  
ページごとにバラバラの構成を取ると、混乱と技術的負債を生む。

**運用ルール (Enforcement):**  
各アルゴリズムページは、次の順序ですべてのセクションを含むこと:
1. Introduction（1 画面で概要が分かる導入）
2. Visualization（Motion One によるアニメーション）
3. Algorithm Flow（`AlgorithmStep` コンポーネントを用いたステップ解説）
4. Code（TypeScript / 10〜20 行）
5. Math（`<details>` で折り畳まれた数学的補足）
6. Playground へのリンク

---

### 原則6: 軽量な技術スタック (Lightweight Technology Stack)

**必須 (MUST):**  
以下の承認済み技術スタックのみを使用すること:
- Astro（コア）
- TailwindCSS + Headless UI（UI）
- Motion One（アニメーション）
- KaTeX（数式表示）
- Prism.js（コードハイライト）

**理由 (Rationale):**  
これらの技術は、軽量性・Astro との相性・必要十分な機能性を基準に選定されている。  
無断でライブラリを追加すると、複雑さと保守コストが増大する。

**運用ルール (Enforcement):**  
新たな依存ライブラリを導入する場合は、  
この原則の改訂を伴う明示的な理由付けが **必須 (MUST)**。  
まず Astro ネイティブな手段で解決できないかを検討してから追加を検討する。

---

### 原則7: Playground の独立性 (Playground Independence)

**必須 (MUST):**  
Playground ページは、それぞれが独立したディレクトリ配下に存在し、  
TypeScript / TSX のみで完結させなければならない。  
グローバル状態や共有 React コンテキストに依存してはならない。

**理由 (Rationale):**  
Playground は「実際に触って学ぶ」ためのインタラクティブな学習ツールであり、  
ページ単位で独立して読み込めることが重要である。  
独立性を保つことで、機能追加や改善を段階的に行いやすくなる。

**運用ルール (Enforcement):**  
各 Playground は `src/pages/playground/{name}/` に配置し、  
その中に必要なコンポーネントとスタイルを完結させる。  
Playground 同士で直接依存関係を持たないこと。

---

## ガバナンス (Governance)

### 改訂手続き (Amendment Procedure)

1. **提案 (Proposal):**  
   変更内容・理由・影響範囲を文書化する。  
2. **バージョン種別の決定 (Version Decision):**
   - **MAJOR:** 互換性のない原則変更・削除
   - **MINOR:** 新しい原則の追加、または大きな拡張
   - **PATCH:** 意味を変えない範囲での表現改善・誤字修正・軽微な明確化
3. **憲法の更新 (Update Constitution):**  
   プレースホルダの置き換え、バージョンと日付の更新を行う。
4. **テンプレートの同期 (Sync Templates):**  
   依存するテンプレート（`plan-template.md`、`spec-template.md`、  
   `tasks-template.md`、コマンドファイル など）を更新する。
5. **影響レポートの作成 (Impact Report):**  
   本ファイル先頭の HTML コメントに、同期影響レポートを追記・更新する。
6. **コミット (Commit):**  
   次の形式のセマンティックコミットメッセージを用いる:  
   `docs: amend constitution to vX.Y.Z (short description)`

### バージョン管理ポリシー (Versioning Policy)

- セマンティックバージョニング（MAJOR.MINOR.PATCH）に従う  
- 内容を変更した場合、`Last Amended Date` を更新する  
- `Ratification Date` は原則として最初の制定日を維持する

### コンプライアンスレビュー (Compliance Review)

- 大きな機能追加の前に、すべての原則との整合性を確認する  
- コードレビューでは、本憲法の原則への準拠をチェックする  
- ドキュメント更新時は、最新の原則内容と矛盾がないか確認する

---

## 備考 (Notes)

- 本憲法は「生きた文書」であり、定期的に見直しを行うことを前提とする。  
- 原則同士が競合する場合は、**原則1 (Algorithm-First Design)** を最優先とする。  
- 原則の解釈に疑義が生じた場合は、改訂提案プロセスを通じて明文化する。
