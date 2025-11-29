# デザインガイドライン

このドキュメントは、アルゴリズム可視化サイトのデザインルールをまとめたものです。

---

## 1. カラーパレット

### プライマリカラー

| 用途 | カラー | Tailwind クラス | Hex |
|------|--------|----------------|-----|
| メインアクセント | Blue 600 | `bg-blue-600`, `text-blue-600` | `#3b82f6` |
| ホバー | Blue 700 | `hover:bg-blue-700` | `#1d4ed8` |
| 薄い背景 | Blue 50 | `bg-blue-50` | `#eff6ff` |
| ボーダー | Blue 200 | `border-blue-200` | `#bfdbfe` |

### ステータスカラー

| 状態 | カラー | Tailwind クラス | Hex |
|------|--------|----------------|-----|
| 成功 / 発見 | Green 500 | `bg-green-500` | `#22c55e` |
| 警告 / チェック中 | Yellow 400 | `bg-yellow-400` | `#facc15` |
| エラー | Red 500 | `bg-red-500` | `#ef4444` |

### ニュートラルカラー

| 用途 | カラー | Tailwind クラス | Hex |
|------|--------|----------------|-----|
| テキスト（濃） | Neutral 800 | `text-neutral-800` | `#262626` |
| テキスト（中） | Neutral 600 | `text-neutral-600` | `#525252` |
| テキスト（薄） | Neutral 500 | `text-neutral-500` | `#737373` |
| 背景（薄） | Neutral 50 | `bg-neutral-50` | `#fafafa` |
| ボーダー | Neutral 200 | `border-neutral-200` | `#e5e5e5` |

### 可視化専用カラー

```typescript
// 配列要素の状態カラー
const visualizationColors = {
  default: {
    background: '#f5f5f5',  // neutral-100
    border: '#d4d4d4',      // neutral-300
    text: '#525252',        // neutral-600
  },
  checking: {
    background: '#facc15',  // yellow-400
    border: '#eab308',      // yellow-500
    text: '#262626',        // neutral-800
  },
  checked: {
    background: '#e5e5e5',  // neutral-200
    border: '#d4d4d4',      // neutral-300
    text: '#737373',        // neutral-500
  },
  found: {
    background: '#22c55e',  // green-500
    border: '#16a34a',      // green-600
    text: '#ffffff',        // white
  },
};
```

---

## 2. タイポグラフィ

### フォントファミリー

- **本文**: システムフォント（Tailwind デフォルト）
- **コード**: `font-mono`（等幅フォント）

### テキストサイズ

| 用途 | サイズ | Tailwind クラス |
|------|--------|----------------|
| ページタイトル | 2.25rem (36px) | `text-4xl` |
| セクション見出し | 1.5rem (24px) | `text-2xl` |
| サブ見出し | 1.25rem (20px) | `text-xl` |
| 本文 | 1rem (16px) | `text-base` |
| 小テキスト | 0.875rem (14px) | `text-sm` |
| 極小テキスト | 0.75rem (12px) | `text-xs` |

### テキストスタイル

```html
<!-- ページタイトル -->
<h1 class="text-4xl font-bold text-neutral-800">タイトル</h1>

<!-- セクション見出し -->
<h2 class="text-2xl font-bold text-neutral-800">見出し</h2>

<!-- 本文 -->
<p class="text-neutral-600">本文テキスト</p>

<!-- 強調テキスト -->
<strong class="font-semibold">強調</strong>

<!-- コード -->
<code class="font-mono bg-neutral-100 px-2 py-0.5 rounded">code</code>
```

---

## 3. スペーシング

### 基本ルール

- **セクション間**: `mb-12`（3rem / 48px）
- **要素間（大）**: `gap-6` / `mb-6`（1.5rem / 24px）
- **要素間（中）**: `gap-4` / `mb-4`（1rem / 16px）
- **要素間（小）**: `gap-2` / `mb-2`（0.5rem / 8px）

### パディング

| 用途 | サイズ | Tailwind クラス |
|------|--------|----------------|
| カード内側 | 1.5rem | `p-6` |
| ボタン | 0.75rem 1.5rem | `px-6 py-3` |
| 小ボタン | 0.5rem 1rem | `px-4 py-2` |
| インラインバッジ | 0.25rem 0.5rem | `px-2 py-1` |

### コンテナ

```html
<!-- メインコンテナ -->
<div class="container mx-auto px-4 max-w-5xl">
  <!-- コンテンツ -->
</div>
```

---

## 4. コンポーネントスタイル

### ボタン

```html
<!-- プライマリボタン -->
<button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
  ボタン
</button>

<!-- セカンダリボタン -->
<button class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
  ボタン
</button>

<!-- 無効化状態 -->
<button disabled class="... disabled:opacity-50 disabled:cursor-not-allowed">
  ボタン
</button>
```

### カード

```html
<!-- 基本カード -->
<div class="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
  <!-- コンテンツ -->
</div>

<!-- 強調カード（グラデーション） -->
<div class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
  <!-- コンテンツ -->
</div>
```

### 配列ボックス（可視化用）

```html
<div class="array-box w-20 h-20 flex items-center justify-center rounded-xl border-2 border-neutral-300 bg-neutral-100 text-neutral-600 shadow-md transition-all duration-300">
  <span class="text-2xl">42</span>
</div>
```

### インフォボックス

```html
<!-- 情報 -->
<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
  <h2 class="text-lg font-semibold text-blue-800 mb-3">タイトル</h2>
  <p class="text-blue-700">内容</p>
</div>

<!-- 成功 -->
<div class="bg-green-50 border border-green-300 rounded-lg p-6">
  <p class="text-green-800">成功メッセージ</p>
</div>

<!-- エラー -->
<div class="bg-red-50 border border-red-300 rounded-lg p-6">
  <p class="text-red-800">エラーメッセージ</p>
</div>
```

### プログレスバー

```html
<div class="relative w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
  <div class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300" style="width: 50%"></div>
</div>
```

---

## 5. アニメーション

### Motion One 設定

```typescript
import { animate } from 'motion';

// 要素のハイライト（チェック中）
await animate(element, {
  scale: 1.15,
  backgroundColor: '#facc15',
  borderColor: '#eab308',
}, { duration: 0.4, easing: 'ease-out' }).finished;

// 要素のグレーアウト（探索済み）
await animate(element, {
  scale: 1,
  backgroundColor: '#e5e5e5',
  borderColor: '#d4d4d4',
}, { duration: 0.2 }).finished;

// 発見時
await animate(element, {
  scale: 1.15,
  backgroundColor: '#22c55e',
  borderColor: '#16a34a',
}, { duration: 0.4, easing: 'ease-out' }).finished;
```

### CSS トランジション

```css
/* 基本トランジション */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-duration: 300ms;
}

/* 配列ボックス専用 */
.array-box {
  transition: transform 0.2s ease-out;
}
```

### 自動再生タイミング

- **ステップ間隔**: 800ms

---

## 6. レイアウトパターン

### ページ構造

```
┌─────────────────────────────────────┐
│ Header (border-b)                   │
├─────────────────────────────────────┤
│                                     │
│   Main Content                      │
│   (container mx-auto px-4 py-8)     │
│                                     │
│   ├── Introduction Section          │
│   ├── Visualization Section         │
│   ├── Algorithm Flow Section        │
│   ├── Code Section                  │
│   └── Math Section (details)        │
│                                     │
├─────────────────────────────────────┤
│ Footer (border-t bg-neutral-50)     │
└─────────────────────────────────────┘
```

### セクション構造

```html
<section id="section-name" class="mb-12">
  <h2 class="text-2xl font-bold text-neutral-800 mb-6">セクション見出し</h2>
  <!-- コンテンツ -->
</section>
```

### アルゴリズムステップ

```html
<div class="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
  <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
    1
  </div>
  <div>
    <h3 class="font-semibold text-neutral-800">ステップタイトル</h3>
    <p class="text-neutral-600">説明文</p>
  </div>
</div>
```

---

## 7. アイコン

### SVG アイコン仕様

- **サイズ**: `w-4 h-4`（小）、`w-5 h-5`（標準）、`w-8 h-8`（大）
- **スタイル**: `stroke="currentColor"`, `stroke-width="2"`, `fill="none"`
- **角**: `stroke-linecap="round"`, `stroke-linejoin="round"`

### 使用アイコン一覧

| アイコン | 用途 | ファイル |
|---------|------|---------|
| Play | 再生ボタン | `PlayIcon.astro` |
| Pause | 一時停止 | `PauseIcon.astro` |
| SkipForward | 次へ | `SkipForwardIcon.astro` |
| SkipBack | 前へ | `SkipBackIcon.astro` |
| RotateCcw | リセット | `RotateCcwIcon.astro` |
| Shuffle | ランダム化 | `ShuffleIcon.astro` |

---

## 8. レスポンシブデザイン

### ブレークポイント

| サイズ | 幅 | Tailwind プレフィックス |
|-------|-----|------------------------|
| モバイル | < 768px | なし（デフォルト） |
| タブレット | ≥ 768px | `md:` |
| デスクトップ | ≥ 1024px | `lg:` |

### 配列可視化のレスポンシブ

```html
<!-- 配列コンテナ（折り返し対応） -->
<div class="flex flex-wrap gap-4 justify-center items-end min-h-[240px]">
  <!-- 配列ボックス -->
</div>
```

---

## 9. アクセシビリティ

### 基本ルール

- すべてのボタンに `aria-label` を付与
- 無効化状態は `disabled` 属性で明示
- フォーカス可能な要素にフォーカススタイルを維持
- 色だけに依存しない情報伝達（アイコン + テキスト）

### 例

```html
<button aria-label="次のステップへ進む" disabled>
  <svg>...</svg>
  次へ
</button>
```

---

## 10. ファイル構成

```
src/
├── components/
│   ├── Layout.astro          # 共通レイアウト
│   ├── ArrayVisualizer.astro # 配列可視化
│   ├── StepController.astro  # ステップ制御
│   ├── AlgorithmStep.astro   # ステップ解説
│   ├── CodeBlock.astro       # コードブロック
│   ├── MathFormula.astro     # 数式表示
│   └── icons/                # SVG アイコン
├── styles/
│   └── global.css            # TailwindCSS + カスタムスタイル
└── pages/
    ├── index.astro           # ホームページ
    └── algorithms/
        └── linear-search.astro
```

---

## 更新履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2025-11-29 | 1.0.0 | 初版作成 |

