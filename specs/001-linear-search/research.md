# 技術リサーチ: 線形探索 (Linear Search) ページ

**ブランチ (Branch)**: `001-linear-search`  
**作成日 (Date)**: 2025-11-28  
**ステータス (Status)**: 完了

## 概要

線形探索ページの実装に必要な技術調査結果をまとめる。**React は使用せず**、純粋な Astro コンポーネントと Motion One の vanilla API で実装する。

---

## 調査項目

### 1. Astro でのクライアントサイドインタラクション

**課題**: React を使わずに、Astro でインタラクティブな可視化を実現する方法

**調査結果**:
- Astro コンポーネントの `<script>` タグ内で vanilla JavaScript/TypeScript を記述
- `is:inline` を付けないことで、Astro がスクリプトをバンドル・最適化
- DOM 操作は `document.querySelector` などの標準 API を使用

**決定**: `<script>` タグ内の TypeScript でインタラクションを実装
- **理由**: React 不使用の要件を満たし、Astro の軽量性を最大化
- **代替案**: Alpine.js → 追加依存が発生

**使用パターン**:
```astro
<button id="play-btn">再生</button>

<script>
  const playBtn = document.getElementById('play-btn');
  playBtn?.addEventListener('click', () => {
    // インタラクション処理
  });
</script>
```

---

### 2. Motion One Vanilla API の使用方法

**課題**: React なしでアニメーションを実装する方法

**調査結果**:
- Motion One は `motion/react` 以外に、vanilla JavaScript 用の API を提供
- `import { animate } from 'motion'` で DOM 要素を直接アニメーション
- Web Animations API ベースで軽量・高速

**決定**: Motion One の vanilla API を使用
- **理由**: React 不使用で同等のアニメーション品質を実現
- **代替案**: CSS Animations → 状態連動が複雑

**使用パターン**:
```typescript
import { animate } from 'motion';

// 要素をハイライト
const element = document.querySelector(`[data-index="0"]`);
await animate(element, { 
  scale: 1.15, 
  backgroundColor: '#facc15' 
}, { 
  duration: 0.4, 
  easing: 'ease-out' 
}).finished;
```

---

### 3. クライアントサイド状態管理（React なし）

**課題**: React の useState なしで状態を管理する方法

**調査結果**:
- モジュールスコープの変数でシンプルに状態管理
- 状態変更時に手動で UI を更新
- 必要に応じてカスタムイベントで通知

**決定**: モジュール変数 + 手動 UI 更新
- **理由**: 単純明快、追加ライブラリ不要
- **代替案**: Nanostores → 小規模なので過剰

**状態構造**:
```typescript
// scripts/linear-search-controller.ts
interface State {
  array: number[];
  target: number;
  steps: SearchStep[];
  currentStep: number;
  isPlaying: boolean;
  foundIndex: number | undefined;
}

let state: State = {
  array: [23, 45, 12, 78, 34, 56, 89, 23, 67],
  target: 34,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  foundIndex: undefined
};

function updateUI() {
  // DOM を直接更新
}
```

---

### 4. アルゴリズムロジックと UI の分離

**課題**: 仕様書の原則に従い、ロジックと UI を分離する方法

**調査結果**:
- アルゴリズムロジックは純粋な TypeScript 関数として分離
- UI 更新は別モジュールで DOM 操作として実装
- 両者は疎結合を維持

**決定**: 2つのモジュールに分離
1. `src/utils/algorithms/linearSearch.ts` - 純粋なアルゴリズムロジック
2. `src/scripts/linear-search-controller.ts` - UI 制御とアニメーション

---

### 5. アイコンの実装

**課題**: `lucide-react` が使えないため、別のアイコン手法が必要

**調査結果**:
- **Option A**: SVG を直接 Astro コンポーネントに埋め込み
- **Option B**: `astro-icon` パッケージを使用
- **Option C**: Heroicons の SVG ファイルをインポート

**決定**: SVG を直接埋め込み
- **理由**: 追加依存なし、必要なアイコンのみ含める
- **代替案**: `astro-icon` → 追加依存だが、アイコン数が増えた場合に検討

**使用パターン**:
```astro
<!-- PlayIcon.astro -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polygon points="5 3 19 12 5 21 5 3"></polygon>
</svg>
```

---

### 6. TailwindCSS クラスの整理

**課題**: サンプルコードの TailwindCSS クラスをプロジェクトのデザイントークンに統一

**調査結果**:
- サンプルでは `neutral-*`、`blue-*`、`green-*` などの Tailwind デフォルトカラーを使用
- 憲法のデザイン仕様: 「Tailwind neutral + blue」「淡い色」「背景は白 or minimal gray」

**決定**: サンプルのカラースキームをそのまま採用
- **理由**: 既に憲法のデザイン仕様に準拠している

---

### 7. Astro での共通レイアウト

**課題**: `Layout.astro` コンポーネントの構造

**調査結果**:
- Astro のレイアウトは `<slot />` で子コンテンツを受け取る
- ヘッダー、フッター、メタタグ、グローバルスタイルを共通化

**決定**: 最小限のレイアウトコンポーネントを作成
- **構造**:
  - `<head>`: メタタグ、TailwindCSS、フォント
  - `<body>`: ナビゲーション（将来）、`<slot />`、フッター

---

### 8. Prism.js / コードハイライト

**課題**: TypeScript コードブロックのシンタックスハイライト

**調査結果**:
- Astro はビルトインで Prism.js / Shiki をサポート
- `astro.config.mjs` で設定可能

**決定**: Astro のビルトイン Markdown コードブロック + Prism テーマを使用
- **理由**: 追加依存を最小化

---

### 9. KaTeX 数式レンダリング

**課題**: Math セクションでの数式表示

**調査結果**:
- KaTeX を SSR で静的レンダリング可能
- `katex.renderToString()` を Astro コンポーネント内で呼び出し

**決定**: カスタム `MathFormula.astro` コンポーネントを作成
- **理由**: 再利用可能、クライアント JS 不要
- **実装**:
```astro
---
import katex from 'katex';
const { formula } = Astro.props;
const html = katex.renderToString(formula, { throwOnError: false });
---
<span set:html={html} />
```

---

## 未解決事項

なし（すべての技術的疑問が解決済み）

---

## 参考リソース

- [Astro Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/)
- [Motion One Animate](https://motion.dev/docs/animate)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [KaTeX Documentation](https://katex.org/docs/api.html)
