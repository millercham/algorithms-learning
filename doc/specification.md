# 1. **プロジェクト概要**

## **目的**

* "アルゴリズムの動作を視覚で理解できる" 学習サイトを Astro で構築する。
* 数学はあくまで **アルゴリズム理解の補助**として最小限だけ扱う。
* コードは **TypeScript のみ**（Playground と説明用）。
* 軽量・高速・シンプルを徹底し、Preact で最小限のインタラクティブ UI を実装。

> **📘 アーキテクチャ詳細**: `doc/architecture.md` を参照

## **対象**

* 一からアルゴリズムを学びたい人
* AtCoder 初心者
* 数学が得意ではないが、視覚で理解したい人
* “動きで理解できないと頭に入らない” タイプ

---

# 2. **技術選定**

## ■ Astro（コア）

* SSG に強い
* ほぼ静的（負荷ゼロ）
* 必要な部分だけ JS を注入できる（Islands Architecture）
* Vercel にホスト

---

## ■ インタラクティブ UI

### **Preact（Astro Islands）**

**採用理由**

* 軽量（React の 1/10、~3KB gzip）
* React 互換 API（hooks, JSX）
* Astro 公式サポート（`@astrojs/preact`）
* 30+ アルゴリズムへのスケーラビリティ

**注意**: Astro から Preact に関数を含むオブジェクトは渡せない。
各アルゴリズムに専用 Visualizer を作成する。

---

## ■ UIライブラリ

### **TailwindCSS**

* ユーティリティ CSS でシンプルに実装
* 共通デザインシステムを維持

---

## ■ アニメーション

### **CSS Transitions + Web Animations API**

**理由**

* 追加ライブラリ不要
* `transition-all duration-300` で基本アニメーション
* バウンス効果は `element.animate()` で実装
* 軽量でパフォーマンス良好

---

## ■ 数式

### **KaTeX**

軽くて高速。数式を綺麗に見せたい場面だけ使う。

---

## ■ コードハイライト

### **Prism.js**

---

# 3. **ディレクトリ構成**

```
algorithms-learning/
│
├─ src/
│   ├─ types/
│   │   └─ algorithm.ts           # AlgorithmDefinition, Step, ElementStatus
│   │
│   ├─ algorithms/                # アルゴリズム定義
│   │   ├─ index.ts               # 登録・エクスポート
│   │   ├─ linear-search.ts
│   │   ├─ binary-search.ts
│   │   └─ ...
│   │
│   ├─ hooks/
│   │   └─ useStepController.ts   # ステップ制御 Hook
│   │
│   ├─ pages/
│   │   ├─ index.astro
│   │   └─ algorithms/
│   │       ├─ linear-search.astro
│   │       ├─ binary-search.astro
│   │       └─ ...
│   │
│   ├─ components/
│   │   ├─ Layout.astro           # 共通レイアウト
│   │   ├─ AlgorithmStep.astro    # ステップ解説用
│   │   ├─ visualizer/            # Preact コンポーネント
│   │   │   ├─ index.ts
│   │   │   ├─ ArrayVisualizer.tsx
│   │   │   ├─ ArrayBox.tsx
│   │   │   ├─ StepController.tsx
│   │   │   ├─ LinearSearchVisualizer.tsx
│   │   │   └─ [Algorithm]Visualizer.tsx
│   │   └─ icons/                 # SVG アイコン
│   │
│   └─ styles/
│       └─ global.css
│
├─ doc/
│   ├─ specification.md           # この仕様書
│   ├─ architecture.md            # アーキテクチャ詳細
│   ├─ design-guidelines.md       # デザインガイドライン
│   └─ algorithm-list.md          # アルゴリズム一覧
│
└─ package.json
```

---

# 4. **ページ構造（アルゴリズム主体で統一）**

## 各 `algorithms/*.astro` は以下の構成で統一する：

## **1. Introduction（1スクリーンで見せ切る）**

* アルゴリズムの目的
* 入力例・出力例
* 可能なら小さなアニメーション

---

## **2. Visualization**

**サイトの核。**
Motion One を使って以下をアニメーション化：

* 配列要素が光る
* ボックスが移動
* “探索中”・“確定”の色変化
* 素因数分解なら Factor Tree
* Prefix Sum なら値の累積の変化

**軽い TSX を注入するだけで完結させる。**

---

## **3. Algorithm Flow（擬似コード）**

* ステップごとに分ける
* AlgorithmStep コンポーネントで統一デザイン
* ステップを押すと可視化が連動して動く

---

## **4. Code（TypeScript）**

* TS の実装のみ
* コメント最小限

---

## **5. Math**

数学は以下だけに絞る：

* なぜこのロジックで正しいのか
* √N の意味（試し割り）
* 約数の個数の性質
* 前処理の意味（累積和）

---

# **6.Playground の仕様**

例：素因数分解 (factor-tree)

### UX 要素：

* 入力欄
* 決定ボタン
* 木構造が動的に生成
* 素数が見つかると色が変わる
* “割れた瞬間”を Motion One で強調

### 内部仕様：

* 素因数分解は整数をバラすだけ
* 因数をノードとして構築
* ノードは TSX で描画
* Motion One の `animate` を逐次適用


---

# **7.デザイン仕様**

* **Tailwind neutral + blue**
* **コードは暗色テーマ**
* 数式は KaTeX
* ボックスアニメは淡い色（過剰にポップにしない）
* 背景は白 or minimal gray
* コンテンツ密度は高すぎない
* 可能な限り余白を広く取る

---

# **8.実装順序（MVP）**

お前の習熟と負担を最適化したルートがこれ：

## **MVP（最初の4ページ）**

1. linear-search
2. divisor-enumeration（数学とアルゴリズムの橋渡し）
3. prime-check
4. prime-factorization（試し割り版）

---

# 9. **フロントエンド SW アーキテクチャ（Astro Island 最適化版）**

## 9.1 全体構造：Island Architecture（Astro 流）

Astro の基本思想：

> **静的が主、動く部分だけ「Island」（React/TSX）として分離する。**

これに反すると、

- ビルドが重くなる
- JS バンドルが肥大化する
- Vercel 上でパフォーマンスが劣化する
- アルゴリズム可視化が重くなる

という最悪の展開になる。

### レイヤ構造イメージ

**[Static Layer]** 

- ページ本文
- 図解（静的 SVG）
- 数学補足（KaTeX）
- コード表示（Prism）

**[Interactive Layer (Islands)]**

- `ArrayVisualizer`
- `StepController`
- `AnimatedBox`
- `FactorTree`
- `PrefixSumPlayground` など


## 9.2 ディレクトリ構造

```text
src/
  pages/
    algorithms/
      linear-search.astro
      prefix-sum.astro
      sieve.astro
    concepts/
      number-theory.md
    playground/
      factor-tree/
        index.astro
        FactorTree.tsx
        animation.ts
      prefix-sum/

  components/
    static/            ← Astro 専用（静的）
      Layout.astro
      AlgorithmStep.astro
      MathFormula.astro
    islands/           ← 動く部分だけ TSX
      ArrayVisualizer.tsx
      AnimatedBox.tsx
      StepController.tsx
      FactorTree.tsx

  utils/
    math/              ← アルゴリズム本体（純 TS）
      prime.ts
      divisor.ts
      sieve.ts
    ui/                ← UI 補助ロジック
      animateBox.ts
      colorScheme.ts

  styles/
    global.css
```

## 9.3 レイヤー構造

### 🧱 Layer 1: Static Presentation（静的表示）

- Astro / Markdown
- 数式（KaTeX）
- 図解（SVG）
- コードハイライト（Prism）


### 🧠 Layer 2: Algorithm Logic（純 TypeScript）

アルゴリズムそのものの処理ロジック（例: `divisor.ts`, `prime.ts`, `binarySearch.ts`, `prefixSum.ts`）。

- UI とは完全に分離
- TypeScript の純粋関数のみ
- 副作用なし
- Playground と Visualization で共通利用

> ロジックとアニメーションを混ぜない。必ず分離する。

### 🎨 Layer 3: Visualization（TSX Islands + Motion One）

動く部分だけを Island 化する。

- `ArrayVisualizer.tsx`（配列表示 + ハイライト）
- `AnimatedBox.tsx`（動くボックス）
- `StepController.tsx`（Next Step ボタン）
- `FactorTree.tsx`（素因数分解木）

仕様:

- UI 表現とアニメーションのみを担当
- ロジック層（`utils/math/*`）を呼び出すだけ
- Motion One を直接 import
- 状態管理はローカル state（`useState` など）のみ

> React/TSX はこのレイヤ内に閉じ込める。

### 🧩 Layer 4: Playground（ページ全体）

- 入力欄
- 「可視化スタート」ボタン
- 結果の動的描画

Playground はページ単位で完結させ、複数アルゴリズムが互いに干渉しないようにする。  
Astro ページ → 必要な Island を注入 → UI が動く、という流れを徹底する。

## 9.4 データフロー（最小で明確な流れ）

```text
ユーザー操作
   ↓
StepController.tsx        ← 「次のステップ」指示
   ↓
utils/math/*.ts           ← アルゴリズム本体
   ↓
計算ステップ列（結果）
   ↓
ArrayVisualizer.tsx       ← 特定インデックスの強調表示
   ↓
Motion One                ← 色や位置のアニメーション
   ↓
画面表示
```

UI と計算ロジックが絡まないよう、  
**「ステップ列（履歴）をつくるロジック」** と  
**「ステップを順に再生する UI」** を分離する設計にする。

## 9.5 アニメーションのアーキテクチャ

Motion One が扱うのは **UI 状態だけ** とする。

```ts
const steps = runLinearSearch(array, target);
// steps: [{ index: 0 }, { index: 1 }, ...]
```

TSX 側はこの `steps` を順番に処理して、

```ts
animate(element, { backgroundColor: "yellow" });
```

のように UI だけを動かす。  
ロジック層にはアニメーションコードを混ぜない。

## 9.6 コンポーネントの責務境界

- **Astro コンポーネント（静的）**
  - `Layout`
  - `AlgorithmStep`
  - `MathFormula`
  - Static diagrams など

- **Island コンポーネント（動的）**
  - `ArrayVisualizer`
  - `StepController`
  - `AnimatedBox`
  - `FactorTree`
  - `PrefixSumSimulator` など

- **Utility（純粋ロジック）**
  - `prime.ts`
  - `divisor.ts`
  - `sieve.ts`


## 9.7 このアーキテクチャのメリット

- JS が極端に少なくなる
- Vercel の CDN 最適化が最大限に効く
- バンドル崩壊（巨大化）を防げる
- UI と計算ロジックが完全に分離される
- 可視化が高速でスムーズになる
- 新しいアルゴリズムページを簡単に追加できる
- 「読む部分」は Astro が強みを発揮し、  
  「動く部分」は最小の TSX で完結する
