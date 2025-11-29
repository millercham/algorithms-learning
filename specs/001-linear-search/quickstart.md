# クイックスタート: 線形探索 (Linear Search) ページ

**ブランチ (Branch)**: `001-linear-search`  
**作成日 (Date)**: 2025-11-28

## 概要

このドキュメントは、線形探索ページの実装を開始するための手順をまとめたものです。**React は使用せず**、純粋な Astro コンポーネントと vanilla TypeScript で実装します。

---

## 前提条件

### 必要なツール

- Node.js 18+
- npm または pnpm
- Git

### リポジトリの状態

```bash
# ブランチを確認
git branch
# * 001-linear-search  ← このブランチにいること
```

---

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 追加パッケージのインストール（必要に応じて）

```bash
# Motion One（未インストールの場合）
npm install motion

# KaTeX（未インストールの場合）
npm install katex
npm install -D @types/katex
```

> **注意**: React は使用しないため、`@astrojs/react` や `lucide-react` は不要です。

### 3. 開発サーバーの起動

```bash
npm run dev
```

---

## ディレクトリ作成

### 新規作成が必要なディレクトリ

```bash
# コンポーネント
mkdir -p src/components

# ユーティリティ
mkdir -p src/utils/algorithms

# クライアントサイドスクリプト
mkdir -p src/scripts

# ページ
mkdir -p src/pages/algorithms
```

---

## 実装順序

### Phase 1: 基盤コンポーネント

1. **`src/components/Layout.astro`**
   - 共通レイアウト（head, body, グローバルスタイル）
   - 他のすべてのページで使用

2. **`src/styles/global.css`**
   - TailwindCSS のインポート
   - カスタムスタイル（あれば）

### Phase 2: アルゴリズムロジック

3. **`src/utils/algorithms/linearSearch.ts`**
   - `SearchStep` インターフェース
   - `linearSearch()` 関数
   - `generateRandomArray()` 関数

```typescript
// src/utils/algorithms/linearSearch.ts
export interface SearchStep {
  index: number;
  current: number;
  found: boolean;
}

export function linearSearch(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  for (let i = 0; i < array.length; i++) {
    steps.push({ index: i, current: array[i], found: array[i] === target });
    if (array[i] === target) break;
  }
  return steps;
}

export function generateRandomArray(length: number, max = 100): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
}
```

### Phase 3: Astro コンポーネント

4. **`src/components/ArrayVisualizer.astro`**
   - 配列要素のボックスを描画
   - `data-index` 属性で JavaScript からアクセス可能に

```astro
---
interface Props {
  array: number[];
}
const { array } = Astro.props;
---

<div class="array-container flex flex-wrap gap-4 justify-center">
  {array.map((value, index) => (
    <div 
      class="array-box w-20 h-20 flex flex-col items-center justify-center rounded-xl border-2 border-neutral-300 bg-neutral-100"
      data-index={index}
      data-value={value}
    >
      <span class="value text-2xl text-neutral-600">{value}</span>
      <span class="index text-xs text-neutral-400">{index}</span>
    </div>
  ))}
</div>
```

5. **`src/components/StepController.astro`**
   - 再生/一時停止/次へ/前へ/リセットボタン
   - プログレスバー

6. **`src/components/AlgorithmStep.astro`**
   - ステップ解説用のコンポーネント
   - Algorithm Flow セクションで使用

7. **`src/components/CodeBlock.astro`**
   - Prism.js によるコードハイライト

8. **`src/components/MathFormula.astro`**
   - KaTeX による数式レンダリング

### Phase 4: クライアントサイドスクリプト

9. **`src/scripts/linear-search-controller.ts`**
   - 状態管理
   - イベントハンドラ
   - Motion One アニメーション

```typescript
// src/scripts/linear-search-controller.ts
import { animate } from 'motion';
import { linearSearch, generateRandomArray, type SearchStep } from '../utils/algorithms/linearSearch';

// 状態
let state = {
  array: [23, 45, 12, 78, 34, 56, 89, 23, 67],
  target: 34,
  steps: [] as SearchStep[],
  currentStep: 0,
  isPlaying: false,
  foundIndex: undefined as number | undefined,
};

// 初期化
export function init() {
  runSearch();
  bindEvents();
}

function runSearch() {
  state.steps = linearSearch(state.array, state.target);
  const found = state.steps.find(s => s.found);
  state.foundIndex = found?.index;
  state.currentStep = 0;
  state.isPlaying = false;
  updateUI();
}

function bindEvents() {
  document.getElementById('btn-next')?.addEventListener('click', handleNext);
  document.getElementById('btn-prev')?.addEventListener('click', handlePrev);
  document.getElementById('btn-reset')?.addEventListener('click', handleReset);
  document.getElementById('btn-play')?.addEventListener('click', handlePlayPause);
  document.getElementById('btn-randomize')?.addEventListener('click', handleRandomize);
}

async function handleNext() {
  if (state.currentStep < state.steps.length) {
    state.currentStep++;
    await animateStep();
    updateUI();
  }
}

// ... 他のハンドラ

async function animateStep() {
  const step = state.steps[state.currentStep - 1];
  const el = document.querySelector(`[data-index="${step.index}"]`);
  if (!el) return;
  
  await animate(el, {
    scale: 1.15,
    backgroundColor: step.found ? '#22c55e' : '#facc15',
  }, { duration: 0.4 }).finished;
}

function updateUI() {
  // DOM を更新
}
```

### Phase 5: ページ統合

10. **`src/pages/algorithms/linear-search.astro`**
    - 統一構造に従ったページ
    - クライアントサイドスクリプトを読み込み

```astro
---
import Layout from '../../components/Layout.astro';
import ArrayVisualizer from '../../components/ArrayVisualizer.astro';
import StepController from '../../components/StepController.astro';
import CodeBlock from '../../components/CodeBlock.astro';
import MathFormula from '../../components/MathFormula.astro';

const initialArray = [23, 45, 12, 78, 34, 56, 89, 23, 67];
const initialTarget = 34;
---

<Layout title="線形探索 | アルゴリズム可視化">
  <main class="container mx-auto px-4 py-8">
    <!-- Introduction -->
    <section id="introduction">
      <h1>線形探索 (Linear Search)</h1>
      <p>配列の先頭から順番に目標値を探すシンプルなアルゴリズム</p>
    </section>

    <!-- Visualization -->
    <section id="visualization">
      <div id="target-display">目標値: <span id="target-value">{initialTarget}</span></div>
      <ArrayVisualizer array={initialArray} />
      <StepController />
    </section>

    <!-- Algorithm Flow -->
    <section id="algorithm-flow">
      <!-- AlgorithmStep コンポーネント -->
    </section>

    <!-- Code -->
    <section id="code">
      <CodeBlock code={`function linearSearch(...)`} lang="typescript" />
    </section>

    <!-- Math -->
    <section id="math">
      <details>
        <summary>数学的補足</summary>
        <p>時間計算量: <MathFormula formula="O(n)" /></p>
      </details>
    </section>

    <!-- Playground Link -->
    <section id="playground-link">
      <a href="/playground/linear-search">Playground で試す</a>
    </section>
  </main>

  <script>
    import { init } from '../../scripts/linear-search-controller';
    init();
  </script>
</Layout>
```

---

## 動作確認チェックリスト

### 基本機能

- [ ] ページが `/algorithms/linear-search` で表示される
- [ ] 配列要素がボックスとして表示される
- [ ] 目標値が表示される

### ステップ制御

- [ ] 「次へ」ボタンで1ステップ進む
- [ ] 「前へ」ボタンで1ステップ戻る
- [ ] 「再生」ボタンで自動再生が始まる
- [ ] 「一時停止」ボタンで自動再生が止まる
- [ ] 「リセット」ボタンで初期状態に戻る

### アニメーション

- [ ] 現在チェック中の要素が黄色でハイライトされる
- [ ] 探索済みの要素がグレーアウトする
- [ ] 発見時に緑色で強調表示される
- [ ] 要素の拡大アニメーションが動作する

### その他

- [ ] 「新しい配列を生成」でランダムな配列が生成される
- [ ] 進捗バーが正しく表示される
- [ ] 探索結果メッセージが表示される

---

## トラブルシューティング

### Motion One が見つからない

```bash
npm install motion
```

### スクリプトが実行されない

Astro ページで `<script>` タグを確認：

```astro
<script>
  import { init } from '../../scripts/linear-search-controller';
  init();
</script>
```

### TailwindCSS のスタイルが適用されない

`astro.config.mjs` で Tailwind 統合を確認：

```javascript
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
```

### アニメーションが動かない

Motion One の import を確認：

```typescript
// 正しい
import { animate } from 'motion';

// 間違い（React 用）
import { motion } from 'motion/react';  // ← 使用しない
```

---

## 参考リンク

- [仕様書](./spec.md)
- [技術リサーチ](./research.md)
- [データモデル](./data-model.md)
- [Astro Client-side Scripts](https://docs.astro.build/en/guides/client-side-scripts/)
- [Motion One Animate](https://motion.dev/docs/animate)
