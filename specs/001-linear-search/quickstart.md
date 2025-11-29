# クイックスタート: 線形探索 (Linear Search) ページ

**ブランチ (Branch)**: `001-linear-search`  
**作成日 (Date)**: 2025-11-28

## 概要

このドキュメントは、線形探索ページの実装を開始するための手順をまとめたものです。

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
# React 統合（未インストールの場合）
npx astro add react

# Motion One（未インストールの場合）
npm install motion

# アイコン（未インストールの場合）
npm install lucide-react

# KaTeX（未インストールの場合）
npm install katex
npm install -D @types/katex
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

---

## ディレクトリ作成

### 新規作成が必要なディレクトリ

```bash
# コンポーネント
mkdir -p src/components/static
mkdir -p src/components/islands

# ユーティリティ
mkdir -p src/utils/algorithms

# ページ
mkdir -p src/pages/algorithms
```

---

## 実装順序

### Phase 1: 基盤コンポーネント

1. **`src/components/static/Layout.astro`**
   - 共通レイアウト（head, body, グローバルスタイル）
   - 他のすべてのページで使用

2. **`src/styles/global.css`**
   - TailwindCSS のインポート
   - カスタムスタイル（あれば）

### Phase 2: アルゴリズムロジック

3. **`src/utils/algorithms/linearSearch.ts`**
   - `sample/src/utils/algorithms/linearSearch.ts` をコピー
   - 型定義とロジックのみ、UI 依存なし

### Phase 3: Island コンポーネント

4. **`src/components/islands/ArrayVisualizer.tsx`**
   - `sample/src/components/ArrayVisualizer.tsx` をベースに移植
   - motion/react によるアニメーション

5. **`src/components/islands/StepController.tsx`**
   - `sample/src/components/StepController.tsx` をベースに移植
   - 再生/一時停止/次へ/前へ/リセット

6. **`src/components/islands/LinearSearchDemo.tsx`**
   - `sample/src/components/LinearSearchDemo.tsx` をベースに移植
   - 状態管理とコンポーネント統合

### Phase 4: 静的コンポーネント

7. **`src/components/static/AlgorithmStep.astro`**
   - ステップ解説用のコンポーネント
   - Algorithm Flow セクションで使用

8. **`src/components/static/CodeBlock.astro`**
   - Prism.js によるコードハイライト
   - Code セクションで使用

9. **`src/components/static/MathFormula.astro`**
   - KaTeX による数式レンダリング
   - Math セクションで使用

### Phase 5: ページ統合

10. **`src/pages/algorithms/linear-search.astro`**
    - 統一構造に従ったページ
    - Introduction → Visualization → Algorithm Flow → Code → Math → Playground リンク

---

## サンプルからの移植チェックリスト

### コピー＆調整が必要なファイル

| サンプル | 移植先 | 調整内容 |
|---------|--------|----------|
| `sample/src/utils/algorithms/linearSearch.ts` | `src/utils/algorithms/linearSearch.ts` | そのままコピー可 |
| `sample/src/components/ArrayVisualizer.tsx` | `src/components/islands/ArrayVisualizer.tsx` | パスの調整 |
| `sample/src/components/StepController.tsx` | `src/components/islands/StepController.tsx` | パスの調整 |
| `sample/src/components/LinearSearchDemo.tsx` | `src/components/islands/LinearSearchDemo.tsx` | import パスの調整 |

### 移植時の注意点

1. **import パスの更新**
   ```typescript
   // Before (sample)
   import { linearSearch } from '../utils/algorithms/linearSearch';
   
   // After (src)
   import { linearSearch } from '../../utils/algorithms/linearSearch';
   ```

2. **Astro での Island 使用**
   ```astro
   ---
   import LinearSearchDemo from '../components/islands/LinearSearchDemo.tsx';
   ---
   
   <LinearSearchDemo client:load />
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

### `motion/react` が見つからない

```bash
npm install motion
```

### React コンポーネントがハイドレートされない

Astro ページで `client:load` ディレクティブを確認：

```astro
<LinearSearchDemo client:load />
```

### TailwindCSS のスタイルが適用されない

`astro.config.mjs` で Tailwind 統合を確認：

```javascript
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
```

---

## 参考リンク

- [仕様書](./spec.md)
- [技術リサーチ](./research.md)
- [データモデル](./data-model.md)
- [サンプルコード](../../sample/src/)

