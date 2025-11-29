# アーキテクチャガイド

このドキュメントは、アルゴリズム可視化サイトのアーキテクチャと新規アルゴリズム追加手順をまとめたものです。

---

## 1. 技術スタック

| 項目 | 技術 | 用途 |
|------|------|------|
| **フレームワーク** | Astro | SSG、ページ生成 |
| **インタラクティブ UI** | Preact | 可視化コンポーネント（Astro Islands） |
| **スタイリング** | TailwindCSS | ユーティリティ CSS |
| **アニメーション** | CSS Transitions + Web Animations API | 要素のアニメーション |
| **数式** | KaTeX | 数式レンダリング |

### なぜ Preact を採用したか

- **軽量**: React の 1/10 のサイズ（~3KB gzip）
- **React 互換**: hooks、JSX がそのまま使える
- **Astro 公式サポート**: `@astrojs/preact` で簡単に統合
- **30+ アルゴリズムへのスケーラビリティ**: 共通コンポーネントの再利用が容易

---

## 2. ディレクトリ構造

```
src/
├── types/
│   └── algorithm.ts           # 共通型定義（AlgorithmDefinition など）
│
├── algorithms/
│   ├── index.ts               # アルゴリズム登録・エクスポート
│   ├── linear-search.ts       # 線形探索の定義
│   ├── binary-search.ts       # 二分探索の定義（例）
│   └── ...
│
├── hooks/
│   └── useStepController.ts   # ステップ制御の共通 Hook
│
├── components/
│   ├── Layout.astro           # 共通レイアウト
│   ├── visualizer/            # 可視化コンポーネント（Preact）
│   │   ├── index.ts
│   │   ├── ArrayVisualizer.tsx
│   │   ├── ArrayBox.tsx
│   │   ├── StepController.tsx
│   │   ├── LinearSearchVisualizer.tsx
│   │   └── [Algorithm]Visualizer.tsx  # アルゴリズム専用
│   └── icons/                 # SVG アイコン（Astro）
│
├── pages/
│   ├── index.astro            # ホーム
│   └── algorithms/
│       ├── linear-search.astro
│       └── [algorithm-name].astro
│
└── styles/
    └── global.css             # TailwindCSS + カスタムアニメーション
```

---

## 3. 核となる型定義

### `AlgorithmDefinition<TData>`

```typescript
// src/types/algorithm.ts

export interface AlgorithmDefinition<TData = unknown> {
  id: string;                           // URL スラッグ
  name: string;                         // 表示名
  category: AlgorithmCategory;          // search, sort, graph, tree, other
  visualizer: VisualizerType;           // array, graph, tree, grid
  description: string;                  // 1行の説明
  initialData: TData;                   // 初期データ
  generateSteps: (data: TData) => Step[];  // ステップ生成関数
  complexity: Complexity;               // 計算量
  code: string;                         // TypeScript コード例
  useCases: string[];                   // 使用シーン
}

export interface Step {
  highlights: number[];                 // ハイライト要素
  statuses: Map<number, ElementStatus>; // 各要素の状態
  description: string;                  // ステップ説明
  found?: boolean;                      // 発見フラグ
}

export type ElementStatus = 
  | "default" 
  | "checking" 
  | "checked" 
  | "found" 
  | "comparing" 
  | "swapping" 
  | "sorted";
```

---

## 4. 共通 Hook: `useStepController`

ステップ制御のロジックを共通化した Hook。

```typescript
// src/hooks/useStepController.ts

import { useState, useCallback, useRef, useEffect } from "preact/hooks";

export function useStepController<TData>(
  algorithm: AlgorithmDefinition<TData>,
  initialData?: TData
): UseStepControllerReturn {
  // 状態
  const [steps, setSteps] = useState<Step[]>(() => 
    algorithm.generateSteps(initialData ?? algorithm.initialData)
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 操作
  const next = useCallback(() => { ... }, []);
  const prev = useCallback(() => { ... }, []);
  const reset = useCallback(() => { ... }, []);
  const togglePlay = useCallback(() => { ... }, []);
  const updateData = useCallback(<T>(newData: T) => { ... }, []);
  
  return { currentStep, steps, isPlaying, next, prev, reset, togglePlay, updateData };
}
```

---

## 5. 新規アルゴリズム追加手順

### Step 1: アルゴリズム定義を作成

```typescript
// src/algorithms/binary-search.ts

import type { AlgorithmDefinition, ArrayAlgorithmData, Step } from "../types/algorithm";

export const binarySearch: AlgorithmDefinition<ArrayAlgorithmData> = {
  id: "binary-search",
  name: "二分探索 (Binary Search)",
  category: "search",
  visualizer: "array",
  description: "ソート済み配列を半分ずつ絞り込む効率的な探索",
  
  initialData: {
    array: [1, 3, 5, 7, 9, 11, 13, 15, 17],
    target: 7,
  },
  
  generateSteps: (data: ArrayAlgorithmData): Step[] => {
    const { array, target } = data;
    const steps: Step[] = [];
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const statuses = new Map();
      
      // ... ステップ生成ロジック
      
      steps.push({
        highlights: [mid],
        statuses,
        description: `中央値 ${array[mid]} をチェック`,
        found: array[mid] === target,
      });
      
      if (array[mid] === target) break;
      if (array[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    
    return steps;
  },
  
  complexity: {
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
  },
  
  code: `function binarySearch(array: number[], target: number): number {
  let left = 0, right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid] === target) return mid;
    if (array[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  
  useCases: ["ソート済み配列の探索", "大量データの検索"],
};
```

### Step 2: アルゴリズムを登録

```typescript
// src/algorithms/index.ts

import { binarySearch } from "./binary-search";

export const algorithms: AlgorithmRegistry = {
  "linear-search": linearSearch,
  "binary-search": binarySearch,  // 追加
};
```

### Step 3: 専用 Visualizer を作成

```typescript
// src/components/visualizer/BinarySearchVisualizer.tsx

import { useState, useCallback } from "preact/hooks";
import { binarySearch } from "../../algorithms/binary-search";
import { useStepController } from "../../hooks/useStepController";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { StepController } from "./StepController";

export function BinarySearchVisualizer() {
  const [data, setData] = useState(binarySearch.initialData);
  const controller = useStepController(binarySearch, data);
  
  // ... ランダム配列生成など
  
  return (
    <div class="space-y-8">
      <ArrayVisualizer 
        array={data.array} 
        target={data.target}
        currentStep={...}
        onRandomize={...}
      />
      <StepController {...controller} />
    </div>
  );
}
```

### Step 4: index.ts にエクスポート追加

```typescript
// src/components/visualizer/index.ts

export { BinarySearchVisualizer } from "./BinarySearchVisualizer";
```

### Step 5: Astro ページを作成

```astro
---
// src/pages/algorithms/binary-search.astro
import Layout from "../../components/Layout.astro";
import { BinarySearchVisualizer } from "../../components/visualizer";

const title = "二分探索 (Binary Search)";
---

<Layout title={title}>
  <section id="visualization" class="mb-12">
    <h2>ステップバイステップで理解する</h2>
    <BinarySearchVisualizer client:load />
  </section>
  
  <!-- Algorithm Flow, Code, Math セクション -->
</Layout>
```

---

## 6. Astro Islands の注意点

### 関数は渡せない

Astro から Preact コンポーネントに**関数を含むオブジェクトは渡せない**。

```astro
<!-- ❌ NG: generateSteps 関数が含まれるため動作しない -->
<AlgorithmVisualizer client:load algorithm={algorithm} />

<!-- ✅ OK: Preact 内で直接インポート -->
<LinearSearchVisualizer client:load />
```

### 解決策

各アルゴリズムに専用の Visualizer を作成し、その中でアルゴリズム定義をインポートする。

```typescript
// LinearSearchVisualizer.tsx
import { linearSearch } from "../../algorithms/linear-search";

export function LinearSearchVisualizer() {
  const controller = useStepController(linearSearch);
  // ...
}
```

---

## 7. アニメーション実装

### CSS トランジション（推奨）

```tsx
<div
  class="transition-all duration-300"
  style={{ transform: `scale(${status === "checking" ? 1.1 : 1})` }}
>
```

### Web Animations API（バウンス効果など）

```typescript
useEffect(() => {
  if (status === "checking") {
    boxRef.current?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.2)" },
        { transform: "scale(1.1)" },
      ],
      { duration: 300, easing: "ease-out" }
    );
  }
}, [status]);
```

---

## 8. 更新履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2025-11-29 | 1.0.0 | 初版作成（Preact 移行後） |

