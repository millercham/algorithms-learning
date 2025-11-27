# 実装計画: [FEATURE]

**ブランチ (Branch)**: `[###-feature-name]` | **日付 (Date)**: [DATE] | **仕様 (Spec)**: [link]  
**入力 (Input)**: `/specs/[###-feature-name]/spec.md` にある機能仕様

**メモ**: このテンプレートは `/speckit.plan` コマンドによって自動生成される。  
実行フローは `.specify/templates/commands/plan.md` を参照すること。

## サマリ (Summary)

[spec.md から主要要件と、リサーチ結果に基づく技術的アプローチを要約して記述する]

## 技術コンテキスト (Technical Context)

<!--
  要対応: このセクションはプロジェクト固有の技術情報で埋めること。
  ここに示されている構造は、検討プロセスをガイドするための雛形である。
-->

**言語 / バージョン (Language/Version)**: TypeScript (ES2020+)  
**主要依存 (Primary Dependencies)**: Astro (core), TailwindCSS, Headless UI, Motion One, KaTeX, Prism.js  
**ストレージ (Storage)**: N/A（静的サイト生成）  
**テスト (Testing)**: [例: Vitest, Playwright / 要確認]  
**ターゲットプラットフォーム (Target Platform)**: Web（SSG, Vercel ホスティング）
**プロジェクト種別 (Project Type)**: Web（Astro SSG）  
**性能目標 (Performance Goals)**: JS バンドル最小化、高速なページロード、60fps の滑らかなアニメーション  
**制約 (Constraints)**: React 利用は最小限 / コード例は TypeScript のみ / ページ構造は統一  
**スケール / スコープ (Scale/Scope)**: 可視化と Playground を備えた複数のアルゴリズムページ

## 憲法チェック (Constitution Check)

*ゲート条件: Phase 0 リサーチ開始前に必ず満たすこと。Phase 1 設計後にも再確認すること。*

プロジェクト憲法の原則との整合性を確認する:

- [ ] **Algorithm-First Design**: アルゴリズムが主役であり、数学は補足かつ折り畳みになっているか
- [ ] **TypeScript-Only**: すべてのコード例が TypeScript のみで書かれており、他言語が混在していないか
- [ ] **Minimal Dependencies**: React 利用が必要最小限の TSX コンポーネントに限定されているか
- [ ] **Visual Learning**: Motion One を用いたインタラクティブな可視化が用意されているか
- [ ] **Unified Structure**: アルゴリズムページが統一構造（Introduction → Visualization → Flow → Code → Math → Playground）に従っているか
- [ ] **Lightweight Stack**: Astro, TailwindCSS, Headless UI, Motion One, KaTeX, Prism.js 以外の不要なライブラリを増やしていないか
- [ ] **Playground Independence**: Playground ページが各ディレクトリ内で自立しており、グローバル状態に依存していないか

**違反事項 (Violations)**:  
違反がある場合は、下記「Complexity Tracking」セクションで理由と代替案の検討結果を必ず明示すること。

## プロジェクト構造 (Project Structure)

### ドキュメント構成（本機能）

```text
specs/[###-feature]/
├── plan.md              # このファイル (/speckit.plan の出力)
├── research.md          # Phase 0 出力 (/speckit.plan)
├── data-model.md        # Phase 1 出力 (/speckit.plan)
├── quickstart.md        # Phase 1 出力 (/speckit.plan)
├── contracts/           # Phase 1 出力 (/speckit.plan)
└── tasks.md             # Phase 2 出力 (/speckit.tasks の出力 / plan では生成しない)
```

### ソースコード構成（リポジトリルート）

<!--
  要対応: 下記のツリープレースホルダを、この機能に合わせた具体的な構造に置き換えること。
  不要な選択肢は削除し、実際のパス（例: src/pages/algorithms/linear-search.astro など）を記載する。
-->

```text
src/
  pages/
    algorithms/              # アルゴリズムページ（統一構造）
    concepts/                # 数学の補足ページ（Markdown）
    playground/              # インタラクティブな Playground ページ

  components/
    static/                  # Astro 専用（静的レイヤ）
      Layout.astro
      AlgorithmStep.astro
      MathFormula.astro
    islands/                 # 動く部分だけ TSX（Island レイヤ）
      ArrayVisualizer.tsx
      AnimatedBox.tsx
      StepController.tsx
      FactorTree.tsx

  utils/
    math/                    # アルゴリズム本体（純 TS）
      prime.ts
      divisor.ts
      sieve.ts
    ui/                      # UI 補助ロジック
      animateBox.ts
      colorScheme.ts

  styles/
    global.css

public/                      # 静的アセット
```

**構造の決定 (Structure Decision)**:  
[上記ツリーに対応する実際のディレクトリとファイルをここに文章で説明する]

## 複雑さトラッキング (Complexity Tracking)

> **注意**: 憲法チェックに違反がある場合のみ、この表を埋めること。

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| [例: 4つ目のプロジェクト追加] | [なぜ必要か] | [なぜ 3 つでは足りないか] |
| [例: リポジトリパターン導入] | [特定の問題] | [なぜ素朴な DB アクセスでは不十分か] |
